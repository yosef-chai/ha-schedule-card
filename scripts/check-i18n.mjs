#!/usr/bin/env node
// Verifies that every language file under src/localize/ contains every key
// present in the source-of-truth en.json. Exits 1 with a clear report on
// missing keys so CI can block merges that ship partial translations.

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const localizeDir = join(__dirname, "..", "src", "localize");

function flatten(obj, prefix = "") {
  const out = [];
  for (const [k, v] of Object.entries(obj ?? {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out.push(...flatten(v, key));
    } else {
      out.push(key);
    }
  }
  return out;
}

const en = JSON.parse(readFileSync(join(localizeDir, "en.json"), "utf8"));
const enKeys = new Set(flatten(en));

const langFiles = readdirSync(localizeDir).filter(
  (f) => f.endsWith(".json") && f !== "en.json",
);

let failed = false;
for (const file of langFiles) {
  const lang = file.replace(/\.json$/, "");
  const data = JSON.parse(readFileSync(join(localizeDir, file), "utf8"));
  const langKeys = new Set(flatten(data));

  const missing = [...enKeys].filter((k) => !langKeys.has(k));
  const extra = [...langKeys].filter((k) => !enKeys.has(k));

  if (missing.length || extra.length) {
    failed = true;
    console.error(`\n[i18n] Language "${lang}" has issues:`);
    if (missing.length) {
      console.error(`  Missing keys (${missing.length}):`);
      for (const k of missing) console.error(`    - ${k}`);
    }
    if (extra.length) {
      console.error(`  Extra keys not in en.json (${extra.length}):`);
      for (const k of extra) console.error(`    + ${k}`);
    }
  } else {
    console.log(`[i18n] "${lang}" is in sync with en.json (${enKeys.size} keys).`);
  }
}

if (failed) {
  console.error("\n[i18n] Translation check failed.");
  process.exit(1);
} else {
  console.log("\n[i18n] All languages are in sync.");
}
