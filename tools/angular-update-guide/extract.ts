import ts from 'typescript';

/**
 * Faithful copy of the upstream `Step` shape, minus the dead fields
 * (`angularCLI` / `pwa`, never populated upstream — presence is a validation
 * error, see `validateStepProperties`) and `renderedStep` (a runtime-derived
 * field that never appears in the source literal).
 */
export interface ExtractedStep {
  step: string;
  action: string;
  possibleIn: number;
  necessaryAsOf: number;
  level: number;
  ngUpgrade?: boolean;
  material?: boolean;
  windows?: boolean;
}

export interface ExtractedVersion {
  name: string;
  number: number;
}

// Snapshot of the upstream `Step` interface fields (recommendations.ts).
// A property name outside this set means upstream added a field we don't
// know about yet — fail loudly instead of silently dropping it.
const KNOWN_STEP_FIELDS = new Set([
  'step',
  'action',
  'possibleIn',
  'necessaryAsOf',
  'level',
  'ngUpgrade',
  'material',
  'windows',
  'angularCLI',
  'pwa',
  'renderedStep',
]);

// Fields that exist on the upstream interface but are never populated.
// Their presence signals upstream started using a dead field.
const DEAD_STEP_FIELDS = new Set(['angularCLI', 'pwa']);

const KNOWN_LEVEL_VALUES = new Set([1, 2, 3]);

function parseSource(fileName: string, text: string): ts.SourceFile {
  return ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
}

/** Builds a `{ MemberName: numericValue }` map from an enum declaration. */
function extractEnumMap(sourceFile: ts.SourceFile, enumName: string): Map<string, number> {
  let enumDecl: ts.EnumDeclaration | undefined;
  sourceFile.forEachChild((node) => {
    if (ts.isEnumDeclaration(node) && node.name.text === enumName) {
      enumDecl = node;
    }
  });
  if (!enumDecl) {
    throw new Error(`enum ${enumName} not found`);
  }

  const map = new Map<string, number>();
  for (const member of enumDecl.members) {
    const memberName = ts.isIdentifier(member.name) ? member.name.text : member.name.getText();
    if (!member.initializer || !ts.isNumericLiteral(member.initializer)) {
      throw new Error(
        `enum ${enumName}.${memberName} has no explicit numeric initializer — cannot resolve its value statically`,
      );
    }
    map.set(memberName, Number(member.initializer.text));
  }
  return map;
}

function literalToPrimitive(node: ts.Expression): string | number | boolean {
  if (ts.isStringLiteralLike(node)) {
    return node.text;
  }
  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }
  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }
  throw new Error(`unsupported literal node kind: ${ts.SyntaxKind[node.kind]}`);
}

function propertyName(prop: ts.ObjectLiteralElementLike): string {
  if (!ts.isPropertyAssignment(prop) || !prop.name) {
    throw new Error(`unsupported object literal member: ${prop.getText()}`);
  }
  if (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)) {
    return prop.name.text;
  }
  throw new Error(`unsupported property name: ${prop.name.getText()}`);
}

function resolveLevel(node: ts.Expression, levelEnum: Map<string, number>): number {
  if (!ts.isPropertyAccessExpression(node)) {
    throw new Error(`level must be an ApplicationComplexity.X reference, got: ${node.getText()}`);
  }
  const memberName = node.name.text;
  const value = levelEnum.get(memberName);
  if (value === undefined) {
    throw new Error(`unknown ApplicationComplexity member: ${memberName}`);
  }
  if (!KNOWN_LEVEL_VALUES.has(value)) {
    throw new Error(`ApplicationComplexity.${memberName} resolves to unknown value: ${value}`);
  }
  return value;
}

function extractStep(obj: ts.ObjectLiteralExpression, levelEnum: Map<string, number>): ExtractedStep {
  const record: Record<string, unknown> = {};

  for (const prop of obj.properties) {
    const name = propertyName(prop as ts.PropertyAssignment);

    if (!KNOWN_STEP_FIELDS.has(name)) {
      throw new Error(`unknown Step field "${name}" in: ${obj.getText().slice(0, 80)}...`);
    }
    if (DEAD_STEP_FIELDS.has(name)) {
      throw new Error(`dead Step field "${name}" has a value — upstream started using it`);
    }

    const value = (prop as ts.PropertyAssignment).initializer;
    record[name] = name === 'level' ? resolveLevel(value, levelEnum) : literalToPrimitive(value);
  }

  if (typeof record['level'] !== 'number' || !KNOWN_LEVEL_VALUES.has(record['level'])) {
    throw new Error(`Step "${record['step']}" has invalid or missing level: ${record['level']}`);
  }

  return record as unknown as ExtractedStep;
}

/**
 * Parses `recommendations.ts` and returns every entry of RECOMMENDATIONS as
 * a faithful copy (no filtering, no reshaping). Throws on any structural
 * surprise (dead field populated, unknown field, unknown enum value).
 */
export function extractRecommendations(sourceText: string): ExtractedStep[] {
  const sourceFile = parseSource('recommendations.ts', sourceText);
  const levelEnum = extractEnumMap(sourceFile, 'ApplicationComplexity');

  let arrayLiteral: ts.ArrayLiteralExpression | undefined;
  sourceFile.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const decl of node.declarationList.declarations) {
      if (
        ts.isIdentifier(decl.name) &&
        decl.name.text === 'RECOMMENDATIONS' &&
        decl.initializer &&
        ts.isArrayLiteralExpression(decl.initializer)
      ) {
        arrayLiteral = decl.initializer;
      }
    }
  });
  if (!arrayLiteral) {
    throw new Error('RECOMMENDATIONS array literal not found');
  }

  const steps: ExtractedStep[] = [];
  for (const element of arrayLiteral.elements) {
    if (!ts.isObjectLiteralExpression(element)) {
      throw new Error(`RECOMMENDATIONS element is not an object literal: ${element.getText()}`);
    }
    steps.push(extractStep(element, levelEnum));
  }
  return steps;
}

/**
 * Parses `update.component.ts` and returns the `versions` lookup table
 * (37 entries mapping version name -> integer-encoded version number).
 */
export function extractVersions(sourceText: string): ExtractedVersion[] {
  const sourceFile = parseSource('update.component.ts', sourceText);

  let arrayLiteral: ts.ArrayLiteralExpression | undefined;
  function visit(node: ts.Node) {
    if (
      ts.isPropertyDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === 'versions' &&
      node.initializer &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      arrayLiteral = node.initializer;
      return;
    }
    node.forEachChild(visit);
  }
  sourceFile.forEachChild(visit);

  if (!arrayLiteral) {
    throw new Error('versions array literal not found');
  }

  const versions: ExtractedVersion[] = [];
  for (const element of arrayLiteral.elements) {
    if (!ts.isObjectLiteralExpression(element)) {
      throw new Error(`versions element is not an object literal: ${element.getText()}`);
    }
    const record: Record<string, unknown> = {};
    for (const prop of element.properties) {
      const name = propertyName(prop as ts.PropertyAssignment);
      if (name !== 'name' && name !== 'number') {
        throw new Error(`unknown versions field "${name}"`);
      }
      record[name] = literalToPrimitive((prop as ts.PropertyAssignment).initializer);
    }
    versions.push(record as unknown as ExtractedVersion);
  }
  return versions;
}
