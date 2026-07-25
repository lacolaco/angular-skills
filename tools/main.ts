import {execFileSync} from 'node:child_process';
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

import {extractRecommendations, extractVersions} from './extract.js';
import {fetchUpstream, type UpstreamSource} from './fetch-upstream.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'recommendations.json');

// Local Angular fork, used for offline development (per task instructions).
const LOCAL_FORK_ROOT = '/Users/lacolaco/works/angular';
const DIR_PATH = 'adev/src/app/features/update';

async function loadLocal(): Promise<{
  source: UpstreamSource;
  recommendationsText: string;
  updateComponentText: string;
}> {
  const dir = path.join(LOCAL_FORK_ROOT, DIR_PATH);
  const commitSha = execFileSync('git', ['log', '-1', '--format=%H', '--', DIR_PATH], {
    cwd: LOCAL_FORK_ROOT,
    encoding: 'utf-8',
  }).trim();

  return {
    source: {repo: 'angular/angular', path: DIR_PATH, commitSha},
    recommendationsText: readFileSync(path.join(dir, 'recommendations.ts'), 'utf-8'),
    updateComponentText: readFileSync(path.join(dir, 'update.component.ts'), 'utf-8'),
  };
}

async function main() {
  const mode = process.argv[2];
  if (mode !== 'local' && mode !== 'github') {
    console.error('usage: main.ts <local|github>');
    process.exit(1);
  }

  const {source, recommendationsText, updateComponentText} =
    mode === 'local' ? await loadLocal() : await fetchUpstream();

  const recommendations = extractRecommendations(recommendationsText);
  const versions = extractVersions(updateComponentText);

  const output = {
    source,
    license: 'MIT',
    recommendations,
    versions,
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf-8');
  console.log(`wrote ${recommendations.length} recommendations, ${versions.length} versions`);
  console.log(`source: ${JSON.stringify(source)}`);
  console.log(`-> ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
