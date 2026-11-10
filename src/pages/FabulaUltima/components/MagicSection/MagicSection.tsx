import { Panel } from '@/components/Panel';
import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable';
import { useFuCharacter } from '../../hooks/useFuCharacter';
import type { FuEntry } from '../../types';
import { RitualsPanel, SpellsPanel } from './components';

// The Arcana in the core rules (pp. 179–181).
const ARCANA = ['Forge', 'Frost', 'Gate', 'Grimoire', 'Oak', 'Sky', 'Sword', 'Tower', 'Wheel'].map(
  (name) => `Arcanum of the ${name}`,
);

const ARCANA_COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Arcanum', width: 'minmax(140px, 1fr)', suggestions: ARCANA },
  { key: 'notes', label: 'Domains, merge & dismiss', width: 'minmax(240px, 3fr)', rows: 3 },
];

const createArcanum = (): FuEntry => ({ name: '', notes: '' });

export function MagicSection() {
  const { character, derived } = useFuCharacter();
  const isArcanist = character.classes.some((entry) => entry.name.trim().toLowerCase() === 'arcanist');

  return (
    <div className="fu-section">
      <SpellsPanel character={character} />
      {(isArcanist || character.arcana.length > 0) && (
        <Panel title="Arcana">
          <p className="fu-note">Arcana you have bound (pp. 178–181).</p>
          <RepeatTable path="arcana" columns={ARCANA_COLUMNS} createRow={createArcanum} itemName="Arcanum" />
        </Panel>
      )}
      <RitualsPanel character={character} derived={derived} />
    </div>
  );
}
