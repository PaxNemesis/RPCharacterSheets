import { useLayoutEffect, useRef, useState, type RefObject } from 'react';

/** Narrowest a cell gets in a card, plus the gap after it; fields narrower than this get hard to read. */
const CARD_CELL_WIDTH = 150 + 8;
/** A card's handle and button columns, with their gaps. */
const CARD_EDGES = 28 + 60 + 2 * 8;

export type StackedLayout = {
  stacked: boolean;
  /**
   * Cells side by side in a card: as many as fit, from two up to half the cells, so a card always has
   * at least two lines and doesn't just repeat the table row with labels.
   */
  columns: number;
};

/**
 * Whether the table's columns don't fit its container, so rows should stack as cards instead of
 * scrolling sideways, and how many cells a card fits side by side. The width the columns need is
 * measured while they're laid out as a table, and kept while stacked, so the table switches back as
 * soon as there is room again.
 */
export function useStackedLayout(
  container: RefObject<HTMLElement | null>,
  grid: RefObject<HTMLElement | null>,
  cells: number,
): StackedLayout {
  const [layout, setLayout] = useState<StackedLayout>({ stacked: false, columns: 2 });
  const current = useRef(layout);
  const needed = useRef(0);

  useLayoutEffect(() => {
    const outer = container.current;
    const inner = grid.current;
    if (!outer || !inner) return;

    const check = () => {
      if (!current.current.stacked) needed.current = inner.scrollWidth;
      const available = outer.clientWidth;
      const stacked = needed.current > available + 1;
      const fit = Math.floor((available - CARD_EDGES) / CARD_CELL_WIDTH);
      const columns = Math.max(2, Math.min(fit, Math.ceil(cells / 2)));
      if (stacked !== current.current.stacked || columns !== current.current.columns) {
        current.current = { stacked, columns };
        setLayout(current.current);
      }
    };
    const observer = new ResizeObserver(check);
    observer.observe(outer);
    observer.observe(inner);
    check();
    return () => observer.disconnect();
  }, [container, grid, cells]);

  return layout;
}
