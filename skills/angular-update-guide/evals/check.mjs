#!/usr/bin/env node
// Deterministic grader for the angular-update-guide eval.
//
// Usage: node check.mjs <step> <neighbour-step>...
//
//   step            the reference file whose items must all appear in BREAKING.md
//   neighbour-step  reference files whose items must NOT appear in BREAKING.md
//
// Expected values are derived at grading time from the skill's own
// `references/*.md`, so they follow upstream instead of being pinned here.
// Some identifiers legitimately appear in several steps (`update
// @angular/material` is in eleven of them), so a neighbour's identifier only
// counts as contamination when the step under test does not also have it.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const [step, ...neighbours] = process.argv.slice(2);

function emit(score, details, checks = []) {
  process.stdout.write(JSON.stringify({ score, details, checks }));
  process.exit(0);
}

// The runner injects the skill into the workspace under an agent discovery dir.
function findReferencesDir() {
  for (const base of ['.claude/skills', '.agents/skills']) {
    if (!existsSync(base)) continue;
    for (const name of readdirSync(base)) {
      const dir = join(base, name, 'references');
      if (existsSync(dir)) return dir;
    }
  }
  return null;
}

// Every item in a reference file is followed by an indented line holding only
// upstream's identifier for it, as an inline code span.
function identifiers(dir, name) {
  const text = readFileSync(join(dir, `${name}.md`), 'utf8');
  return new Set([...text.matchAll(/^\s+`([^`]+)`\s*$/gm)].map((m) => m[1]));
}

// Inline code spans of the answer, ignoring fenced blocks.
function codeSpans(text) {
  const flat = text.replace(/^```[\s\S]*?^```/gm, '');
  return new Set([...flat.matchAll(/`([^`\n]+)`/g)].map((m) => m[1]));
}

const referencesDir = findReferencesDir();
if (!referencesDir) emit(0, 'No skill references/ directory in the workspace.');
if (!existsSync('BREAKING.md')) emit(0, 'BREAKING.md was not created.');

const required = identifiers(referencesDir, step);
if (required.size === 0) emit(0, `No items found in ${step}.md.`);

const contaminants = new Set();
for (const neighbour of neighbours) {
  for (const id of identifiers(referencesDir, neighbour)) {
    if (!required.has(id)) contaminants.add(id);
  }
}

const written = codeSpans(readFileSync('BREAKING.md', 'utf8'));
const missing = [...required].filter((id) => !written.has(id));
const leaked = [...contaminants].filter((id) => written.has(id));

const found = required.size - missing.length;
const coverage = found / required.size;
const clean = leaked.length === 0 ? 1 : 0;

emit(Number((0.7 * coverage + 0.3 * clean).toFixed(4)), `${found}/${required.size} items, ${leaked.length} stray`, [
  {
    name: 'required-items',
    passed: missing.length === 0,
    message: missing.length === 0 ? `all ${required.size} items of ${step} present` : `missing: ${missing.join(', ')}`,
  },
  {
    name: 'no-adjacent-versions',
    passed: clean === 1,
    message: clean === 1 ? `none of the ${contaminants.size} adjacent-step items present` : `stray: ${leaked.join(', ')}`,
  },
]);
