import { CAREER_SPELL_LISTS, OPTION_SPELL_LISTS } from '../../../constants/spellLists';
import { spellNames } from '../../../constants/spells';
import type { CareerData, IkCharacter } from '../../../types';
import { chosenOptions } from '../../../utils/careerOptions';
import { careersOf, variantOf } from '../../../utils/rules';

/**
 * The career's own list: by faith or element where the career has versions, or all of its versions'
 * lists until one is chosen. Undefined for a career without spells.
 */
function ownList(character: IkCharacter, career: CareerData): string[] | undefined {
  if (!career.variants) return CAREER_SPELL_LISTS[career.name];
  const variant = variantOf(character, career);
  const labels = variant ? [variant.label] : career.variants.map((entry) => entry.label);
  const lists = labels.flatMap((label) => CAREER_SPELL_LISTS[`${career.name}: ${label}`] ?? []);
  return lists.length > 0 ? lists : undefined;
}

/**
 * Spells the character's careers can learn (pp. 234–236), with chosen kingdom options replacing or
 * adding to their career's list. Undefined when no career has a spell list, so every spell is offered.
 */
export function careerSpells(character: IkCharacter): string[] | undefined {
  const options = chosenOptions(character);
  const lists = careersOf(character).map((career) => {
    const changes = options
      .filter((option) => option.careers[0] === career.name)
      .map((option) => OPTION_SPELL_LISTS[option.name])
      .filter((change) => change !== undefined);
    const base = changes.find((change) => change.list)?.list ?? ownList(character, career);
    const extra = changes.flatMap((change) => change.extra ?? []);
    return base || extra.length > 0 ? [...(base ?? []), ...extra] : undefined;
  });
  const known = lists.filter((list) => list !== undefined);
  return known.length > 0 ? [...new Set(known.flat())] : undefined;
}

/**
 * Spell names to suggest: the careers' lists, or every spell, limited to the books the character uses and
 * leaving out spells already known, since a spell can't be learned twice.
 */
export function spellSuggestions(character: IkCharacter): string[] {
  const known = new Set(character.spells.map((spell) => (spell.name ?? '').trim().toLowerCase()));
  const allowed = careerSpells(character);
  return spellNames(character.settings).filter(
    (name) => (!allowed || allowed.includes(name)) && !known.has(name.toLowerCase()),
  );
}
