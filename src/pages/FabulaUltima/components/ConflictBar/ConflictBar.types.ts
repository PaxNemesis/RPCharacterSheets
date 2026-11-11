/** What a class is tracking right now, for the conflict bar. */
export type ClassStatus = {
  /** The sheet section with the class's full controls. */
  panel: string;
  label: string;
  /** A few words for the bar, such as "Core 3 · Resolve 2". */
  summary: string;
  /** Effects the class keeps running, shown with the character's own effects. */
  effects: { name: string; lasts: string }[];
  /** Something to do now or at the end of the turn, such as a magiseed's effect. */
  reminder?: string;
};
