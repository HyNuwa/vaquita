// Links each agent's skills folder to .agents/skills, the only copy in git.
// Codex, Cursor, Gemini CLI and Copilot read .agents/skills directly; the folders
// below don't, so they get a link. Links are created here (run by `npm install`)
// instead of committed: on Windows git checks committed symlinks out as plain text
// files unless Developer Mode and core.symlinks are on. Windows gets a junction,
// which needs no admin rights.
import { lstatSync, mkdirSync, readlinkSync, readdirSync, rmSync, symlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, ".agents", "skills");
const links = [".claude/skills", ".devin/skills", ".windsurf/skills"];

for (const link of links) {
  const path = join(root, link);
  try {
    let stat = null;
    try { stat = lstatSync(path); } catch {}

    if (stat?.isSymbolicLink()) {
      if (resolve(dirname(path), readlinkSync(path)) === source) continue;
      rmSync(path);
    } else if (stat?.isDirectory() && readdirSync(path).length === 0) {
      rmSync(path, { recursive: true });
    } else if (stat) {
      // Real files there (an old checkout or local skills): never delete them.
      console.warn(`skills: ${link} is not a link; move its contents to .agents/skills and delete it.`);
      continue;
    }

    mkdirSync(dirname(path), { recursive: true });
    symlinkSync("../.agents/skills", path, "junction");
  } catch (error) {
    // Never break `npm install` over this.
    console.warn(`skills: could not link ${link}: ${error.message}`);
  }
}
