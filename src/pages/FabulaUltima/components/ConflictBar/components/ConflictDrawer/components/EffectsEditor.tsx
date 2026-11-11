import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable';
import type { FuEffect } from '../../../../../types';
import type { ClassStatus } from '../../../ConflictBar.types';

const COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Effect', width: '2fr' },
  { key: 'source', label: 'From', suggestions: ['Spell', 'Skill', 'Heroic Skill', 'Item', 'Ally'] },
  {
    key: 'lasts',
    label: 'Lasts',
    type: 'select',
    width: '1.4fr',
    options: [
      { value: 'endOfTurn', label: 'Until end of this turn' },
      { value: 'nextTurn', label: 'Until your next turn' },
      { value: 'scene', label: 'Until end of scene' },
      { value: 'removed', label: 'Until removed' },
    ],
  },
  { key: 'notes', label: 'Notes', wide: true },
];

const createEffect = (): FuEffect => ({ name: '', source: '', lasts: 'scene', notes: '' });

type EffectsEditorProps = {
  /** Effects kept running by a class, such as a dance; they end through that class's own tab. */
  classEffects: ClassStatus['effects'];
};

/** Spells, buffs and anything else running on the character, removed when they run out. */
export function EffectsEditor({ classEffects }: EffectsEditorProps) {
  return (
    <div className="conflict-drawer-section">
      <h3 className="conflict-drawer-heading">Effects</h3>
      {classEffects.length > 0 && (
        <ul className="conflict-drawer-class-effects">
          {classEffects.map((effect) => (
            <li key={effect.name}>
              <strong>{effect.name}</strong>, {effect.lasts}
            </li>
          ))}
        </ul>
      )}
      <RepeatTable path="effects" columns={COLUMNS} createRow={createEffect} itemName="effect" />
      <p className="fu-note">
        Ending your turn removes effects lasting until the end of it; starting your next turn removes those lasting
        until then; ending the conflict or scene, or resting, removes both and those lasting the scene.
      </p>
    </div>
  );
}
