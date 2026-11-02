/**
 * Converts well-formed, PDF-style numeric matrices into display-mode MathJax.
 * Keeps the stored question and answer strings untouched (including scoring).
 * Non-matrix square brackets and incomplete/malformed matrices pass through.
 */
export const formatNumericalMatrixText = (
  source: string,
  formatPlainMath: (source: string) => string,
): string => {
  const matrixPattern = /(?:(\b[A-D])\s*=\s*)?\[([^\[\]]+)\]/g;
  const pieces: string[] = [];
  let cursor = 0;
  let converted = 0;

  for (const match of source.matchAll(matrixPattern)) {
    if (match.index === undefined) continue;

    const label = match[1];
    const rows = match[2].split(';').map((row) => row.split(',').map((cell) => cell.trim()));
    const columns = rows[0]?.length ?? 0;
    const valid = columns > 0 && (rows.length > 1 || (Boolean(label) && columns > 1)) &&
      rows.every((row) => row.length === columns && row.every(
        (cell) => /^[+-]?\d+(?:\.\d+)?$/.test(cell),
      ));

    if (!valid) continue;

    pieces.push(formatPlainMath(source.slice(cursor, match.index)));

    const texRows = rows.map((row) => row.join(' & ')).join(' \\\\ ');
    let end = match.index + match[0].length;

    // Some source PDFs have a duplicated closing square bracket.
    if (source[end] === ']') end += 1;

    // Keep punctuation attached to the displayed matrix instead of stranded below it.
    const punctuation = /^[?.:,]/.exec(source.slice(end))?.[0] ?? '';
    end += punctuation.length;

    const assignment = label ? `${label} = ` : '';
    pieces.push(`\\[${assignment}\\begin{pmatrix}${texRows}\\end{pmatrix}${punctuation ? `\\,${punctuation}` : ''}\\]`);
    cursor = end;
    converted += 1;
  }

  if (!converted) return formatPlainMath(source);
  pieces.push(formatPlainMath(source.slice(cursor)));
  return pieces.join('');
};
