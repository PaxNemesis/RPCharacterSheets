import { STAT_KEYS, ASPECTS } from '../constants/stats'
import type { IkCharacter, IkDerived, StatKey } from '../types'
import { racialDefense, skillMaximum, statMaximum } from './rules'
import { sum } from './sum'

/** Works out the derived stats and life spiral from the core rules (pp. 105–107, 215). */
export function calculate(character: IkCharacter): IkDerived {
  const stat = (key: StatKey) => character.stats[key]?.value ?? null
  const statMax = (key: StatKey) => statMaximum(character, key)
  const armorDefense = sum(...character.armor.map((piece) => piece.def))
  const armorArmor = sum(...character.armor.map((piece) => piece.arm))
  const commandSkill = character.skills.find((skill) => /^command\b/i.test(skill.name.trim()))?.level ?? null
  const raceDefense = racialDefense(character)
  const { modifiers } = character

  // Each aspect has vitality equal to its primary stat, split as evenly as possible over its two branches.
  const branchSizes = ASPECTS.flatMap(({ primary }) => {
    const value = Math.max(0, stat(primary) ?? 0)
    return [Math.ceil(value / 2), Math.floor(value / 2)]
  })
  const crippled = ASPECTS.filter((_, index) => {
    const size = branchSizes[index * 2] + branchSizes[index * 2 + 1]
    const marked = [0, 1].reduce(
      (total, offset) => total + Math.min(character.damage.marked[index * 2 + offset] ?? 0, branchSizes[index * 2 + offset]),
      0,
    )
    return size > 0 && marked >= size
  }).map((aspect) => aspect.key)

  return {
    stat,
    statMax,
    overMax: STAT_KEYS.filter((key) => {
      const value = stat(key)
      const max = statMax(key)
      return value !== null && max !== null && value > max
    }),
    racialDefense: raceDefense,
    skillMax: (name) => skillMaximum(character, name),
    spellLimit: stat('int') === null ? null : (stat('int') ?? 0) * 2,
    willpower: sum(stat('phy'), stat('int')),
    armorDefense,
    armorArmor,
    defense: sum(stat('spd'), stat('agl'), stat('per'), raceDefense, armorDefense, modifiers.defense),
    armor: sum(stat('phy'), armorArmor, modifiers.armor),
    initiative: sum(stat('spd'), stat('prw'), stat('per'), modifiers.initiative),
    commandSkill,
    commandRange: sum(stat('int'), commandSkill, modifiers.commandRange),
    branchSizes,
    vitality: branchSizes.reduce((total, size) => total + size, 0),
    crippled,
  }
}
