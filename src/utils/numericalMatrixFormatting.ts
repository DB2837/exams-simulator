/**
 * Renders PDF-encoded numeric matrices with MathJax, preserving raw strings.
 * Only rectangular numeric matrices with rows separated by ';' qualify.
 */
export const formatNumericalMatrixText = (
  source: string,
  formatPlainMath: (source: string) => string,
): string => {
  const matrixPattern = /\[([^\[\]]*;[^\[\]]*)\]/g;
  const pieces: string[] = [];
  let cursor = 0;

  for (const match of source.matchAll(matrixPattern)) {
    const content = match[1];
    const rows = content.split(';').map((row) => row.split(',').map((cell) => cell.trim()));
    const width = rows[0]?.length ?? 0;
    const valid = rows.length >= 2 && width >= 1 && rows.every(
      (row) => row.length === width && row.every((cell) => /^[+-]?\d+(?:[.,]\d+)?$/.test(cell)),
    );

    if (!valid || match.index === undefined) continue;

    pieces.push(formatPlainMath(source.slice(cursor, match.index)));
    const texRows = rows.map((row) => row.map((cell) => cell.replace(',', '{,}')).join(' & ')).join(' \\\\ ');
    pieces.push(`\\(\\begin{bmatrix}${texRows}\\end{bmatrix}\\)`);
    cursor = match.index + match[0].length;
  }

  if (cursor === 0) return formatPlainMath(source);
  pieces.push(formatPlainMath(source.slice(cursor)));
  return pieces.join('');
};
