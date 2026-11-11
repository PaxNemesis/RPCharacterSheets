import { STAT_KEYS, ASPECTS } from '../constants/stats';
import type { IkCharacter, IkDerived, StatKey } from '../types';
import { racialDefense, skillMaximum, statMaximum } from './rules';
import { sum } from '@/utils/sum';

// Load Bearing reduces the armor's SPD and DEF penalties by 1 each, without turning them into bonuses (p. 164).
const lessPenalty = (total: number | null, loadBearing: boolean) =>
  loadBearing && total !== null && total < 0 ? total + 1 : total;

/** Works out the derived stats and life spiral from the core rules (pp. 105–107, 215). */
export function calculate(character: IkCharacter): IkDerived {
  // The stat as typed; `stat` below has the crippled Physique's STR penalty applied.
  const rawStat = (key: StatKey) => character.stats[key]?.value ?? null;
  const statMax = (key: StatKey) => statMaximum(character, key);
  const loadBearing = character.abilities.some((ability) => ability.name?.trim().toLowerCase() === 'load bearing');
  const armorSpeed = lessPenalty(sum(...character.armor.map((piece) => piece.spd)), loadBearing);
  const armorDefense = lessPenalty(sum(...character.armor.map((piece) => piece.def)), loadBearing);
  const armorArmor = sum(...character.armor.map((piece) => piece.arm));
  const commandSkill = character.skills.find((skill) => /^command\b/i.test(skill.name.trim()))?.level ?? null;
  const raceDefense = racialDefense(character);
  const { modifiers } = character;

  // Each aspect has vitality equal to its primary stat, split as evenly as possible over its two branches.
  const branchSizes = ASPECTS.flatMap(({ primary }) => {
    const value = Math.max(0, rawStat(primary) ?? 0);
    return [Math.ceil(value / 2), Math.floor(value / 2)];
  });
  const crippled = ASPECTS.filter((_, index) => {
    const size = branchSizes[index * 2] + branchSizes[index * 2 + 1];
    const marked = [0, 1].reduce(
      (total, offset) =>
        total + Math.min(character.damage.marked[index * 2 + offset] ?? 0, branchSizes[index * 2 + offset]),
      0,
    );
    return size > 0 && marked >= size;
  }).map((aspect) => aspect.key);

  // A crippled aspect's penalty (p. 215): Physique –2 STR, Agility –2 on attack rolls, Intellect –2 DEF.
  const penalty = (aspect: (typeof crippled)[number]) => (crippled.includes(aspect) ? -2 : null);
  const strengthPenalty = penalty('physique');
  const attackPenalty = penalty('agility');
  const defensePenalty = penalty('intellect');
  const stat = (key: StatKey) =>
    key === 'str' && strengthPenalty !== null && rawStat(key) !== null
      ? sum(rawStat(key), strengthPenalty)
      : rawStat(key);

  return {
    stat,
    statMax,
    overMax: STAT_KEYS.filter((key) => {
      const value = rawStat(key);
      const max = statMax(key);
      return value !== null && max !== null && value > max;
    }),
    racialDefense: raceDefense,
    skillMax: (name) => skillMaximum(character, name),
    spellLimit: stat('int') === null ? null : (stat('int') ?? 0) * 2,
    willpower: sum(stat('phy'), stat('int'), modifiers.willpower),
    loadBearing,
    armorSpeed,
    // Armor and other modifiers change SPD only; DEF and initiative keep using the unmodified stat (p. 106).
    speed: stat('spd') === null ? null : sum(stat('spd'), armorSpeed, modifiers.speed),
    armorDefense,
    armorArmor,
    defense: sum(stat('spd'), stat('agl'), stat('per'), raceDefense, armorDefense, defensePenalty, modifiers.defense),
    armor: sum(stat('phy'), armorArmor, modifiers.armor),
    initiative: sum(stat('spd'), stat('prw'), stat('per'), modifiers.initiative),
    commandSkill,
    commandRange: sum(stat('int'), commandSkill, modifiers.commandRange),
    branchSizes,
    vitality: branchSizes.reduce((total, size) => total + size, 0),
    crippled,
    strengthPenalty,
    attackPenalty,
    defensePenalty,
  };
}
