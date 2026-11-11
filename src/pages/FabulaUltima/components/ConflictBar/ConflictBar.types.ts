/** A row of dots, such as Soul Beads or a Growth Clock. Tracks shown together differ in tone, which keys them. */
export type Track = { filled: number; size: number; tone?: 'resolve' };

/** A chip on the bar's second line: something happening right now. */
export type BarChip = {
  key: string;
  text: string;
  tracks?: Track[];
  /** A few quiet words after the text, such as how long it lasts. */
  note?: string;
  /** The full explanation, shown on hover. */
  title?: string;
  /** Something to do now, such as applying a magiseed's effect. */
  due?: boolean;
};

/** What a class is tracking right now, for the bar and the drawer. */
export type ClassStatus = {
  /** The sheet section with the class's full controls. */
  panel: string;
  label: string;
  /** For the drawer, such as "Remedy Lily" with its Growth Clock. */
  summary: string;
  tracks?: Track[];
  /** The bar's chip, only while something is happening. */
  chip?: BarChip;
  /** Effects the class keeps running, shown with the character's own effects. */
  effects: { name: string; lasts: string }[];
};
