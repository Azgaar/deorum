#!/usr/bin/env node

/**
 * i18n:check — validates all locale bundles against the English source.
 *
 * Checks:
 *   1. Key parity      — every key present in EN must exist in each locale (no missing, no extra)
 *   2. Placeholders    — {{variable}} tokens must be identical in every translation
 *   3. HTML tags       — HTML tags must be preserved (same tags, though order may differ)
 *
 * Exit code 1 if any violation is found (suitable for CI).
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, '../src/lib/locales');
const SOURCE_LOCALE = 'en';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Flatten a nested object to dot-path keys. */
function flatten(obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(acc, flatten(value, path));
    } else {
      acc[path] = value;
    }
    return acc;
  }, {});
}

/** Extract all {{variable}} placeholder tokens from a string. */
function placeholders(str) {
  return [...(str.matchAll(/\{\{[^}]+\}\}/g) ?? [])].map((m) => m[0]).sort();
}

/** Extract all HTML tag names from a string (e.g. ['a', 'i', 'strong']). */
function htmlTags(str) {
  return [...(str.matchAll(/<\/?([a-z][a-z0-9]*)[^>]*>/gi) ?? [])]
    .map((m) => m[1].toLowerCase())
    .sort();
}

/** Read and parse a JSON file; returns null on missing file. */
function readJson(path) {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf-8'));
}

// ─── Discover locales and bundles ────────────────────────────────────────────

const allLocales = readdirSync(LOCALES_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const targetLocales = allLocales.filter((l) => l !== SOURCE_LOCALE);

if (targetLocales.length === 0) {
  console.log('No non-source locales found. Nothing to check.');
  process.exit(0);
}

// Bundles are any JSON files present in the source locale directory.
const bundles = readdirSync(join(LOCALES_DIR, SOURCE_LOCALE))
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace('.json', ''));

console.log(`Source locale : ${SOURCE_LOCALE}`);
console.log(`Target locales: ${targetLocales.join(', ')}`);
console.log(`Bundles       : ${bundles.join(', ')}\n`);

// ─── Run checks ──────────────────────────────────────────────────────────────

let errors = 0;

function fail(msg) {
  console.error(`  ✗  ${msg}`);
  errors++;
}

for (const bundle of bundles) {
  const sourcePath = join(LOCALES_DIR, SOURCE_LOCALE, `${bundle}.json`);
  const sourceRaw = readJson(sourcePath);
  if (!sourceRaw) {
    console.warn(`  ⚠  Source bundle not found: ${sourcePath}`);
    continue;
  }
  const sourceFlat = flatten(sourceRaw);
  const sourceKeys = new Set(Object.keys(sourceFlat));

  for (const locale of targetLocales) {
    const targetPath = join(LOCALES_DIR, locale, `${bundle}.json`);
    const targetRaw = readJson(targetPath);

    console.log(`[${locale}/${bundle}]`);

    if (!targetRaw) {
      fail(`Missing bundle file: ${targetPath}`);
      continue;
    }

    const targetFlat = flatten(targetRaw);
    const targetKeys = new Set(Object.keys(targetFlat));

    // 1. Key parity
    for (const key of sourceKeys) {
      if (!targetKeys.has(key)) {
        fail(`Missing key: ${key}`);
      }
    }
    for (const key of targetKeys) {
      if (!sourceKeys.has(key)) {
        fail(`Extra key not in source: ${key}`);
      }
    }

    // 2. Placeholders + 3. HTML tags (only for keys present in both)
    for (const key of sourceKeys) {
      if (!targetKeys.has(key)) continue; // already reported as missing

      const srcVal = String(sourceFlat[key] ?? '');
      const tgtVal = String(targetFlat[key] ?? '');

      if (tgtVal === '') {
        fail(`Empty value: ${key}`);
        continue;
      }

      const srcPlaceholders = placeholders(srcVal);
      const tgtPlaceholders = placeholders(tgtVal);
      if (JSON.stringify(srcPlaceholders) !== JSON.stringify(tgtPlaceholders)) {
        fail(
          `Placeholder mismatch on "${key}"\n` +
            `       source: ${srcPlaceholders.join(', ') || '(none)'}\n` +
            `       target: ${tgtPlaceholders.join(', ') || '(none)'}`
        );
      }

      const srcTags = htmlTags(srcVal);
      const tgtTags = htmlTags(tgtVal);
      if (JSON.stringify(srcTags) !== JSON.stringify(tgtTags)) {
        fail(
          `HTML tag mismatch on "${key}"\n` +
            `       source tags: ${srcTags.join(', ') || '(none)'}\n` +
            `       target tags: ${tgtTags.join(', ') || '(none)'}`
        );
      }
    }

    if (errors === 0) console.log('  ✓  OK');
  }
}

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log('');
if (errors > 0) {
  console.error(`i18n:check failed with ${errors} error${errors === 1 ? '' : 's'}.`);
  process.exit(1);
} else {
  console.log('i18n:check passed — all locales are in sync.');
}
