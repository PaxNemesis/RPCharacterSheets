import { useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';

/** Space between the button and the panel, and the least between the panel and the window's edges. */
const GAP = 8;

/**
 * Where to put an open panel, below its button: against the window (position: fixed), so a scrolling
 * parent such as a tab row can't clip it. It lines up with the button's left edge in the left half of
 * the window and its right edge in the right half, then moves in to stay on screen. Follows scrolling
 * and resizing.
 */
export function usePanelPosition(
  open: boolean,
  buttonRef: RefObject<HTMLElement | null>,
  panelRef: RefObject<HTMLElement | null>,
) {
  const [position, setPosition] = useState<CSSProperties>();

  useLayoutEffect(() => {
    const button = buttonRef.current;
    const panel = panelRef.current;
    if (!open || !button || !panel) return;
    const place = () => {
      // Measured in screen pixels. The text size setting zooms the page, panel offsets included, so
      // they are divided back by the zoom.
      const zoom = (button as HTMLElement & { currentCSSZoom?: number }).currentCSSZoom ?? 1;
      const rect = button.getBoundingClientRect();
      const panelWidth = panel.getBoundingClientRect().width;
      const windowWidth = document.documentElement.clientWidth;
      const aligned = rect.left + rect.width / 2 < windowWidth / 2 ? rect.left : rect.right - panelWidth;
      const left = Math.max(GAP, Math.min(aligned, windowWidth - panelWidth - GAP));
      setPosition({ top: rect.bottom / zoom + GAP, left: left / zoom });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
      setPosition(undefined);
    };
  }, [open, buttonRef, panelRef]);

  // Hidden until placed, so it never shows at the wrong spot for a frame.
  return position ?? { visibility: 'hidden' as const };
}
