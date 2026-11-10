import type { IkCharacter, IkDerived } from '../../../types';
import type { SheetWriter } from '../sheetWriter';
import { writeFormula } from './formula';

/** DEF, ARM, initiative, movement and command range as formulas, and feat points (pp. 106–107, 220). */
export function writeCombat(w: SheetWriter, { modifiers, featPoints }: IkCharacter, derived: IkDerived) {
  const { stat } = derived;
  w.section('Combat', 70);
  writeFormula(
    w,
    'DEF',
    [
      { label: 'SPD', name: 'calculated.parts.defense.spd', value: stat('spd') },
      { label: 'AGL', name: 'calculated.parts.defense.agl', value: stat('agl') },
      { label: 'PER', name: 'calculated.parts.defense.per', value: stat('per') },
      { label: 'Race', name: 'calculated.parts.defense.race', value: derived.racialDefense },
      { label: 'Armor', name: 'calculated.parts.defense.armor', value: derived.armorDefense },
      { label: 'Other', name: 'modifiers.defense', value: modifiers.defense },
    ],
    { label: 'DEF', name: 'calculated.defense', value: derived.defense },
  );
  writeFormula(
    w,
    'ARM',
    [
      { label: 'PHY', name: 'calculated.parts.armor.phy', value: stat('phy') },
      { label: 'Armor', name: 'calculated.parts.armor.armor', value: derived.armorArmor },
      { label: 'Other', name: 'modifiers.armor', value: modifiers.armor },
    ],
    { label: 'ARM', name: 'calculated.armor', value: derived.armor },
  );
  writeFormula(
    w,
    'Initiative',
    [
      { label: 'SPD', name: 'calculated.parts.initiative.spd', value: stat('spd') },
      { label: 'PRW', name: 'calculated.parts.initiative.prw', value: stat('prw') },
      { label: 'PER', name: 'calculated.parts.initiative.per', value: stat('per') },
      { label: 'Other', name: 'modifiers.initiative', value: modifiers.initiative },
    ],
    { label: 'Total', name: 'calculated.initiative', value: derived.initiative },
  );
  writeFormula(
    w,
    'Movement',
    [
      { label: 'SPD', name: 'calculated.parts.speed.spd', value: stat('spd') },
      { label: 'Armor', name: 'calculated.parts.speed.armor', value: derived.armorSpeed },
      { label: 'Other', name: 'modifiers.speed', value: modifiers.speed },
    ],
    { label: 'SPD', name: 'calculated.speed', value: derived.speed },
  );
  writeFormula(
    w,
    'Command',
    [
      { label: 'INT', name: 'calculated.parts.commandRange.int', value: stat('int') },
      { label: 'Skill', name: 'calculated.parts.commandRange.skill', value: derived.commandSkill },
      { label: 'Other', name: 'modifiers.commandRange', value: modifiers.commandRange },
    ],
    { label: 'Range', name: 'calculated.commandRange', value: derived.commandRange },
  );
  w.fields([{ label: 'Current feat points', name: 'featPoints', value: featPoints }]);
  w.end();
}
