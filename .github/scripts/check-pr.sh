#!/bin/sh
# Server-side copy of the team rules. Local hooks can be skipped (not installed,
# another machine, the GitHub web editor); this runs on every PR and can't.
#   sh .github/scripts/check-pr.sh <base-ref> [head-ref]   e.g. origin/staging
# Rules: AGENTS.md sections 4, 6, 8 and 9.

base=${1:?usage: check-pr.sh <base-ref> [head-ref]}
head=${2:-HEAD}
fail=0

echo "== Commit messages"
tmp=$(mktemp)
for sha in $(git rev-list --no-merges "$base..$head"); do
  git log -1 --format=%B "$sha" > "$tmp"
  sh .githooks/commit-msg "$tmp" || { echo "   in $(git log -1 --format='%h %an' "$sha")"; fail=1; }
done
rm -f "$tmp"

echo "== Secrets"
git diff -U0 --no-color --diff-filter=ACMR "$base...$head" | sh .githooks/lib/scan-secrets.sh || fail=1

echo "== Member log"
changed=$(git diff --name-only "$base...$head")
if [ -n "$changed" ] && echo "$changed" | grep -qv '^docs/'; then
  if ! echo "$changed" | grep -qE '^docs/miembros/[^/]+/bitacora\.md$'; then
    echo "  This PR changes code but no docs/miembros/<member>/bitacora.md. See AGENTS.md section 4."
    fail=1
  fi
fi

echo "== Only the core talks to the chain"
# Rule 9: every tx goes through packages/core/src/chain/tagged-sender.ts.
direct=$(git grep -nE 'sendTransaction|writeContract|sendRawTransaction|createWalletClient' "$head" -- \
  'apps/*' 'packages/*' ':!packages/core/src/chain/*' ':!**/*.md' | sed "s/^$head://")
if [ -n "$direct" ]; then
  echo "$direct" | sed 's/^/  /'
  echo "  Send transactions only through packages/core/src/chain/tagged-sender.ts."
  fail=1
fi

[ $fail -eq 0 ] && echo "All checks passed."
exit $fail
