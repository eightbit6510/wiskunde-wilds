/** Unicode white square used as unknown in PO story sums. */
const MATH_PLACEHOLDER = '\u25A1';

/** Show □ as readable Dutch placeholder in questions, hints and explanations. */
export function formatMathText(text: string | null | undefined): string {
  if (!text) return '';
  return text.replaceAll(MATH_PLACEHOLDER, 'iets');
}
