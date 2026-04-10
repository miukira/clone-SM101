#!/usr/bin/env node
/**
 * CLI: normalisasi kartu brand (karakter + logo) → WebP 290×180.
 * Usage:
 *   node scripts/normalize-brand-card.mjs --character path/to/char.png --logo path/to/logo.png --out out.webp
 *   node scripts/normalize-brand-card.mjs ... --logoWidthMultiplier 1.2 --logoMacBlackToWhite
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeBrandCardToWebp, BRAND_CARD } from './lib/brandCardNormalize.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getArg(name, def = undefined) {
  const i = process.argv.indexOf(name);
  if (i === -1) return def;
  return process.argv[i + 1] ?? def;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function parseNum(name, def) {
  const v = getArg(name);
  if (v === undefined) return def;
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

async function main() {
  const character = getArg('--character');
  const logo = getArg('--logo');
  const out = getArg('--out');

  if (!character || !logo || !out) {
    console.error(
      `Usage: node scripts/normalize-brand-card.mjs --character <file> --logo <file> --out <file.webp>\n` +
        `Optional: --logoWidthMultiplier <n> --logoLeftFrac <n> --logoTopOffset <n> ` +
        `--logoVerticalAlign center|top --logoTopPad <n> --logoMacBlackToWhite --logoTrim ` +
        `--characterVerticalAlign bottom|top|center --characterTopPad <n> --characterTrim ` +
        `--characterWidthMultiplier <n> --frameIdx <0-23>\n` +
        `Output size: ${BRAND_CARD.CARD_W}×${BRAND_CARD.CARD_H} WebP`
    );
    process.exit(1);
  }

  const options = {
    logoWidthMultiplier: parseNum('--logoWidthMultiplier', 1),
    logoLeftFrac: parseNum('--logoLeftFrac', 0.48),
    logoTopOffset: parseNum('--logoTopOffset', 0),
    logoVerticalAlign: getArg('--logoVerticalAlign', 'center'),
    logoTopPad: getArg('--logoTopPad') !== undefined ? parseNum('--logoTopPad', 4) : undefined,
    logoMacBlackToWhite: hasFlag('--logoMacBlackToWhite'),
    logoTrim: hasFlag('--logoTrim'),
    characterVerticalAlign: getArg('--characterVerticalAlign', 'bottom'),
    characterTopPad: parseNum('--characterTopPad', 0),
    characterTrim: hasFlag('--characterTrim'),
    characterWidthMultiplier: parseNum('--characterWidthMultiplier', 1),
    frameIdx: parseNum('--frameIdx', 0),
  };

  const buf = await normalizeBrandCardToWebp(character, logo, options);
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  fs.writeFileSync(out, buf);
  console.log(`Wrote ${out} (${buf.length} bytes)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
