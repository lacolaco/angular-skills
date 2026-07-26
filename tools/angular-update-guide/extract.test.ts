import assert from 'node:assert/strict';
import {test} from 'node:test';
import {extractRecommendations, extractVersions} from './extract.js';

// Small fabricated TS snippets — never touch the real upstream files.
// Each mimics just enough of recommendations.ts / update.component.ts to
// exercise one validation rule.

const ENUM = `
export enum ApplicationComplexity {
  Basic = 1,
  Medium = 2,
  Advanced = 3,
}
`;

function withRecommendations(entries: string): string {
  return `${ENUM}\nexport const RECOMMENDATIONS = [\n${entries}\n];\n`;
}

function assertThrows(fn: () => void, messageIncludes: string) {
  assert.throws(fn, (err: unknown) => {
    assert.ok(err instanceof Error);
    assert.ok(
      err.message.includes(messageIncludes),
      `expected error to include "${messageIncludes}", got: ${err.message}`,
    );
    return true;
  });
}

// --- baseline sanity: a well-formed entry must parse cleanly ---
test('valid entry extracts step/action/level/possibleIn/necessaryAsOf', () => {
  const src = withRecommendations(`
    {
      possibleIn: 2100,
      necessaryAsOf: 2100,
      level: ApplicationComplexity.Advanced,
      step: 'Example Step',
      action: 'Do the thing. See [docs](https://angular.dev) or run \`ng update\`.',
    },
  `);
  const steps = extractRecommendations(src);
  assert.equal(steps.length, 1);
  assert.deepEqual(steps[0], {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: 3,
    step: 'Example Step',
    action: 'Do the thing. See [docs](https://angular.dev) or run `ng update`.',
  });
});

// --- dead fields must fail validation when populated ---
test('angularCLI populated fails validation', () => {
  const src = withRecommendations(`
    {
      possibleIn: 2100,
      necessaryAsOf: 2100,
      level: ApplicationComplexity.Basic,
      step: 'x',
      action: 'y',
      angularCLI: true,
    },
  `);
  assertThrows(() => extractRecommendations(src), 'dead Step field "angularCLI"');
});

test('pwa populated fails validation', () => {
  const src = withRecommendations(`
    {
      possibleIn: 2100,
      necessaryAsOf: 2100,
      level: ApplicationComplexity.Basic,
      step: 'x',
      action: 'y',
      pwa: false,
    },
  `);
  assertThrows(() => extractRecommendations(src), 'dead Step field "pwa"');
});

// --- unknown field must fail validation ---
test('unknown field fails validation', () => {
  const src = withRecommendations(`
    {
      possibleIn: 2100,
      necessaryAsOf: 2100,
      level: ApplicationComplexity.Basic,
      step: 'x',
      action: 'y',
      newUpstreamField: true,
    },
  `);
  assertThrows(() => extractRecommendations(src), 'unknown Step field "newUpstreamField"');
});

// --- unknown ApplicationComplexity value must fail validation ---
test('level referencing unknown enum member fails validation', () => {
  const src = withRecommendations(`
    {
      possibleIn: 2100,
      necessaryAsOf: 2100,
      level: ApplicationComplexity.Legacy,
      step: 'x',
      action: 'y',
    },
  `);
  assertThrows(() => extractRecommendations(src), 'unknown ApplicationComplexity member: Legacy');
});

test('level resolving to an out-of-range numeric value fails validation', () => {
  const src = `
export enum ApplicationComplexity {
  Basic = 1,
  Medium = 2,
  Advanced = 3,
  Legacy = 4,
}
export const RECOMMENDATIONS = [
  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Legacy,
    step: 'x',
    action: 'y',
  },
];
`;
  assertThrows(
    () => extractRecommendations(src),
    'ApplicationComplexity.Legacy resolves to unknown value: 4',
  );
});

// --- versions table: unknown field must fail validation ---
test('versions entry with unknown field fails validation', () => {
  const src = `
class C {
  protected readonly versions = [
    {name: '21.0', number: 2100, extra: true},
  ];
}
`;
  assertThrows(() => extractVersions(src), 'unknown versions field "extra"');
});

test('versions table extracts name/number pairs', () => {
  const src = `
class C {
  protected readonly versions = [
    {name: '21.0', number: 2100},
    {name: '20.0', number: 2000},
  ];
}
`;
  const versions = extractVersions(src);
  assert.deepEqual(versions, [
    {name: '21.0', number: 2100},
    {name: '20.0', number: 2000},
  ]);
});
