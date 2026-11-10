import type { CareerOption } from '../../../../../types';
import { alphabetical } from '@/utils/alphabetical';

/** A one-line summary of what an option changes, e.g. "Adds Set Defense. Removes Blaster." */
export function describeOption(option: CareerOption) {
  const { add = {}, remove = {} } = option;
  const added = [
    ...(add.abilities ?? []),
    ...(add.connections ?? []),
    ...(add.skills ?? []).map((skill) => `${skill.name} ${skill.level}`),
    ...(add.assets ?? []),
  ];
  // A skill removed and added back, such as the Crucible Guard's Rifle, only shows as added.
  const readded = (skill: string) => add.skills?.some((grant) => grant.name === skill);
  const removed = [
    ...(remove.abilities ?? []),
    ...(remove.skills ?? []).filter((skill) => !readded(skill)),
    ...(remove.assets ?? []),
    ...(remove.archetypeBenefits ?? []).map((benefit) => `the ${benefit} archetype benefit`),
  ];
  const learnable = [
    ...(add.abilityList ?? []).filter((ability) => !add.abilities?.includes(ability)),
    ...Object.entries(add.maxima ?? {}).map(([skill, max]) => `${skill} ${max}`),
  ];
  return [
    added.length > 0 && `Adds ${added.join(', ')}.`,
    removed.length > 0 && `Removes ${removed.join(', ')}.`,
    option.spells && `Starting spells: ${option.spells.join(', ')}.`,
    option.gold !== undefined && `Starting gold: ${option.gold} gc.`,
    learnable.length > 0 && `Can learn ${learnable.join(', ')}.`,
    option.pairsWith && `Other starting career: ${alphabetical(option.pairsWith).join(', ')}.`,
    option.note,
  ]
    .filter(Boolean)
    .join(' ');
}
