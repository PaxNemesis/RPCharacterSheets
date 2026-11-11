import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable';
import type { FuUse } from '../../../../../types';

const COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Skill or item', width: '3fr' },
  { key: 'used', label: 'Used', type: 'number', width: '56px' },
  { key: 'max', label: 'Of', type: 'number', width: '56px' },
  {
    key: 'resets',
    label: 'Back',
    type: 'select',
    width: '2fr',
    options: [
      { value: 'turn', label: 'Each turn' },
      { value: 'scene', label: 'Each scene' },
      { value: 'rest', label: 'On a rest' },
      { value: '', label: 'By hand' },
    ],
  },
];

const createUse = (): FuUse => ({ name: '', used: 0, max: 1, resets: 'scene' });

/** Skills, Heroic Skills and items usable a limited number of times, such as once per scene. */
export function UsesEditor() {
  return (
    <>
      <h3 className="conflict-drawer-badge">Limited uses</h3>
      <RepeatTable path="uses" columns={COLUMNS} createRow={createUse} itemName="limited use" />
    </>
  );
}
