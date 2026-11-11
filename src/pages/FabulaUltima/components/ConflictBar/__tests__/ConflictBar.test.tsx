import { fireEvent, render, screen } from '@testing-library/react';
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
const undoButton = () => screen.getByRole('button', { name: /^Undo/ });

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
    expect(screen.getByRole('button', { name: /No conflict/ })).toBeInTheDocument();
    click('Start conflict');
    click('Start turn');
    expect(screen.getByRole('button', { name: /Turn 1/ })).toBeInTheDocument();
    click('End turn');
    expect(screen.getByRole('button', { name: /turn 1 done/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start turn' })).toBeInTheDocument();
  });

  it('undoes the last events, newest first', () => {
    render(<Sheet initial={character()} />);
    expect(undoButton()).toBeDisabled();
    click('Start conflict');
    click('Start turn');
    click('Undo Start turn');
    expect(screen.getByRole('button', { name: 'Start turn' })).toBeInTheDocument();
    click('Undo Start conflict');
    expect(screen.getByRole('button', { name: 'Start conflict' })).toBeInTheDocument();
    expect(undoButton()).toBeDisabled();
  });

  it('turns undo off once something else changes, so the change is not thrown away', () => {
    render(<Sheet initial={character()} />);
    click('Start conflict');
    click(/No conflict|Waiting/);
    click('Lose 1 HP');
    expect(undoButton()).toBeDisabled();
  });

  it('changes HP by the amount, between 0 and the maximum', () => {
    render(<Sheet initial={character()} />);
    click('No conflict');
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '25' } });
    click('Lose 25 HP');
    expect(screen.getByLabelText('Current HP')).toHaveValue('15');
    click('Lose 25 HP');
    expect(screen.getByLabelText('Current HP')).toHaveValue('0');
    click('Recover 25 HP');
    click('Recover 25 HP');
    expect(screen.getByLabelText('Current HP')).toHaveValue('40');
  });

  it("reminds a Floralist of the magiseed's end-of-turn effect", () => {
    const floralist = character({ classes: [classWith('Floralist', ['Chloromancy', 1])] });
    render(<Sheet initial={{ ...floralist, floralist: { ...floralist.floralist, garden: 'Remedy Lily' } }} />);
    click('Start conflict');
    click('Start turn');
    expect(screen.getByText(/Ending your turn fills the Growth Clock to 1/)).toBeInTheDocument();
    click('End turn');
    expect(screen.getByText(/apply Remedy Lily's effect for 1 filled section/)).toBeInTheDocument();
  });
});
