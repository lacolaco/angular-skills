import {execFileSync} from 'node:child_process';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

import {extractRecommendations, extractVersions} from './extract.js';

const SKILL = 'angular-update-guide';
const REPO = 'angular/angular';
const SUBMODULE_RELATIVE_PATH = 'adev/src/app/features/update';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..', '..');
const SUBMODULE_PATH = path.join(REPO_ROOT, 'upstream', 'angular');
const OUTPUT_PATH = path.join(REPO_ROOT, 'data', SKILL, 'recommendations.json');

async function main() {
  const commitSha = execFileSync('git', ['-C', SUBMODULE_PATH, 'rev-parse', 'HEAD'], {
    encoding: 'utf-8',
  }).trim();

  const recommendationsText = readFileSync(
    path.join(SUBMODULE_PATH, SUBMODULE_RELATIVE_PATH, 'recommendations.ts'),
    'utf-8',
  );
  const updateComponentText = readFileSync(
    path.join(SUBMODULE_PATH, SUBMODULE_RELATIVE_PATH, 'update.component.ts'),
    'utf-8',
  );

  const recommendations = extractRecommendations(recommendationsText);
  const versions = extractVersions(updateComponentText);

  const output = {
    source: {repo: REPO, path: SUBMODULE_RELATIVE_PATH, commitSha},
    license: 'MIT',
    recommendations,
    versions,
  };

  // The intermediate JSON is a build artifact and is not tracked, so its
  // directory is absent on a fresh clone.
  mkdirSync(path.dirname(OUTPUT_PATH), {recursive: true});
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf-8');
  console.log(`wrote ${recommendations.length} recommendations, ${versions.length} versions`);
  console.log(`source: ${JSON.stringify(output.source)}`);
  console.log(`-> ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
