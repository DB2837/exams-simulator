const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const ts = require('typescript');

// Test the production TypeScript without requiring another test runner.
const source = readFileSync(join(__dirname, '../src/utils/numericalMatrixFormatting.ts'), 'utf8');
const transpiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
}).outputText;
const output = { exports: {} };
new Function('module', 'exports', transpiled)(output, output.exports);
const { formatNumericalMatrixText } = output.exports;
const render = (source) => formatNumericalMatrixText(source, (text) => text);

test('2x2 matrix has full-height parentheses in a separate math line', () => {
  const result = render('Quanto vale il rango della matrice A=[ 1, 2; 5, 9]?');
  assert.match(result, /\\\[A = \\begin\{pmatrix\}1 & 2 \\\\ 5 & 9\\end\{pmatrix\}\\,\?\\\]/);
  assert.ok(!result.includes('bmatrix'));
});

test('renders two rectangular matrices with intact numeric entries', () => {
  const result = render('Data A=[4, 3, 2; -5, 1, 0; 3, 3, -7]. E B=[4, -5, 3; 3, 1, 3; 2, 0, -7]?');
  assert.equal((result.match(/\\begin\{pmatrix\}/g) || []).length, 2);
  assert.ok(result.includes('4 & 3 & 2 \\\\ -5 & 1 & 0 \\\\ 3 & 3 & -7'));
  assert.ok(result.includes('4 & -5 & 3 \\\\ 3 & 1 & 3 \\\\ 2 & 0 & -7'));
});

test('one-row and one-column labeled matrices become legible vectors', () => {
  const result = render('A=[1, 2, 0] e B=[3; -5; 2]');
  assert.match(result, /\\begin\{pmatrix\}1 & 2 & 0\\end\{pmatrix\}/);
  assert.match(result, /\\begin\{pmatrix\}3 \\\\ -5 \\\\ 2\\end\{pmatrix\}/);
  assert.equal(render('f=[1, -1, -2]'), 'f=[1, -1, -2]');
});

test('leaves explanatory brackets and malformed matrices unchanged', () => {
  const explanation = 'Se f(x1) [funzione nel punto x1] è minore di zero';
  assert.equal(render(explanation), explanation);
  const malformed = 'A=[1, 2; 3, 4, 5]';
  assert.equal(render(malformed), malformed);
});

test('ignores duplicated square bracket in PDF source', () => {
  const result = render('A=[0, 1; 0, 1; 1, 0; 1, 0]]?');
  assert.equal((result.match(/\\begin\{pmatrix\}/g) || []).length, 1);
  assert.ok(!result.includes(']]'));
  assert.match(result, /\\,\?\\\]$/);
});
