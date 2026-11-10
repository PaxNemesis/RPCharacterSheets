import { useLayoutEffect, useRef, useState, type RefObject } from 'react';

/**
 * Whether the table's columns don't fit its container, so rows should stack as cards instead of
 * scrolling sideways. The width the columns need is measured while they're laid out as a table,
 * and kept while stacked, so the table switches back as soon as there is room again.
 */
export function useStackedLayout(container: RefObject<HTMLElement | null>, grid: RefObject<HTMLElement | null>) {
  const [stacked, setStacked] = useState(false);
  const stackedRef = useRef(false);
  const needed = useRef(0);

  useLayoutEffect(() => {
    const outer = container.current;
    const inner = grid.current;
    if (!outer || !inner) return;

    const check = () => {
      if (!stackedRef.current) needed.current = inner.scrollWidth;
      const next = needed.current > outer.clientWidth + 1;
      if (next !== stackedRef.current) {
        stackedRef.current = next;
        setStacked(next);
      }
    };
    const observer = new ResizeObserver(check);
    observer.observe(outer);
    observer.observe(inner);
    check();
    return () => observer.disconnect();
  }, [container, grid]);

  return stacked;
}
