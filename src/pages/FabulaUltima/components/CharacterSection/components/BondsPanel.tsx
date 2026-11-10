import { Panel } from '@/components/Panel';
import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable';
import type { FuBond } from '../../../types';
import { createBond } from '../../../utils/createCharacter';

const pair = (first: string, second: string) => [
  { value: '', label: '—' },
  { value: first.toLowerCase(), label: first },
  { value: second.toLowerCase(), label: second },
];

const COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Bond with', width: 'minmax(140px, 2fr)' },
  {
    key: 'respect',
    label: 'Respect',
    width: 'minmax(110px, 1fr)',
    type: 'select',
    options: pair('Admiration', 'Inferiority'),
  },
  { key: 'trust', label: 'Trust', width: 'minmax(100px, 1fr)', type: 'select', options: pair('Loyalty', 'Mistrust') },
  {
    key: 'feeling',
    label: 'Feeling',
    width: 'minmax(100px, 1fr)',
    type: 'select',
    options: pair('Affection', 'Hatred'),
  },
  {
    key: 'strength',
    label: 'Str.',
    width: '52px',
    type: 'calculated',
    calculate: (row) => {
      const bond = row as FuBond;
      return [bond.respect, bond.trust, bond.feeling].filter(Boolean).length;
    },
  },
];

type BondsPanelProps = {
  count: number;
};

export function BondsPanel({ count }: BondsPanelProps) {
  return (
    <Panel title="Bonds">
      <RepeatTable path="bonds" columns={COLUMNS} createRow={createBond} itemName="bond" />
      {count > 6 ? (
        <p className="fu-warning">You can have at most six Bonds; erase one before creating another (p. 57).</p>
      ) : (
        <p className="fu-note">
          Pick at most one emotion from each pair; strength is the number of emotions (pp. 56–57).
        </p>
      )}
    </Panel>
  );
}
