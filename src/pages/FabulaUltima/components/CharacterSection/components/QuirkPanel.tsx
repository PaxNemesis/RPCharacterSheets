import { Panel } from '@/components/Panel';
import { SelectField } from '@/components/SelectField';
import { TextField } from '@/components/TextField';
import { compareNames } from '@/utils/alphabetical';
import { bookEnabled, bookRef } from '../../../constants/books';
import { QUIRKS, quirkId } from '../../../constants/quirks';
import type { FuCharacter } from '../../../types';
import { quirkOf } from '../../../utils/rules';

const SURVIVOR_CHOICES = [
  { value: '', label: 'Choose…' },
  { value: 'martial', label: 'Equip all martial items' },
  { value: 'spell', label: 'Learn an Elementalist or Spiritist spell' },
  { value: 'ip', label: '+2 max IP' },
];

type QuirkPanelProps = {
  character: FuCharacter;
};

export function QuirkPanel({ character }: QuirkPanelProps) {
  const { quirk, settings } = character;
  const data = quirkOf(character);
  // Quirks from books that are turned off stay listed while the character has one.
  const options = [
    { value: '', label: 'None' },
    ...QUIRKS.filter((entry) => bookEnabled(settings, entry.book) || quirkId(entry) === quirk.id)
      .sort((a, b) => compareNames(a.name, b.name))
      .map((entry) => ({ value: quirkId(entry), label: `${entry.name} (${bookRef(entry.book, entry.page)})` })),
    { value: 'custom', label: 'Custom Quirk…' },
  ];

  return (
    <Panel title="Quirk">
      <div className="fu-fields">
        <SelectField path="quirk.id" label="Quirk" options={options} className="fu-wide" />
        {quirk.id === 'custom' && <TextField path="quirk.name" label="Quirk name" className="fu-wide" />}
        {data?.survivor && (
          <SelectField path="quirk.choice" label="Survivor option" options={SURVIVOR_CHOICES} className="fu-wide" />
        )}
      </div>
      {data?.survivor && (
        <p className="fu-note">
          +5 max HP and MP{quirk.choice === 'ip' ? ' and +2 max IP' : ''}
          {quirk.choice === 'martial' ? ', and all martial equipment,' : ''} are added automatically.
          {quirk.choice === 'spell' ? ' Add the spell on the Spells & rituals tab.' : ''}
        </p>
      )}
      {quirk.id !== '' && <TextField path="quirk.notes" label="Details & effects" rows={4} />}
      <p className="fu-note">
        An optional rule from the Atlases: a character may only ever have one Quirk, and no two characters in a group
        should share one (HF p. 114). Put situational bonuses, such as Empty Hands, in Other on the Defense panel.
      </p>
    </Panel>
  );
}
