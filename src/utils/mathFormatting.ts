const exactMathOverrides: Record<string, string> = {
  'Utilizzando gli sviluppi di McLaurin delle funzioni coinvolte, si ha che limx→0 (e3x-1-3x)/[ln(1+x/2)-x/2] è uguale a':
    'Utilizzando gli sviluppi di McLaurin delle funzioni coinvolte, si ha che \\(\\lim_{x\\to 0} \\frac{e^{3x}-1-3x}{\\ln\\left(1+\\frac{x}{2}\\right)-\\frac{x}{2}}\\) è uguale a',
};

const mathTokenPattern = /(?:[=<>≤≥±√∫∞→∈∪∩πµαβγδλθω•◊]|\^|\/|\b(?:lim|sin|cos|tan|ln|log|arcsin|arccos|arctan|Ker|det)\b|[A-Za-z]\d|\d[A-Za-z]|(?:f|g|y)'|\b(?:ex|e-x)\b|\d!)/;

const plainWordPattern = /^[A-Za-zÀ-ÖØ-öø-ÿ']+[,.;:!?]?$/;

const isMathToken = (token: string) => {
  const stripped = token.replace(/^["“”]+|["“”]+$/g, '');

  if (!stripped) return false;
  if (mathTokenPattern.test(stripped)) return true;
  if (/^[+\-]?(?:\d+(?:[.,]\d+)?)(?:°[A-Za-z]?)?$/.test(stripped)) return false;
  if (/^[([{].*[)\]}][,.;:]?$/.test(stripped) && /[\dA-Za-z+\-*/=∞π√]/.test(stripped)) {
    return true;
  }
  if (/^[A-Za-z](?:\([^)]+\))?[=<>≤≥]/.test(stripped)) return true;
  if (/^(?:R|R\d|AT|[A-Za-z]\([^)]*\)|[xyzmnkvqFVA][₀-₉]?)$/.test(stripped)) return true;
  if (!plainWordPattern.test(stripped) && /[A-Za-z]/.test(stripped) && /\d/.test(stripped)) return true;

  return false;
};

const replaceBalancedFractions = (input: string) => {
  let value = input;

  value = value.replace(/(?<![A-Za-z\\])\(([^()]*)\)\/\(([^()]*)\)\^\{([2345])\}/g, (_match, numerator, denominator, power) => {
    return `\\frac{${numerator}}{(${denominator})^{${power}}}`;
  });

  value = value.replace(/(?<![A-Za-z\\])\(([^()]*)\)\/\[([^\[\]]*)\]/g, (_match, numerator, denominator) => {
    return `\\frac{${numerator}}{${denominator}}`;
  });

  value = value.replace(/(?<![A-Za-z\\])\(([^()]*)\)\/\(([^()]*)\)/g, (_match, numerator, denominator) => {
    return `\\frac{${numerator}}{${denominator}}`;
  });

  value = value.replace(/([+\-]?)(\d+)\/\(([^()]*)\)/g, (_match, sign, numerator, denominator) => {
    return `${sign}\\frac{${numerator}}{${denominator}}`;
  });

  return value;
};

const normalizeFormula = (rawFormula: string) => {
  let formula = rawFormula.trim();
  const trailingPunctuation = formula.match(/([,.;:!?]+)$/)?.[1] ?? '';

  if (trailingPunctuation) {
    formula = formula.slice(0, -trailingPunctuation.length);
  }

  formula = formula
    .replace(/⁄/g, '/')
    .replace(/·/g, '\\cdot ')
    .replace(/•/g, '\\cdot ')
    .replace(/◊/g, '\\circ ')
    .replace(/≥/g, '\\ge ')
    .replace(/≤/g, '\\le ')
    .replace(/→/g, '\\to ')
    .replace(/∞/g, '\\infty ')
    .replace(/∈/g, '\\in ')
    .replace(/∪/g, '\\cup ')
    .replace(/∩/g, '\\cap ')
    .replace(/±/g, '\\pm ')
    .replace(/⇔/g, '\\Leftrightarrow ')
    .replace(/π/g, '\\pi ')
    .replace(/α/g, '\\alpha ')
    .replace(/β/g, '\\beta ')
    .replace(/γ/g, '\\gamma ')
    .replace(/δ/g, '\\delta ')
    .replace(/λ/g, '\\lambda ')
    .replace(/θ/g, '\\theta ')
    .replace(/µ/g, '\\mu ')
    .replace(/ω/g, '\\omega ')
    .replace(/∀/g, '\\forall ');

  formula = formula.replace(/lim([A-Za-z])\\to\s*([+\-]?(?:\\infty|\d+)(?:[+\-])?)/g, (_match, variable, destination) => {
    const cleanedDestination = destination.replace(/\+$/, '^+').replace(/-$/, '^-');
    return `\\lim_{${variable}\\to ${cleanedDestination}}`;
  });

  formula = formula
    .replace(/\b(arcsin|arccos|arctan|sin|cos|tan|ln)(?=\()/g, '\\$1')
    .replace(/\b(sin|cos|tan|ln)([A-Za-z])\b/g, '\\$1 $2')
    .replace(/\blog([A-Za-z])(?=\()/g, '\\log_{$1}')
    .replace(/\blog(\d)(\d)\b/g, '\\log_{$1} $2');

  // Common implicit exponents produced by PDF text extraction.
  formula = formula
    .replace(/\b(sin|cos|tan)([234])(?=\()/g, '\\$1^{$2}')
    .replace(/\bx0\b/g, 'x_{0}')
    .replace(/\bc([12])(?=e|x|$|[+\-,\s]|\\in)/g, 'c_{$1}')
    .replace(/\bv([0123])\b/g, 'v_{$1}')
    .replace(/\bv([xy])\b/g, 'v_{$1}')
    .replace(/\bm([12])\b/g, 'm_{$1}')
    .replace(/\ba0\b/g, 'a_{0}')
    .replace(/\ban\+1\b/g, 'a_{n+1}')
    .replace(/\ban([2345])\b/g, 'a_n^{$1}')
    .replace(/\ban\b/g, 'a_n')
    .replace(/\ba([1-9])\b/g, 'a_{$1}')
    .replace(/\bQ([0-9])\b/g, 'Q_{$1}')
    .replace(/\bR([01])\b/g, 'R_{$1}')
    .replace(/\bAT\b/g, 'A^T');

  // x1/x2 are usually coordinates only when immediately followed by an equals sign.
  formula = formula.replace(/\bx([12])(?=\s*=)/g, 'x_{$1}');

  // e followed by a compact exponent, e.g. ex, e-x, e3x, ex2/2, e1/x.
  formula = formula.replace(/xex\b/g, 'x\\,e^{x}');
  formula = formula.replace(/(^|[=+\-*/(,\s0-9}∫])e(x[2345]?(?:[+\-]\d*x[2345]?)+)\b/g, (_match, prefix, exponent) => {
    const normalizedExponent = exponent.replace(/x([2345])\b/g, 'x^{$1}');
    return `${prefix}e^{${normalizedExponent}}`;
  });
  formula = formula.replace(/(^|[=+\-*/(,\s0-9}∫])e([+\-]?(?:\d*x\d*(?:\/\d+)?|1\/x))\b/g, (_match, prefix, exponent) => {
    let normalizedExponent = exponent.replace(/x([2345])\b/g, 'x^{$1}');
    const exponentFraction = normalizedExponent.match(/^(.+)\/(\d+|x)$/);
    if (exponentFraction) {
      normalizedExponent = `\\frac{${exponentFraction[1]}}{${exponentFraction[2]}}`;
    }
    return `${prefix}e^{${normalizedExponent}}`;
  });

  // Polynomial powers such as x2, x3, n2 that lost superscript positioning in the PDF extraction.
  formula = formula.replace(/([xyzn])([2345])\b/g, '$1^{$2}');
  formula = formula.replace(/([)\]])([2345])\b/g, '$1^{$2}');
  formula = formula.replace(/([)\]])n\b/g, '$1^{n}');
  formula = formula.replace(/\b(cm|mm|km|m|s)([23])\b/g, '$1^{$2}');

  // Powers written explicitly with ^.
  formula = formula.replace(/\^([+\-]?\d+)/g, '^{$1}');

  // Indexed radical notation from the source PDFs: 3√x, 4√(...), ...
  formula = formula.replace(/\b([3-9])√(\\?(?:ln|sin|cos|tan)?\([^)]*\)|\([^)]*\)|[A-Za-z](?:\^\{[^}]+\})?)/g, (_match, index, radicand) => {
    const clean = radicand.startsWith('(') && radicand.endsWith(')')
      ? radicand.slice(1, -1)
      : radicand;
    return `\\sqrt[${index}]{${clean}}`;
  });

  formula = formula.replace(/√(\([^)]*\)|\d+(?:[.,]\d+)?|[A-Za-z](?:\^\{[^}]+\})?)/g, (_match, radicand) => {
    const clean = radicand.startsWith('(') && radicand.endsWith(')')
      ? radicand.slice(1, -1)
      : radicand;
    return `\\sqrt{${clean}}`;
  });

  formula = replaceBalancedFractions(formula);

  const wholeFraction = formula.match(/^([+\-]?)(\d+(?:[.,]\d+)?|[A-Za-z])\/(\d+(?:[.,]\d+)?|[A-Za-z])$/);
  if (wholeFraction) {
    const [, sign, numerator, denominator] = wholeFraction;
    formula = `${sign}\\frac{${numerator}}{${denominator}}`;
  }

  formula = formula
    .replace(/\|([^|]+)\|/g, '\\lvert $1 \\rvert')
    .replace(/\bR([234])\b/g, '\\mathbb{R}^{$1}')
    .replace(/(?<![A-Za-z{])R\b/g, '\\mathbb{R}')
    .replace(/\bKer\b/g, '\\operatorname{Ker}')
    .replace(/\bdetA\b/g, '\\det A')
    .replace(/\b([A-Za-z])\*([A-Za-z])\b/g, '$1\\, $2');

  // Integrals and differentials.
  formula = formula.replace(/∫/g, '\\int ');
  formula = formula.replace(/\bdx\b/g, '\\,dx');

  // Keep decimal commas used in Italian notation readable inside math mode.
  formula = formula.replace(/(\d),(\d)/g, '$1{,}$2');

  return `\\(${formula}\\)${trailingPunctuation}`;
};

const shouldJoinMathGroup = (token: string) => {
  if (isMathToken(token)) return true;
  const stripped = token.replace(/[,.;:!?]+$/g, '');
  return /^(?:[+\-*/=<>≤≥]|[+\-]?\d+(?:[.,]\d+)?[)]?|[xyzmnkvqFVA]|dx|dy)$/.test(stripped);
};

export const formatMathText = (text: string) => {
  const exactOverride = exactMathOverrides[text];
  if (exactOverride) return exactOverride;

  const parts = text.split(/(\s+)/);
  const output: string[] = [];

  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];

    if (!part || /^\s+$/.test(part) || !isMathToken(part)) {
      output.push(part);
      continue;
    }

    const group: string[] = [part];
    let cursor = index + 1;

    while (cursor < parts.length) {
      const separator = parts[cursor];
      const nextToken = parts[cursor + 1];

      if (!separator || !/^\s+$/.test(separator) || !nextToken || !shouldJoinMathGroup(nextToken)) {
        break;
      }

      group.push(separator, nextToken);
      cursor += 2;
    }

    output.push(normalizeFormula(group.join('')));
    index = cursor - 1;
  }

  return output.join('');
};
