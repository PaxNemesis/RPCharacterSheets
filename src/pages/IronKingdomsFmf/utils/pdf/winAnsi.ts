import type { PDFFont } from 'pdf-lib';

// Characters the books and the sheet use that the PDF's standard fonts can't show, and what to show instead.
const REPLACEMENTS: Record<string, string> = {
  '′': "'",
  '″': '"',
  '´': "'",
  '˝': '"',
  '½': '1/2',
  '×': 'x',
  '−': '-',
};

/** The text with anything the font can't encode replaced or dropped, so filling a field can't fail. */
export function fontSafe(text: string, font: PDFFont): string {
  let out = '';
  for (const char of text) {
    // Line breaks are fine in multiline fields; tabs become spaces.
    if (char === '\n' || char === '\r') {
      out += char;
      continue;
    }
    if (char === '\t') {
      out += ' ';
      continue;
    }
    const replaced = REPLACEMENTS[char] ?? char;
    try {
      font.encodeText(replaced);
      out += replaced;
    } catch {
      out += '?';
    }
  }
  return out;
}
