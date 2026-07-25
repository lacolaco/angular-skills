import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '..', 'data', 'recommendations.json');
const SKILL_DIR = path.join(__dirname, '..', 'skills', 'angular-update-guide');
const OUTPUT_DIR = path.join(SKILL_DIR, 'references');
const SKILL_MD_PATH = path.join(SKILL_DIR, 'SKILL.md');

interface Step {
  step: string;
  action: string;
  possibleIn: number;
  necessaryAsOf: number;
  level: number;
  ngUpgrade?: boolean;
  material?: boolean;
  windows?: boolean;
}

export interface Version {
  name: string;
  number: number;
}

interface RecommendationsData {
  source: {repo: string; path: string; commitSha: string};
  license: string;
  recommendations: Step[];
  versions: Version[];
}

// Mirrors ApplicationComplexity's names, see update.component.ts
// `getComplexityLevelName`.
const LEVEL_NAMES: Record<number, string> = {1: 'Basic', 2: 'Medium', 3: 'Advanced'};

const UNRELEASED_WARNING =
  'Plans for releases after the current major release are not finalized and may change. ' +
  'These recommendations are based on scheduled deprecations.';

/** Mirrors update.component.ts `optionList` tags (ngUpgrade / material / windows). */
function optionTags(step: Step): string[] {
  const tags: string[] = [];
  if (step.ngUpgrade === true) tags.push('[ngUpgrade only]');
  if (step.material === true) tags.push('[Angular Material only]');
  if (step.windows === true) tags.push('[Windows only]');
  if (step.windows === false) tags.push('[non-Windows only]');
  return tags;
}

function renderItem(step: Step): string {
  const tags = [`[${LEVEL_NAMES[step.level]}]`, ...optionTags(step)].join(' ');
  return `- **${tags}** ${step.action}\n  \`${step.step}\``;
}

function renderSection(title: string, steps: Step[]): string {
  if (steps.length === 0) return '';
  return `## ${title}\n\n${steps.map(renderItem).join('\n\n')}\n`;
}

interface Bucketed {
  before: Step[];
  during: Step[];
  after: Step[];
}

/** Faithful port of update.component.ts `showUpdatePath()` bucketing, minus
 * the level/options filter (we render all levels and options here). */
function classify(recommendations: Step[], from: number, to: number): Bucketed {
  const before: Step[] = [];
  const during: Step[] = [];
  const after: Step[] = [];

  for (const step of recommendations) {
    if (step.necessaryAsOf <= from) continue;

    if (step.possibleIn <= from && step.necessaryAsOf >= from) {
      before.push(step);
    } else if (step.possibleIn > from && step.necessaryAsOf <= to) {
      during.push(step);
    } else if (step.possibleIn <= to) {
      after.push(step);
    }
  }

  return {before, during, after};
}

function renderStep(
  data: RecommendationsData,
  from: Version,
  to: Version,
  isLatest: boolean,
): string {
  const {before, during, after} = classify(data.recommendations, from.number, to.number);
  const fromMajor = Math.floor(from.number / 100);
  const toMajor = Math.floor(to.number / 100);

  const parts: string[] = [];
  parts.push(`# Angular ${fromMajor} → ${toMajor}`);
  parts.push('');
  parts.push(`Generated from angular/angular @ ${data.source.commitSha}`);
  parts.push('');
  if (isLatest) {
    parts.push(`> ${UNRELEASED_WARNING}`);
    parts.push('');
  }

  const sections = [
    renderSection('Before the update', before),
    renderSection('During the update', during),
    renderSection('After the update', after),
  ].filter((section) => section.length > 0);
  parts.push(sections.join('\n'));

  return parts.join('\n').trimEnd() + '\n';
}

export interface MajorPair {
  from: Version;
  to: Version;
}

/** Adjacent `.0` version pairs from v6 onward. Shared by reference-file
 * generation and the SKILL.md index, so both stay in sync by construction. */
export function computeMajorPairs(versions: Version[]): MajorPair[] {
  // Only the `.0` entries mark a major version boundary.
  const majorVersions = versions
    .filter((v) => v.number % 100 === 0)
    .sort((a, b) => a.number - b.number);

  const pairs: MajorPair[] = [];
  for (let i = 0; i < majorVersions.length - 1; i++) {
    const from = majorVersions[i];
    if (from.number < 600) continue;
    pairs.push({from, to: majorVersions[i + 1]});
  }
  return pairs;
}

/** Bullet list of reference file paths, one per major pair, for the
 * "Available references" section of SKILL.md. */
export function renderReferenceIndex(versions: Version[]): string {
  return computeMajorPairs(versions)
    .map(({from, to}) => {
      const fromMajor = Math.floor(from.number / 100);
      const toMajor = Math.floor(to.number / 100);
      return `- \`references/v${fromMajor}-to-v${toMajor}.md\``;
    })
    .join('\n');
}

/** Replaces the text strictly between `<!-- {marker}:START -->` and
 * `<!-- {marker}:END -->` (markers themselves are kept). */
export function replaceBetweenMarkers(content: string, marker: string, replacement: string): string {
  const start = `<!-- ${marker}:START -->`;
  const end = `<!-- ${marker}:END -->`;
  const startIdx = content.indexOf(start);
  const endIdx = content.indexOf(end);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`missing ${marker} markers in SKILL.md`);
  }
  return content.slice(0, startIdx + start.length) + replacement + content.slice(endIdx);
}

/** Rewrites the generated parts of SKILL.md: the reference index and the
 * upstream commit SHA. Everything outside the marker pairs is untouched. */
export function updateSkillMd(skillMdContent: string, versions: Version[], commitSha: string): string {
  let content = skillMdContent;
  content = replaceBetweenMarkers(content, 'REFERENCES', `\n${renderReferenceIndex(versions)}\n`);
  content = replaceBetweenMarkers(content, 'SOURCE', `\`${commitSha}\``);
  return content;
}

function main() {
  const data: RecommendationsData = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));

  const pairs = computeMajorPairs(data.versions);
  const maxVersionNumber = Math.max(...data.versions.map((v) => v.number));

  mkdirSync(OUTPUT_DIR, {recursive: true});

  for (const {from, to} of pairs) {
    const fromMajor = Math.floor(from.number / 100);
    const toMajor = Math.floor(to.number / 100);
    const outputPath = path.join(OUTPUT_DIR, `v${fromMajor}-to-v${toMajor}.md`);
    writeFileSync(outputPath, renderStep(data, from, to, to.number === maxVersionNumber), 'utf-8');
  }

  const skillMdContent = readFileSync(SKILL_MD_PATH, 'utf-8');
  writeFileSync(SKILL_MD_PATH, updateSkillMd(skillMdContent, data.versions, data.source.commitSha), 'utf-8');

  console.log(`wrote ${pairs.length} reference files to ${OUTPUT_DIR}`);
  console.log(`updated ${SKILL_MD_PATH}`);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  main();
}
