import { useLayoutEffect, useRef, useState } from 'react';

/** The height of an element, kept up to date as it changes, such as when the bar wraps on a narrow screen. */
export function useElementHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState<number>();

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    setHeight(element.offsetHeight);
    // Without ResizeObserver (as in tests), the first measurement stays.
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => setHeight(element.offsetHeight));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, height] as const;
}
