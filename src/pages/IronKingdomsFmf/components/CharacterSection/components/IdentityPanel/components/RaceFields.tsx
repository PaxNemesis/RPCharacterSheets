import { SelectField } from '@/components/SelectField';
import { useSheet } from '@/components/SheetProvider';
import { TextField } from '@/components/TextField';
import { NATIONALITIES } from '../../../../../constants/nationalities';
import { ARCHETYPES, findRace, RACES, TRADITIONS } from '../../../../../constants/races';
import { useIkCharacter } from '../../../../../hooks/useIkCharacter';
import type { IkCharacter } from '../../../../../types';
import { alphabetical } from '@/utils/alphabetical';

const options = (values: string[], empty = 'Choose…') => [
  { value: '', label: empty },
  ...values.map((value) => ({ value, label: value })),
];

const HUMAN_BONUS = [
  { value: '', label: 'Choose…' },
  { value: 'phy', label: '+1 PHY' },
  { value: 'agl', label: '+1 AGL' },
  { value: 'int', label: '+1 INT' },
];

/** Focusers are warcasters (p. 115); every other Gifted character is a Will Weaver. */
const defaultTradition = (character: IkCharacter) =>
  character.identity.careerList.includes('Warcaster') ? 'Focuser' : 'Will Weaver';

/**
 * Nationality, then race and archetype, each followed by the choice it brings (a human's Exceptional
 * Potential, a Gifted character's arcane tradition), starting a line; free text when race rules are off.
 */
export function RaceFields() {
  const { character } = useIkCharacter();
  const { identity } = character;
  const { set } = useSheet();

  const nationality = (
    <TextField
      path="identity.nationality"
      label="Nationality"
      suggestions={NATIONALITIES}
      className="identity-panel-row"
    />
  );

  if (!character.settings.raceRules) {
    return (
      <>
        {nationality}
        <TextField path="identity.race" label="Race" />
        <TextField path="identity.archetype" label="Archetype" />
      </>
    );
  }

  const race = findRace(identity.race);
  const archetypes = race?.archetypes ?? ARCHETYPES;
  // Keep a value that doesn't match the book visible instead of silently dropping it.
  const withCurrent = (values: string[], current: string) =>
    current && !values.includes(current) ? [...values, current] : values;

  return (
    <>
      {nationality}
      <SelectField
        path="identity.race"
        label="Race"
        options={options(withCurrent(alphabetical(RACES.map((r) => r.name)), identity.race))}
      />
      {race?.name === 'Human' && (
        <SelectField path="identity.humanBonus" label="Exceptional Potential" options={HUMAN_BONUS} />
      )}
      <SelectField
        path="identity.archetype"
        label="Archetype"
        options={options(withCurrent(archetypes, identity.archetype))}
        onChange={(archetype) => {
          // Every Gifted career but the warcaster's uses Will Weaver (p. 115), so start from that.
          if (archetype === 'Gifted' && !character.arcaneTradition) set('arcaneTradition', defaultTradition(character));
        }}
      />
      {identity.archetype === 'Gifted' && (
        <SelectField
          path="arcaneTradition"
          label="Arcane tradition"
          options={options(
            withCurrent(
              TRADITIONS.map((t) => t.value),
              character.arcaneTradition,
            ),
          )}
        />
      )}
      {race && <p className="ik-note ik-wide">{race.notes.join(' ')}</p>}
    </>
  );
}
