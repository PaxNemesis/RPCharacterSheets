import { Panel } from '@/components/Panel';
import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable';
import { compareNames } from '@/utils/alphabetical';
import { bookEnabled, bookRef } from '../../../constants/books';
import { SPELLS } from '../../../constants/spells';
import type { FuCharacter, FuSpell } from '../../../types';

const createSpell = (): FuSpell => ({
  name: '',
  offensive: '',
  mp: '',
  targets: '',
  duration: '',
  page: '',
  notes: '',
});

type SpellsPanelProps = {
  character: FuCharacter;
};

export function SpellsPanel({ character }: SpellsPanelProps) {
  const spells = SPELLS.filter((spell) => bookEnabled(character.settings, spell.book)).sort((a, b) =>
    compareNames(a.name, b.name),
  );
  // Picking a rulebook spell fills in its values; the player's own notes are kept.
  const pick = (value: string, row: Record<string, unknown>) => {
    const spell = spells.find((entry) => entry.name === value);
    if (!spell) return row;
    return {
      ...row,
      name: spell.name,
      offensive: spell.offensive ? 'yes' : '',
      mp: spell.mp,
      targets: spell.targets,
      duration: spell.duration,
      page: bookRef(spell.book, spell.page),
    };
  };

  const columns: RepeatTableColumn[] = [
    {
      key: 'name',
      label: 'Spell',
      width: 'minmax(160px, 2fr)',
      suggestions: [...new Set(spells.map((spell) => spell.name))],
      onPick: pick,
    },
    {
      key: 'offensive',
      label: 'Offensive',
      width: '96px',
      type: 'select',
      options: [
        { value: '', label: '—' },
        { value: 'yes', label: 'Offensive' },
      ],
    },
    { key: 'mp', label: 'MP', width: '80px' },
    { key: 'targets', label: 'Targets', width: 'minmax(170px, 2fr)' },
    { key: 'duration', label: 'Duration', width: 'minmax(124px, 1fr)', suggestions: ['Instantaneous', 'Scene'] },
    { key: 'page', label: 'Page', width: '84px' },
    { key: 'notes', label: 'Effect & notes', rows: 2, wide: true },
  ];

  return (
    <Panel title="Spells">
      <p className="fu-note">
        Spells you have learned. Start typing a name to pick a spell from the rulebooks and fill in its values.
        Offensive spells need a Magic Check (p. 116). Classes like Chimerist learn spells from other sources: type those
        in.
      </p>
      <RepeatTable path="spells" columns={columns} createRow={createSpell} itemName="spell" />
    </Panel>
  );
}
