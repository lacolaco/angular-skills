import assert from 'node:assert/strict';
import {test} from 'node:test';
import {
  computeMajorPairs,
  renderReferenceIndex,
  replaceBetweenMarkers,
  updateSkillMd,
  type Version,
} from './render.js';

// Small fabricated version tables — never touch the real data/recommendations.json.

const V6_TO_V8: Version[] = [
  {name: '6.0', number: 600},
  {name: '7.0', number: 700},
  {name: '8.0', number: 800},
];

// --- computeMajorPairs / renderReferenceIndex: index tracks the versions table ---

test('computeMajorPairs pairs adjacent .0 majors from v6 onward', () => {
  const pairs = computeMajorPairs(V6_TO_V8);
  assert.deepEqual(
    pairs.map((p) => [p.from.number, p.to.number]),
    [
      [600, 700],
      [700, 800],
    ],
  );
});

test('computeMajorPairs excludes majors before v6', () => {
  const withPreV6: Version[] = [{name: '5.0', number: 500}, ...V6_TO_V8];
  const pairs = computeMajorPairs(withPreV6);
  assert.deepEqual(
    pairs.map((p) => [p.from.number, p.to.number]),
    [
      [600, 700],
      [700, 800],
    ],
  );
});

test('renderReferenceIndex gains one line when a new major is appended', () => {
  const before = renderReferenceIndex(V6_TO_V8);
  assert.equal(before, '- `references/v6-to-v7.xml`\n- `references/v7-to-v8.xml`');

  const withV9: Version[] = [...V6_TO_V8, {name: '9.0', number: 900}];
  const after = renderReferenceIndex(withV9);
  assert.equal(
    after,
    '- `references/v6-to-v7.xml`\n- `references/v7-to-v8.xml`\n- `references/v8-to-v9.xml`',
  );
});

// --- replaceBetweenMarkers: only the marked region changes ---

test('replaceBetweenMarkers replaces content between markers, keeps markers', () => {
  const content = 'before <!-- X:START -->old<!-- X:END --> after';
  const result = replaceBetweenMarkers(content, 'X', 'new');
  assert.equal(result, 'before <!-- X:START -->new<!-- X:END --> after');
});

test('replaceBetweenMarkers throws when markers are missing', () => {
  assert.throws(() => replaceBetweenMarkers('no markers here', 'X', 'new'), /missing X markers/);
});

// --- updateSkillMd: only the marker regions change, rest of the file is untouched ---

const SKILL_MD_FIXTURE = [
  '# Fixture',
  '',
  'Generated from commit <!-- SOURCE:START -->`oldsha`<!-- SOURCE:END -->.',
  '',
  '## Available references',
  '',
  '<!-- REFERENCES:START -->',
  '- `references/v6-to-v7.xml`',
  '<!-- REFERENCES:END -->',
  '',
  'Trailing note, must survive untouched.',
  '',
].join('\n');

test('updateSkillMd rewrites the references index and commit sha, nothing else', () => {
  const result = updateSkillMd(SKILL_MD_FIXTURE, V6_TO_V8, 'newsha');

  assert.equal(
    result,
    [
      '# Fixture',
      '',
      'Generated from commit <!-- SOURCE:START -->`newsha`<!-- SOURCE:END -->.',
      '',
      '## Available references',
      '',
      '<!-- REFERENCES:START -->',
      '- `references/v6-to-v7.xml`',
      '- `references/v7-to-v8.xml`',
      '<!-- REFERENCES:END -->',
      '',
      'Trailing note, must survive untouched.',
      '',
    ].join('\n'),
  );
});
