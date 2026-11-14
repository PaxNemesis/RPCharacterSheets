import { useLayoutEffect, useState, type RefObject } from 'react';
import { fitTabs } from '../utils/fitTabs';

type OverflowRefs = {
  /** The visible row. */
  row: RefObject<HTMLElement | null>;
  /** A hidden copy of every tab and the More button, laid out in one line to be measured. */
  measure: RefObject<HTMLElement | null>;
  /** What follows the tabs, such as an add button, which keeps its place. */
  trailing: RefObject<HTMLElement | null>;
};

const gapOf = (element: Element) => parseFloat(getComputedStyle(element).columnGap) || 0;

/**
 * The indexes of the tabs that fit in the row; the rest go in a More menu. Measured again whenever the
 * row is resized or a measured tab changes width, such as a renamed character.
 */
export function useTabOverflow(refs: OverflowRefs, count: number, activeIndex: number) {
  const [shown, setShown] = useState<Set<number>>(() => new Set(Array.from({ length: count }, (_, i) => i)));

  useLayoutEffect(() => {
    const row = refs.row.current;
    const measure = refs.measure.current;
    if (!row || !measure) return;
    const update = () => {
      const width = (element: Element | null | undefined) => element?.getBoundingClientRect().width ?? 0;
      const rowGap = gapOf(row);
      const trailing = refs.trailing.current;
      const next = fitTabs(
        {
          tabs: [...measure.querySelectorAll(':scope > .tabs-tab')].map(width),
          gap: gapOf(measure),
          available: width(row) - (trailing ? width(trailing) + rowGap : 0),
          more: width(measure.querySelector(':scope > .dropdown-container')) + rowGap,
        },
        activeIndex,
      );
      setShown((current) => (current.size === next.size && [...next].every((i) => current.has(i)) ? current : next));
    };
    update();
    // Missing in test environments such as jsdom, where nothing is laid out anyway.
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(update);
    observer.observe(row);
    for (const child of measure.children) observer.observe(child);
    return () => observer.disconnect();
  }, [refs.row, refs.measure, refs.trailing, count, activeIndex]);

  return shown;
}
