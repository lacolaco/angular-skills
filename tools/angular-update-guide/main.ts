import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

import {extractRecommendations, extractVersions} from './extract.js';
import {render, type RecommendationsData} from './render.js';

const REPO = 'angular/angular';
const SUBMODULE_RELATIVE_PATH = 'adev/src/app/features/update';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..', '..');
const SUBMODULE_PATH = path.join(REPO_ROOT, 'upstream', 'angular');

function readUpstream(): RecommendationsData {
  const commitSha = execFileSync('git', ['-C', SUBMODULE_PATH, 'rev-parse', 'HEAD'], {
    encoding: 'utf-8',
  }).trim();

  const sourceDir = path.join(SUBMODULE_PATH, SUBMODULE_RELATIVE_PATH);
  const recommendationsText = readFileSync(path.join(sourceDir, 'recommendations.ts'), 'utf-8');
  const updateComponentText = readFileSync(path.join(sourceDir, 'update.component.ts'), 'utf-8');

  return {
    source: {repo: REPO, path: SUBMODULE_RELATIVE_PATH, commitSha},
    license: 'MIT',
    recommendations: extractRecommendations(recommendationsText),
    versions: extractVersions(updateComponentText),
  };
}

function main() {
  const data = readUpstream();
  console.log(
    `read ${data.recommendations.length} recommendations, ${data.versions.length} versions ` +
      `from ${data.source.repo}@${data.source.commitSha}`,
  );
  render(data);
}

main();
