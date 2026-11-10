import { rgb } from 'pdf-lib';

/** A4 landscape, in points. */
export const PAGE: [number, number] = [841.89, 595.28];
export const MARGIN = 22;
/** The title band across the top of each page. */
export const BAND = 20;
/** Room under the last column for the page footer. */
export const FOOTER = 14;
export const COLUMNS = 3;
export const GUTTER = 12;
/** Space inside a panel's border. */
export const PAD = 7;
/** A panel's heading tab. */
export const TAB = 14;
export const GAP = 5;
/** Room for a field's label above it. */
export const LABEL = 8;
/** One line of text in a multiline field. */
export const LINE = 10.5;
/** A single-line field's height. */
export const FIELD = 15;

/** Parchment, dark brown ink, and black heading tabs; plain colours, so it prints cheaply. */
export const PAPER = rgb(0.97, 0.945, 0.89);
export const INK = rgb(0.16, 0.12, 0.09);
export const SOFT = rgb(0.4, 0.33, 0.26);
export const RULE = rgb(0.5, 0.42, 0.33);
export const FIELD_BG = rgb(1, 0.995, 0.98);
export const TAB_BG = rgb(0.11, 0.09, 0.07);
export const WHITE = rgb(1, 1, 1);

/** One fillable field; `weight` is its share of the row's width, `lines` above 1 makes it multiline. */
export type Cell = {
  label: string;
  name: string;
  value: string | number | null | undefined;
  weight?: number;
  lines?: number;
};

/** A table column: its header and share of the width. */
export type Column = { label: string; weight?: number };

/** How tall a field with this many lines is. */
export const fieldHeight = (lines = 1) => (lines > 1 ? lines * LINE + 5 : FIELD);

/** How tall a row of these fields is: its tallest field. */
export const rowHeight = (cells: Cell[]) => Math.max(...cells.map((cell) => fieldHeight(cell.lines)));

/**
 * An SVG path for a rectangle with rounded corners, `width` by `height` from its top-left corner, for
 * pdf-lib's drawSvgPath (which measures y downwards from the point it is drawn at). `top` rounds only
 * the top corners, for a heading tab.
 */
export function roundedRect(width: number, height: number, radius: number, top = false) {
  const r = Math.min(radius, width / 2, height / 2);
  const bottom = top
    ? `V ${height} H 0`
    : `V ${height - r} A ${r} ${r} 0 0 1 ${width - r} ${height} H ${r} A ${r} ${r} 0 0 1 0 ${height - r}`;
  return `M ${r} 0 H ${width - r} A ${r} ${r} 0 0 1 ${width} ${r} ${bottom} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`;
}

/** The x position and width of each share of `width`, with gaps between. */
export function split(weights: number[], width: number, left: number, gap = GAP) {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const room = width - gap * (weights.length - 1);
  let x = left;
  return weights.map((weight) => {
    const w = (room * weight) / total;
    const spot = { x, w };
    x += w + gap;
    return spot;
  });
}
