import type { Cell } from '../sheetLayout';
import type { SheetWriter } from '../sheetWriter';

/** A term of a formula: a field with its label above it. */
export type Term = Omit<Cell, 'weight' | 'lines'>;

const TITLE = 44;
const OPERATOR = 7;

/** "DEF  [SPD] + [AGL] + [PER] + [Other] = [Total]", one labelled box per term, like the web sheet. */
export function writeFormula(w: SheetWriter, title: string, terms: Term[], total: Term) {
  w.block(30, (x, top, width) => {
    w.text(title, x, top - 18, 8.5, true);
    const boxes = [...terms, total];
    const box = (width - TITLE - OPERATOR * (boxes.length - 1)) / boxes.length;
    boxes.forEach((term, index) => {
      const left = x + TITLE + index * (box + OPERATOR);
      w.label(term.label, left, top, 5);
      w.field(term.name, term.value, { x: left, top: top - 7, width: box, center: true, bold: index === terms.length });
      if (index > 0) w.text(index === terms.length ? '=' : '+', left - OPERATOR + 1.5, top - 18, 8, true);
    });
  });
}
