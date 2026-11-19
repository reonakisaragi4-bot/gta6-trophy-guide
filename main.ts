// Leonida Ledger — the entrypoint for the gta6-trophy-guide-01 bounty.
// The guide itself is plain static files under app/ (no build step, works
// offline in desktop Chrome), plus 3 or 4 screenshots of it under
// screenshots/. This program hands the entry in: it copies app/ and
// screenshots/ beside this file into the output directory and writes
// output/dossier.json with the vendored make.fun library, which the gate
// rebuilds and compares byte for byte. Keep vendor/makefun-frontend.ts
// exactly as the kit shipped it.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, "app"), join(outputDir, "app"), { recursive: true });

// Fail fast when the screenshots are missing: the gate needs 3 or 4, and a
// dossier built without them would be refused anyway.
const shotFiles = existsSync(join(repoRoot, "screenshots"))
  ? readdirSync(join(repoRoot, "screenshots")).filter((name) => !name.startsWith("."))
  : [];
if (shotFiles.length === 0) {
  throw new Error("No screenshots: put 3 or 4 renders of the guide in screenshots/ first.");
}
mkdirSync(join(outputDir, "screenshots"), { recursive: true });
if (existsSync(join(repoRoot, "screenshots"))) {
  cpSync(join(repoRoot, "screenshots"), join(outputDir, "screenshots"), { recursive: true });
}

// The gate's own caps, as the starter records them: at most 4 screenshots of
// at most 256 KiB each, app/ at most 993 files and directories and 48 MiB,
// and the dossier text at most 163840 bytes.
writeFileSync(
  join(outputDir, "dossier.json"),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
