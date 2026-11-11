import type { IkCharacter } from '../../../../../types';
import { resolveCareer } from '../../../../../utils/careerOptions';

/**
 * Columns the careers line uses before the company: each career, each career's version field and the
 * add button, as CareerFields lays them out, or the free-text careers field (two columns).
 */
const careerLineColumns = (character: IkCharacter) => {
  if (!character.settings.careerRules) return 2;
  const { careerList } = character.identity;
  // A career listed twice has one version field.
  const versions = new Set(careerList.filter((name) => resolveCareer(character, name ?? '')?.variants)).size;
  return Math.max(2, careerList.length) + versions + 1;
};

/** Past four columns there's no room left on the careers line, even with six, so the company starts a line of its own. */
export const companyOnOwnLine = (character: IkCharacter) => careerLineColumns(character) > 4;
