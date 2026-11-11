import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable';
import type { FuEffect } from '../../../../../types';
import type { ClassStatus } from '../../../ConflictBar.types';

const COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Effect', width: '3fr' },
  {
    key: 'lasts',
    label: 'Lasts',
    type: 'select',
    width: '2fr',
    options: [
      { value: 'endOfTurn', label: 'This turn' },
      { value: 'nextTurn', label: 'Until next turn' },
      { value: 'scene', label: 'This scene' },
      { value: 'removed', label: 'Until removed' },
    ],
  },
  { key: 'notes', label: 'Notes', wide: true },
];

const createEffect = (): FuEffect => ({ name: '', lasts: 'scene', notes: '' });

type EffectsEditorProps = {
  /** Effects kept running by a class, such as a dance; they end through that class's own tab. */
  classEffects: ClassStatus['effects'];
};

/** Spells, buffs and anything else running on the character; each goes when its time runs out. */
export function EffectsEditor({ classEffects }: EffectsEditorProps) {
  return (
    <>
      <h3 className="conflict-drawer-badge">Active</h3>
      {classEffects.map((effect) => (
        <p key={effect.name} className="conflict-drawer-card">
          <strong>{effect.name}</strong>
          <span>{effect.lasts}</span>
        </p>
      ))}
      <RepeatTable path="effects" columns={COLUMNS} createRow={createEffect} itemName="effect" />
    </>
  );
}
