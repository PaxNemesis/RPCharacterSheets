export type TabSizes = {
  /** Each tab's width, in order. */
  tabs: number[];
  /** The space between two tabs. */
  gap: number;
  /** The room in the row for the tabs and, if needed, the More button with the space before it. */
  available: number;
  /** The More button's width, plus the space before it. */
  more: number;
};

/**
 * Which tabs fit in the row, by index. All of them if they fit; otherwise as many as fit from the start,
 * plus the active one, with room left for the More button that holds the rest.
 */
export function fitTabs({ tabs, gap, available, more }: TabSizes, activeIndex: number): Set<number> {
  const all = new Set(tabs.keys());
  const total = tabs.reduce((sum, width) => sum + width, 0) + gap * Math.max(0, tabs.length - 1);
  if (total <= available) return all;

  const shown = new Set<number>();
  const active = tabs[activeIndex] === undefined ? -1 : activeIndex;
  let room = available - more;
  if (active >= 0) {
    shown.add(active);
    room -= tabs[active];
  }
  for (const [index, width] of tabs.entries()) {
    if (index === active) continue;
    if (width + gap > room) break;
    shown.add(index);
    room -= width + gap;
  }
  return shown;
}
