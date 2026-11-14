import { describe, expect, it } from 'vitest';
import { fitTabs } from '../utils/fitTabs';

const sizes = (available: number) => ({ tabs: [100, 100, 100, 100], gap: 10, available, more: 60 });
const fit = (available: number, active = 0) => [...fitTabs(sizes(available), active)].sort();

describe('fitTabs', () => {
  it('shows every tab when they all fit', () => {
    expect(fit(430)).toEqual([0, 1, 2, 3]);
  });

  it('shows as many as fit from the start, leaving room for More', () => {
    // 60 for More, then 100 + 110 + 110 = 320.
    expect(fit(429)).toEqual([0, 1, 2]);
    expect(fit(379)).toEqual([0, 1]);
  });

  it('always shows the active tab, taking the place of a later one', () => {
    expect(fit(379, 3)).toEqual([0, 3]);
  });

  it('shows only the active tab when nothing else fits', () => {
    expect(fit(100, 2)).toEqual([2]);
  });
});
