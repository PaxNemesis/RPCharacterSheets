import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { SheetProvider, type SheetUpdater } from '@/components/SheetProvider';
import { character } from '../../../__tests__/character';
import type { IkCharacter } from '../../../types';
import { createArmor } from '../../../utils/createCharacter';
import { toStored } from '../../../utils/storage';
import { EquipmentSection } from '../EquipmentSection';

function Sheet({ initial }: { initial: IkCharacter }) {
  const [data, setData] = useState(initial);
  return (
    <SheetProvider
      data={data}
      onChange={(update: SheetUpdater) => setData((current) => update(current) as IkCharacter)}
    >
      <EquipmentSection />
    </SheetProvider>
  );
}

const armorPanel = () => screen.getByRole('heading', { name: 'Worn armor' }).closest('section') as HTMLElement;

describe('EquipmentSection', () => {
  // jsdom has no ResizeObserver, which the tables use to switch to stacked rows.
  beforeAll(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    );
  });

  it('stores worn armor under its table and swaps it back for what is worn', () => {
    const leather = { ...createArmor(), name: 'Leather', arm: 2 };
    const plate = { ...createArmor(), name: 'Plate', arm: 7 };
    render(<Sheet initial={character({ armor: [leather], stored: [toStored('armor', plate)] })} />);
    const panel = within(armorPanel());
    expect(panel.getByText('Plate')).toBeInTheDocument();

    fireEvent.click(panel.getByRole('button', { name: 'Swap Plate for Leather' }));
    expect(panel.getByText('Leather')).toBeInTheDocument();
    expect(panel.getByDisplayValue('Plate')).toBeInTheDocument();

    fireEvent.click(panel.getByRole('button', { name: 'Store armor 1' }));
    expect(panel.queryAllByRole('textbox')).toHaveLength(0);
    expect(panel.getByRole('button', { name: 'Equip Plate' })).toBeInTheDocument();
  });

  it('shows no stored list where nothing of that kind is stored', () => {
    render(<Sheet initial={character()} />);
    expect(screen.queryByRole('heading', { name: 'Stored' })).not.toBeInTheDocument();
  });
});
