#!/bin/sh
# Reads a unified diff (git diff -U0) on stdin and fails if it adds a secret.
# Used by the pre-commit hook and by CI on every PR. Rules: AGENTS.md section 8.
#
# Blocks:
#   - secret files: .env* (except .env.example), *.pem, *.key
#   - private key blocks, Anthropic keys, Telegram bot tokens
#   - a private key assigned to a key-like name, anywhere
#   - any bare 0x + 64 hex literal outside Markdown (tx hashes belong in docs, not code)
# A line that is not a secret (e.g. a public tx hash in a test) can end with: secret-scan: allow

tab=$(printf '\t')

# awk only parses the diff; patterns use grep -E (portable interval support).
# Output: F<TAB>path for each file, L<TAB>path<TAB>line<TAB>text for each added line.
parsed=$(awk -v OFS="$tab" '
  /^\+\+\+ / { file = substr($0, 7); sub(/^b\//, "", file); print "F", file; next }
  /^@@/ { split($3, plus, ","); line = substr(plus[1], 2) - 1; next }
  /^\+/ { line++; print "L", file, line, substr($0, 2) }
')

found=0
flag() { found=1; printf '  %s  %s\n' "$1" "$2"; }

for file in $(printf '%s\n' "$parsed" | grep "^F$tab" | cut -f2); do
  base=${file##*/}
  case "$base" in
    .env.example) ;;
    .env*) flag "$file" "secret file (.env): never commit it" ;;
    *.pem|*.key) flag "$file" "key file: never commit it" ;;
  esac
done

added=$(printf '%s\n' "$parsed" | grep "^L$tab" | grep -v 'secret-scan: allow')
check() {
  printf '%s\n' "$added" | grep -E -e "$1" | while IFS="$tab" read -r _ file line _; do
    printf '  %s:%s  %s\n' "$file" "$line" "$2"
  done
}

hits=$(
  check '-----BEGIN [A-Z ]*PRIVATE KEY-----' "private key block"
  check 'sk-ant-[A-Za-z0-9_-]{20,}' "Anthropic API key"
  check '[0-9]{8,10}:[A-Za-z0-9_-]{35}' "Telegram bot token"
  check "(PRIVATE_KEY|[Pp]rivate[Kk]ey|private_key|SECRET|MNEMONIC|[Mm]nemonic)[\"']?[[:space:]]*[:=][[:space:]]*[\"']?0x[0-9a-fA-F]{64}" "private key value"
  # Outside Markdown only: docs may quote public tx hashes.
  added=$(printf '%s\n' "$added" | grep -vE "^L$tab[^$tab]*\.md$tab")
  check '0x[0-9a-fA-F]{64}([^0-9a-fA-F]|$)' "0x + 64 hex literal (private key?)"
)
[ -n "$hits" ] && { found=1; printf '%s\n' "$hits" | sort -u; }

if [ $found -ne 0 ]; then
  echo "Vaquita: possible secret above. Remove it (keys only go in .env, which is git-ignored)." >&2
  echo "         If it is really not a secret, end that line with: secret-scan: allow" >&2
  echo "         If a real key was ever pushed, treat it as leaked: move the funds and rotate it." >&2
  exit 1
fi
