import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { SheetProvider, type SheetUpdater } from '@/components/SheetProvider';
import { character, classWith } from '../../../__tests__/character';
import type { FuCharacter } from '../../../types';
import { ConflictBar } from '../ConflictBar';

function Sheet({ initial }: { initial: FuCharacter }) {
  const [data, setData] = useState(initial);
  return (
    <SheetProvider
      data={data}
      onChange={(update: SheetUpdater) => setData((current) => update(current) as FuCharacter)}
    >
      <ConflictBar onPanelChange={() => {}} />
    </SheetProvider>
  );
}

const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }));
const drawer = () => {
  click('Show conflict details');
  return within(screen.getByRole('region', { name: 'Conflict details' }));
};

/** Types an amount into the popup a pool's button opens, and applies it. */
function change(scope: ReturnType<typeof drawer>, button: string, amount: string) {
  fireEvent.click(scope.getByRole('button', { name: button }));
  const popup = screen.getByRole('dialog');
  fireEvent.change(within(popup).getByRole('spinbutton'), { target: { value: amount } });
  fireEvent.click(within(popup).getByRole('button', { name: 'Apply' }));
}

describe('ConflictBar', () => {
  // jsdom has no ResizeObserver, which the drawer's tables use to switch to stacked rows.
  beforeAll(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    );
  });

  it('starts a conflict, then ends and starts your turns', () => {
    render(<Sheet initial={character()} />);
    click('Start conflict');
    click('Start turn');
    expect(screen.getByText('Conflict · your turn 1')).toBeInTheDocument();
    click('End turn');
    expect(screen.getByText('Conflict · turn 1 done')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start turn' })).toBeInTheDocument();
  });

  it('undoes the last events from the drawer, newest first', () => {
    render(<Sheet initial={character()} />);
    click('Start conflict');
    click('Start turn');
    const details = drawer();
    fireEvent.click(details.getByRole('button', { name: 'Undo Start turn' }));
    fireEvent.click(details.getByRole('button', { name: 'Undo Start conflict' }));
    expect(screen.getByRole('button', { name: 'Start conflict' })).toBeInTheDocument();
    expect(details.getByRole('button', { name: 'Undo' })).toBeDisabled();
  });

  it('offers undo on the bar right after a button', () => {
    render(<Sheet initial={character()} />);
    click('Start conflict');
    const quick = screen.getAllByRole('button', { name: 'Undo Start conflict' });
    fireEvent.click(quick[0]);
    expect(screen.getByRole('button', { name: 'Start conflict' })).toBeInTheDocument();
  });

  it('turns undo off once something else changes, so the change is not thrown away', () => {
    render(<Sheet initial={character()} />);
    click('Start conflict');
    const details = drawer();
    change(details, 'Damage', '1');
    expect(details.getByRole('button', { name: 'Undo' })).toBeDisabled();
  });

  it('asks how much damage or healing, and keeps HP between 0 and the maximum', () => {
    render(<Sheet initial={character()} />);
    const details = drawer();
    change(details, 'Damage', '25');
    expect(screen.getAllByRole('img', { name: 'HP 15 of 40, in Crisis' })).toHaveLength(2);
    change(details, 'Damage', '25');
    expect(screen.getAllByRole('img', { name: 'HP 0 of 40, in Crisis' })).toHaveLength(2);
    change(details, 'Heal', '99');
    expect(screen.getAllByRole('img', { name: 'HP 40 of 40' })).toHaveLength(2);
  });

  it("shows when a Floralist's magiseed effect is due", () => {
    const floralist = character({ classes: [classWith('Floralist', ['Chloromancy', 1])] });
    render(<Sheet initial={{ ...floralist, floralist: { ...floralist.floralist, garden: 'Remedy Lily' } }} />);
    click('Start conflict');
    click('Start turn');
    const chips = within(screen.getByRole('list', { name: 'Happening now' }));
    expect(chips.getByText('→ 1')).toBeInTheDocument();
    click('End turn');
    expect(chips.getByText('· apply effect')).toBeInTheDocument();
  });
});
