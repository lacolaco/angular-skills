import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '..', 'data', 'recommendations.json');
const OUTPUT_DIR = path.join(
  __dirname,
  '..',
  'skills',
  'angular-update-guide',
  'references',
);

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

interface Version {
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

function main() {
  const data: RecommendationsData = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));

  // Only the `.0` entries mark a major version boundary.
  const majorVersions = data.versions
    .filter((v) => v.number % 100 === 0)
    .sort((a, b) => a.number - b.number);

  const maxVersionNumber = Math.max(...data.versions.map((v) => v.number));

  const pairs: Array<{from: Version; to: Version}> = [];
  for (let i = 0; i < majorVersions.length - 1; i++) {
    const from = majorVersions[i];
    if (from.number < 600) continue;
    pairs.push({from, to: majorVersions[i + 1]});
  }

  mkdirSync(OUTPUT_DIR, {recursive: true});

  for (const {from, to} of pairs) {
    const fromMajor = Math.floor(from.number / 100);
    const toMajor = Math.floor(to.number / 100);
    const outputPath = path.join(OUTPUT_DIR, `v${fromMajor}-to-v${toMajor}.md`);
    writeFileSync(outputPath, renderStep(data, from, to, to.number === maxVersionNumber), 'utf-8');
  }

  console.log(`wrote ${pairs.length} reference files to ${OUTPUT_DIR}`);
}

main();
