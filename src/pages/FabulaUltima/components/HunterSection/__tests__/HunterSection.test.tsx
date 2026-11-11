import { fireEvent, render, screen, within } from '@testing-library/react';
import { useEffect, useState } from 'react';
import { describe, expect, it } from 'vitest';
import { SheetProvider, type SheetUpdater } from '@/components/SheetProvider';
import { character, classWith } from '../../../__tests__/character';
import type { FuCharacter } from '../../../types';
import { HunterSection } from '../HunterSection';

let latest: FuCharacter;

function Sheet({ initial }: { initial: FuCharacter }) {
  const [data, setData] = useState(initial);
  // What the sheet holds after each change, for the tests to check.
  useEffect(() => {
    latest = data;
  }, [data]);
  return (
    <SheetProvider
      data={data}
      onChange={(update: SheetUpdater) => setData((current) => update(current) as FuCharacter)}
    >
      <HunterSection />
    </SheetProvider>
  );
}

const hunter = (traps: string[] = []) => ({
  ...character({ classes: [classWith('Hunter', ['Set Trap', 2], ['Lock-On', 1])] }),
  hunter: { traps, notes: {}, trapSet: '' },
});

const learnable = () =>
  within(screen.getByRole('combobox', { name: 'Learn a trap' }))
    .getAllByRole('option')
    .map((option) => option.textContent);

describe('HunterSection', () => {
  it('offers traps up to the Set Trap Skill Level, two of each level', () => {
    render(<Sheet initial={hunter(['Tripwire', 'Siren'])} />);
    expect(learnable()).toEqual(['Learn trap…', 'Snare Net', 'Blinding Powder', 'Mocking Trap']);
  });

  it('sets a trap for its IP and the MP of its size, once per conflict', () => {
    render(<Sheet initial={hunter(['Snare Net'])} />);
    fireEvent.click(screen.getByRole('button', { name: /^Medium/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Set medium (−2 IP, −10 MP)' }));
    // Maximum IP 8 with the Hunter's +2, maximum MP 43 at level 3.
    expect([latest.ip.current, latest.mp.current, latest.hunter.trapSet]).toEqual([6, 33, 'Snare Net']);
    expect(screen.getByRole('button', { name: /^Set medium/ })).toBeDisabled();
  });

  it('locks on for 10 MP, adding the effect to the conflict drawer', () => {
    render(<Sheet initial={hunter()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Lock on (−10 MP)' }));
    expect(latest.mp.current).toBe(33);
    expect(latest.effects).toEqual([
      { name: 'Lock-On', lasts: 'nextTurn', notes: "+2 to allies' Checks against the target; weak if all succeed" },
    ]);
  });
});
