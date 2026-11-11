import { STAT_LABELS } from '../../../constants/stats';
import type { IkCharacter, IkDerived, IkEntry, StatKey } from '../../../types';
import { sum } from '@/utils/sum';
import type { SheetWriter } from '../sheetWriter';
import { withSpares } from './weapons';

const statLabel = (stat: string) => (stat === 'social' ? 'Social' : (STAT_LABELS[stat as StatKey] ?? ''));

/** Skills, with the stat + level each rolls worked out at export. */
export function writeSkills(w: SheetWriter, { skills }: IkCharacter, derived: IkDerived) {
  w.section('Skills');
  w.table(
    [
      { label: 'Skill', weight: 4 },
      { label: 'Stat' },
      { label: 'Level' },
      { label: 'Total' },
      { label: 'Page', weight: 1.5 },
    ],
    withSpares(skills, null).map((skill, i) => {
      const stat = skill && skill.stat && skill.stat !== 'social' ? derived.stat(skill.stat) : null;
      return [
        { label: 'Skill', name: `skills.${i}.name`, value: skill?.name },
        { label: 'Stat', name: `skills.${i}.stat`, value: skill && statLabel(skill.stat) },
        { label: 'Level', name: `skills.${i}.level`, value: skill?.level },
        {
          label: 'Total',
          name: `calculated.skills.${i}.total`,
          value: skill && stat !== null ? sum(stat, skill.level) : null,
        },
        { label: 'Page', name: `skills.${i}.page`, value: skill?.page },
      ];
    }),
  );
  w.end();
}

/** A list of named entries with a page and a description, such as abilities. */
export function writeEntries(w: SheetWriter, title: string, path: string, entries: IkEntry[]) {
  w.section(title);
  w.table(
    [{ label: 'Name', weight: 3 }, { label: 'Page' }, { label: 'Description', weight: 7 }],
    withSpares(entries, null).map((entry, i) => [
      { label: 'Name', name: `${path}.${i}.name`, value: entry?.name },
      { label: 'Page', name: `${path}.${i}.page`, value: entry?.page },
      { label: 'Description', name: `${path}.${i}.description`, value: entry?.description, lines: 2 },
    ]),
  );
  w.end();
}

/** Worn armor, gear, and money. */
export function writeGear(w: SheetWriter, character: IkCharacter) {
  w.section('Worn armor');
  w.table(
    [
      { label: 'Armor', weight: 3 },
      { label: 'SPD' },
      { label: 'DEF' },
      { label: 'ARM' },
      { label: 'Notes', weight: 5 },
      { label: 'Page' },
    ],
    withSpares(character.armor, null).map((piece, i) => [
      { label: 'Armor', name: `armor.${i}.name`, value: piece?.name },
      { label: 'SPD', name: `armor.${i}.spd`, value: piece?.spd },
      { label: 'DEF', name: `armor.${i}.def`, value: piece?.def },
      { label: 'ARM', name: `armor.${i}.arm`, value: piece?.arm },
      { label: 'Notes', name: `armor.${i}.notes`, value: piece?.notes },
      { label: 'Page', name: `armor.${i}.page`, value: piece?.page },
    ]),
  );
  w.end();
  w.section('Gear & wealth');
  w.table(
    [{ label: 'Item', weight: 3 }, { label: 'Qty' }, { label: 'Notes', weight: 7 }],
    withSpares(character.gear, null).map((item, i) => [
      { label: 'Item', name: `gear.${i}.name`, value: item?.name },
      { label: 'Qty', name: `gear.${i}.quantity`, value: item?.quantity },
      { label: 'Notes', name: `gear.${i}.notes`, value: item?.notes },
    ]),
  );
  w.fields([
    { label: 'Gold crowns', name: 'gold', value: character.gold },
    { label: 'Other wealth & property', name: 'wealth', value: character.wealth, weight: 4, lines: 2 },
  ]);
  w.end();
}

/** Spells, for characters with magic turned on. */
export function writeSpells(w: SheetWriter, { spells, arcaneTradition }: IkCharacter) {
  w.section('Spells');
  w.fields([{ label: 'Arcane tradition', name: 'arcaneTradition', value: arcaneTradition }]);
  w.table(
    [
      { label: 'Spell', weight: 3 },
      { label: 'Cost' },
      { label: 'RNG' },
      { label: 'AOE' },
      { label: 'POW' },
      { label: 'UP' },
      { label: 'OFF' },
      { label: 'Page' },
    ],
    withSpares(spells, null).map((spell, i) => [
      { label: 'Spell', name: `spells.${i}.name`, value: spell?.name },
      { label: 'Cost', name: `spells.${i}.cost`, value: spell?.cost },
      { label: 'RNG', name: `spells.${i}.rng`, value: spell?.rng },
      { label: 'AOE', name: `spells.${i}.aoe`, value: spell?.aoe },
      { label: 'POW', name: `spells.${i}.pow`, value: spell?.pow },
      { label: 'UP', name: `spells.${i}.up`, value: spell?.up },
      { label: 'OFF', name: `spells.${i}.off`, value: spell?.off },
      { label: 'Page', name: `spells.${i}.page`, value: spell?.page },
    ]),
  );
  w.end();
}
