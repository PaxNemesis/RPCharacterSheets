import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable';
import type { FuUse } from '../../../../../types';

const COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Skill or item', width: '2fr' },
  { key: 'used', label: 'Used', type: 'number', width: '64px' },
  { key: 'max', label: 'Of', type: 'number', width: '64px' },
  {
    key: 'resets',
    label: 'Comes back',
    type: 'select',
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
    <div className="conflict-drawer-section">
      <h3 className="conflict-drawer-heading">Limited uses</h3>
      <RepeatTable path="uses" columns={COLUMNS} createRow={createUse} itemName="limited use" />
    </div>
  );
}
