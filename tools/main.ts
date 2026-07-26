import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

import {extractRecommendations, extractVersions} from './extract.js';
import {fetchUpstream} from './fetch-upstream.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'recommendations.json');

async function main() {
  const {source, recommendationsText, updateComponentText} = await fetchUpstream();

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
