import { useState } from 'react';

const STORAGE_KEY = 'rpcharactersheets:fabula-ultima:conflict-drawer';

// Storage can be blocked or unavailable; the drawer then simply starts closed.
const read = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'open';
  } catch {
    return false;
  }
};

/** Whether the conflict drawer is open, remembered in this browser for every character. */
export function useDrawerOpen() {
  const [open, setOpen] = useState(read);

  const change = (next: boolean) => {
    setOpen(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'open' : 'closed');
    } catch {
      // Not remembered, but the drawer still opens and closes.
    }
  };

  return [open, change] as const;
}
