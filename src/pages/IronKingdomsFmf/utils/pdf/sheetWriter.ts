/* oxlint-disable max-lines -- One class owning the page, column and write position; splitting it would expose that position to every section. */
import {
  drawEllipse,
  PDFDocument,
  StandardFonts,
  TextAlignment,
  type PDFFont,
  type PDFForm,
  type PDFImage,
  type PDFPage,
  type RGB,
} from 'pdf-lib';
import {
  BAND,
  COLUMNS,
  FIELD_BG,
  FOOTER,
  GAP,
  GUTTER,
  INK,
  LABEL,
  MARGIN,
  PAD,
  PAGE,
  PAPER,
  roundedRect,
  rowHeight,
  RULE,
  SOFT,
  split,
  TAB,
  TAB_BG,
  WHITE,
  fieldHeight,
  type Cell,
  type Column,
} from './sheetLayout';
import { fontSafe } from './winAnsi';

export type { Cell, Column } from './sheetLayout';

/** Where and how to put one field. `top` is its top edge; heights default to one line. */
export type FieldSpot = {
  x: number;
  top: number;
  width: number;
  height?: number;
  lines?: number;
  size?: number;
  bold?: boolean;
  center?: boolean;
};

const COLUMN_WIDTH = (PAGE[0] - 2 * MARGIN - GUTTER * (COLUMNS - 1)) / COLUMNS;
const TOP = PAGE[1] - MARGIN - BAND - 8;
const BOTTOM = MARGIN + FOOTER;

/**
 * Writes a character sheet in three columns per landscape page: each section is a panel with a black
 * heading tab, and content flows down a column, into the next, then onto a new page. A section that
 * breaks closes its panel and carries on in a "(cont.)" panel. Every field stays editable.
 */
export class SheetWriter {
  readonly doc: PDFDocument;
  private readonly form: PDFForm;
  private readonly font: PDFFont;
  private readonly bold: PDFFont;
  private page!: PDFPage;
  private column = 0;
  private y = TOP;
  /** The open panel's title and where its border starts. */
  private panel: { title: string; top: number } | null = null;
  /** A section whose tab is drawn with its first content, and how much of it to keep with the tab. */
  private pending: { title: string; keep: number } | null = null;

  private constructor(doc: PDFDocument, font: PDFFont, bold: PDFFont) {
    this.doc = doc;
    this.form = doc.getForm();
    this.font = font;
    this.bold = bold;
    this.addPage();
  }

  static async create(): Promise<SheetWriter> {
    const doc = await PDFDocument.create();
    const [font, bold] = await Promise.all([
      doc.embedFont(StandardFonts.Helvetica),
      doc.embedFont(StandardFonts.HelveticaBold),
    ]);
    return new SheetWriter(doc, font, bold);
  }

  /** The panel content's left edge and width in the current column. */
  get inner() {
    return { x: MARGIN + this.column * (COLUMN_WIDTH + GUTTER) + PAD, width: COLUMN_WIDTH - 2 * PAD };
  }

  private addPage() {
    this.page = this.doc.addPage(PAGE);
    this.page.drawRectangle({ x: 0, y: 0, width: PAGE[0], height: PAGE[1], color: PAPER });
    const top = PAGE[1] - MARGIN;
    this.page.drawSvgPath(roundedRect(PAGE[0] - 2 * MARGIN, BAND, 5), { x: MARGIN, y: top, color: TAB_BG });
    this.text('IRON KINGDOMS: FULL METAL FANTASY', MARGIN + 10, top - 14, 11, true, WHITE);
    this.column = 0;
    this.y = TOP;
  }

  /** Text at a point, its baseline at `y`. */
  text(text: string, x: number, y: number, size: number, bold = false, color: RGB = SOFT) {
    const font = bold ? this.bold : this.font;
    this.page.drawText(fontSafe(text, font), { x, y, size, font, color });
  }

  /** A small capitalised label whose top is at `top`. */
  label(text: string, x: number, top: number, size = 6) {
    this.text(text.toUpperCase(), x, top - size, size, true);
  }

  /** Draws a shape on the current page; for sections that draw their own figures. */
  get canvas(): PDFPage {
    return this.page;
  }

  private openTab(title: string) {
    const x = MARGIN + this.column * (COLUMN_WIDTH + GUTTER);
    const width = this.bold.widthOfTextAtSize(fontSafe(title.toUpperCase(), this.bold), 8) + 14;
    this.page.drawSvgPath(roundedRect(width, TAB, 4, true), { x: x + 6, y: this.y, color: TAB_BG });
    this.text(title.toUpperCase(), x + 13, this.y - 10, 8, true, WHITE);
    this.panel = { title, top: this.y - TAB };
    this.y -= TAB + PAD;
  }

  /** Draws the open panel's border down to here. */
  private closePanel() {
    if (!this.panel) return;
    const x = MARGIN + this.column * (COLUMN_WIDTH + GUTTER);
    const height = this.panel.top - this.y + PAD - GAP;
    this.page.drawSvgPath(roundedRect(COLUMN_WIDTH, height, 6), {
      x,
      y: this.panel.top,
      borderColor: RULE,
      borderWidth: 0.8,
    });
    this.y = this.panel.top - height - GUTTER;
  }

  /** Moves to the next column, or a new page after the last; an open panel carries on there. */
  private advance() {
    const title = this.panel?.title;
    this.closePanel();
    this.panel = null;
    if (this.column + 1 >= COLUMNS) this.addPage();
    else {
      this.column += 1;
      this.y = TOP;
    }
    if (title) this.openTab(`${title.replace(/ \(cont\.\)$/, '')} (cont.)`);
  }

  /** Whether `height` more fits in this column. */
  fits(height: number) {
    return this.y - height >= BOTTOM + PAD;
  }

  /**
   * Starts a panel. Its tab is drawn with the first content, in the next column if the tab and `keep`
   * points of content don't fit here; a short table raises `keep` to keep itself whole.
   */
  section(title: string, keep = 2 * (LABEL + 15 + GAP)) {
    // A panel left open is closed first, so it still gets its border.
    this.end();
    this.pending = { title, keep };
  }

  /** Draws the pending section's tab, keeping it with `height` of content. */
  private open(height = 0) {
    if (!this.pending) return;
    const { title, keep } = this.pending;
    this.pending = null;
    if (!this.fits(TAB + PAD + Math.max(keep, height))) this.advance();
    this.openTab(title);
  }

  /** Closes the current panel. */
  end() {
    this.open();
    this.closePanel();
    this.panel = null;
  }

  /** Starts the next column; for laying out the first page on purpose. */
  nextColumn() {
    if (this.y < TOP) this.advance();
  }

  /** Breaks to the next column now unless `height` still fits, to keep a group of rows together. */
  keep(height: number) {
    this.open(height);
    if (!this.fits(height)) this.advance();
  }

  /** Reserves `height` in the current panel, breaking to the next column first if it doesn't fit. */
  block(height: number, draw: (x: number, top: number, width: number) => void) {
    this.open(height);
    if (!this.fits(height)) this.advance();
    const { x, width } = this.inner;
    draw(x, this.y, width);
    this.y -= height;
  }

  /** One editable text field. */
  field(name: string, value: Cell['value'], spot: FieldSpot) {
    const height = spot.height ?? fieldHeight(spot.lines);
    const font = spot.bold ? this.bold : this.font;
    const field = this.form.createTextField(name);
    if ((spot.lines ?? 1) > 1) field.enableMultiline();
    field.setText(fontSafe(value === null || value === undefined ? '' : String(value), font));
    field.addToPage(this.page, {
      x: spot.x,
      y: spot.top - height,
      width: spot.width,
      height,
      font,
      textColor: INK,
      backgroundColor: FIELD_BG,
      borderColor: RULE,
      borderWidth: 0.5,
    });
    field.setFontSize(spot.size ?? ((spot.lines ?? 1) > 1 ? 8 : 8.5));
    if (spot.center) field.setAlignment(TextAlignment.Center);
    // Drawn now in its own font, so saving doesn't redraw it in the regular one.
    field.updateAppearances(font);
  }

  /**
   * The image in a data URL, ready to draw; undefined for anything but a PNG or JPEG, or one that
   * won't decode, so a bad picture leaves the sheet without it rather than failing the export.
   */
  async embedImage(dataUrl: string): Promise<PDFImage | undefined> {
    const match = /^data:image\/(png|jpeg);base64,([A-Za-z0-9+/]+=*)$/.exec(dataUrl);
    if (!match) return undefined;
    try {
      return match[1] === 'png' ? await this.doc.embedPng(match[2]) : await this.doc.embedJpg(match[2]);
    } catch {
      return undefined;
    }
  }

  /** Draws the image as large as fits in the box, centred, keeping its shape; `top` is the box's top. */
  drawImage(image: PDFImage, x: number, top: number, width: number, height: number) {
    const scale = Math.min(width / image.width, height / image.height);
    const w = image.width * scale;
    const h = image.height * scale;
    this.page.drawImage(image, { x: x + (width - w) / 2, y: top - height + (height - h) / 2, width: w, height: h });
  }

  /**
   * A checkbox with its bottom-left corner at x, y; ticked when `checked`. With `fill` it is a circle
   * that fills with that colour when ticked, instead of showing a tick.
   */
  checkbox(name: string, x: number, y: number, size: number, checked: boolean, fill?: RGB) {
    const box = this.form.createCheckBox(name);
    box.addToPage(this.page, {
      x,
      y,
      width: size,
      height: size,
      textColor: INK,
      borderColor: fill ? undefined : RULE,
      borderWidth: fill ? 0 : 0.75,
    });
    if (checked) box.check();
    if (fill) {
      // Drawn in the box's own space, from 0, 0 to size, size.
      const circle = (color: RGB) =>
        drawEllipse({
          x: size / 2,
          y: size / 2,
          xScale: size / 2 - 0.5,
          yScale: size / 2 - 0.5,
          color,
          borderColor: INK,
          borderWidth: 0.8,
        });
      box.updateAppearances(() => ({ on: circle(fill), off: circle(FIELD_BG) }));
    }
  }

  /** A line of small text, such as a hint. */
  note(text: string) {
    this.block(10, (x, top) => this.text(text, x, top - 7, 6.5));
  }

  /** One row of labelled fields, across `share` of the column from the left (all of it by default). */
  fields(cells: Cell[], share = 1) {
    const height = LABEL + rowHeight(cells) + GAP;
    this.block(height, (x, top, width) => {
      split(
        cells.map((cell) => cell.weight ?? 1),
        width * share,
        x,
      ).forEach((spot, index) => {
        const cell = cells[index];
        this.label(cell.label, spot.x, top);
        this.field(cell.name, cell.value, { x: spot.x, top: top - LABEL, width: spot.w, lines: cell.lines });
      });
    });
  }

  /** A table: column headers, then a row of fields per entry, repeating the headers after a break. */
  table(columns: Column[], rows: Cell[][]) {
    // A short table starting a section moves to the next column whole rather than splitting.
    const total = LABEL + rows.reduce((sum, row) => sum + rowHeight(row) + 2, 0);
    if (this.pending && total < 220) this.pending.keep = Math.max(this.pending.keep, total);
    const header = () =>
      this.block(LABEL, (x, top, width) =>
        split(
          columns.map((column) => column.weight ?? 1),
          width,
          x,
          3,
        ).forEach((spot, index) => this.label(columns[index].label, spot.x, top)),
      );
    header();
    rows.forEach((row, index) => {
      const height = rowHeight(row) + 2;
      // The last two rows move to a new column together, so no row is left on its own.
      const needed = index === rows.length - 2 ? height + rowHeight(rows[index + 1]) + 2 : height;
      if (!this.fits(needed)) {
        this.advance();
        header();
      }
      this.block(height, (x, top, width) =>
        split(
          columns.map((column) => column.weight ?? 1),
          width,
          x,
          3,
        ).forEach((spot, column) =>
          this.field(row[column].name, row[column].value, { x: spot.x, top, width: spot.w, lines: row[column].lines }),
        ),
      );
    });
    this.y -= GAP;
  }

  /**
   * Saves the PDF. Each page's footer has "<left> · page 1 of 3" on the left and `right`, such as
   * when it was exported, on the right.
   */
  save(left: string, right: string): Promise<Uint8Array> {
    this.end();
    const pages = this.doc.getPages();
    const rightText = fontSafe(right, this.font);
    const rightX = PAGE[0] - MARGIN - this.font.widthOfTextAtSize(rightText, 7);
    pages.forEach((page, index) => {
      const footer = { y: MARGIN / 2, size: 7, font: this.font, color: SOFT };
      page.drawText(fontSafe(`${left} · page ${index + 1} of ${pages.length}`, this.font), { x: MARGIN, ...footer });
      page.drawText(rightText, { x: rightX, ...footer });
    });
    return this.doc.save();
  }
}
