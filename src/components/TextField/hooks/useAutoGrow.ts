import { useLayoutEffect, useRef } from 'react';

/**
 * Grows a textarea to fit its text. Its `rows` stay the smallest size and its CSS `max-height` the
 * largest; past that it scrolls. Refits when the text changes or the box gets wider or narrower, but
 * not when only its height changes, so dragging the resize handle still works until the next edit.
 */
export function useAutoGrow(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (ref.current) fit(ref.current);
  }, [value]);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    let width = element.offsetWidth;
    const observer = new ResizeObserver(() => {
      if (element.offsetWidth === width) return;
      width = element.offsetWidth;
      fit(element);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function fit(element: HTMLTextAreaElement) {
  // Back to the `rows` height first, so the box can shrink when text is removed.
  element.style.height = '';
  const borders = element.offsetHeight - element.clientHeight;
  if (element.scrollHeight > element.clientHeight) {
    element.style.height = `${element.scrollHeight + borders}px`;
  }
}
