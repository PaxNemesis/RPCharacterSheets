import { useIkCharacter } from '../../../../../hooks/useIkCharacter';
import { alphabetical } from '@/utils/alphabetical';
import { resolveCareer } from '../../../../../utils/careerOptions';

/** What the chosen careers require, under the careers line; nothing when career rules are off. */
export function CareerNotes() {
  const { character } = useIkCharacter();
  if (!character.settings.careerRules) return null;

  const careers = character.identity.careerList.map((name) => resolveCareer(character, name ?? ''));
  const [first, second] = careers;
  const notes = careers.flatMap((career, index) => {
    if (!career) return [];
    const other = index === 0 ? second : index === 1 ? first : undefined;
    return [
      career.prerequisites !== 'None' && `${career.name} requires: ${career.prerequisites}.`,
      career.startingOnly && index >= 2 && `${career.name} can only be a starting career.`,
      career.pairsWith &&
        index < 2 &&
        other &&
        !career.pairsWith.includes(other.name) &&
        `${career.name} must be paired with ${alphabetical(career.pairsWith).join(', ')}.`,
    ].filter((note): note is string => Boolean(note));
  });

  return notes.length > 0 ? <p className="ik-note ik-wide">{notes.join(' ')}</p> : null;
}
