import { useMemo } from 'react';
import { Panel } from '@/components/Panel';
import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable';
import { SheetProvider, useSheet } from '@/components/SheetProvider';
import { TextField } from '@/components/TextField';
import { useRowIds } from '@/hooks/useRowIds';
import { useIkCharacter } from '../../hooks/useIkCharacter';
import { findSpell, spellFields, spellNames } from '../../constants/spells';
import type { IkSettings, IkSpell } from '../../types';
import { createMechanika } from '../../utils/createCharacter';
import { MechanikaDevice } from './components';

/** The spell table's columns; picking a suggested spell fills in its numbers and page, keeping the description. */
const spellColumns = (settings: IkSettings): RepeatTableColumn[] => [
  {
    key: 'name',
    label: 'Spell',
    width: 'minmax(140px, 2fr)',
    suggestions: spellNames(settings),
    onPick: (name, row) => {
      const spell = findSpell(name, settings);
      return spell ? { ...row, ...spellFields(spell) } : row;
    },
  },
  { key: 'cost', label: 'Cost', width: '52px', type: 'number' },
  { key: 'rng', label: 'RNG', width: '60px' },
  { key: 'aoe', label: 'AOE', width: '60px' },
  { key: 'pow', label: 'POW', width: '52px', type: 'number' },
  { key: 'up', label: 'UP', width: '52px' },
  { key: 'off', label: 'OFF', width: '52px' },
  { key: 'page', label: 'Page', width: '64px' },
  { key: 'description', label: 'Description', rows: 2, wide: true },
];

const createSpell = (): IkSpell => ({
  name: '',
  cost: null,
  rng: '',
  aoe: '',
  pow: null,
  up: '',
  off: '',
  page: '',
  description: '',
});

export function MagicSection() {
  const { character, derived } = useIkCharacter();
  const { set } = useSheet();
  const columns = useMemo(() => spellColumns(character.settings), [character.settings]);
  const devices = character.mechanika ?? [];
  const deviceName = (index: number) => devices[index].name?.trim() || `Device ${index + 1}`;

  // Each device has its own rune table, which must stay with it when an earlier device is removed.
  const deviceIds = useRowIds(devices.length);
  const removeDevice = (index: number) => {
    if (!window.confirm(`Remove ${deviceName(index)} and everything recorded for it?`)) return;
    deviceIds.remove(index);
    set(
      'mechanika',
      devices.filter((_, other) => other !== index),
    );
  };

  return (
    <div className="ik-section">
      {character.settings.magic && (
        <Panel title="Spells">
          {character.settings.raceRules ? (
            // With race rules on, the Character tab picks it, next to the archetype it depends on.
            <p className="ik-note">
              {character.identity.archetype === 'Gifted'
                ? `Arcane tradition: ${character.arcaneTradition || 'not chosen'}. Change it on the Character tab.`
                : 'Only Gifted characters have an arcane tradition; choose the archetype on the Character tab.'}
            </p>
          ) : (
            <div className="ik-fields">
              <TextField path="arcaneTradition" label="Arcane tradition" />
            </div>
          )}
          <p
            className={
              derived.spellLimit !== null && character.spells.length > derived.spellLimit ? 'ik-warning' : 'ik-note'
            }
          >
            Spells known: {character.spells.length}
            {derived.spellLimit !== null && ` of at most ${derived.spellLimit} (twice INT, p. 118)`}.
          </p>
          <RepeatTable path="spells" columns={columns} createRow={createSpell} itemName="spell" />
        </Panel>
      )}
      {character.settings.mechanika && (
        <>
          <Panel
            title="Mechanika"
            actions={
              <button type="button" onClick={() => set('mechanika', [...devices, createMechanika()])}>
                + Add device
              </button>
            }
          >
            <p className="ik-note">
              A device is a housing, a capacitor and a runeplate (pp. 279–286). A runeplate holds up to five rune
              points, all of one type, and the capacitor must power them all. Pick a capacitor or rune by name to fill
              in its values.
            </p>
          </Panel>
          {devices.map((_, index) => (
            <SheetProvider key={deviceIds.ids[index]} path={`mechanika.${index}`}>
              <MechanikaDevice number={index + 1} onRemove={() => removeDevice(index)} />
            </SheetProvider>
          ))}
        </>
      )}
    </div>
  );
}
