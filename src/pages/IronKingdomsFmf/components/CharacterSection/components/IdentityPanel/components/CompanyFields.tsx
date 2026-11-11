import { SelectField } from '@/components/SelectField';
import { bookEnabled, bookRef } from '../../../../../constants/books';
import { COMPANIES } from '../../../../../constants/companies';
import { useIkCharacter } from '../../../../../hooks/useIkCharacter';
import { resolveCareer } from '../../../../../utils/careerOptions';
import { companyOf } from '../../../../../utils/company';
import type { IkCharacter } from '../../../../../types';
import { compareNames } from '@/utils/alphabetical';

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

/** The adventuring company (pp. 151–153), at the end of the careers line when there's room. Its notes are in CompanyNotes. */
export function CompanyFields() {
  const { character } = useIkCharacter();
  const current = character.identity.company ?? '';
  const company = companyOf(character);
  // Past four columns there's no room left on the careers line, even with six, so it starts a line of its own.
  const ownLine = careerLineColumns(character) > 4;
  // Companies from books that are turned off stay listed while a character has one, and so does a
  // name that matches no book, so it isn't silently dropped.
  const options = [
    { value: '', label: 'None' },
    ...COMPANIES.filter((entry) => bookEnabled(character.settings, entry.book) || entry.name === current)
      .sort((a, b) => compareNames(a.name, b.name))
      .map((entry) => ({ value: entry.name, label: `${entry.name} (${bookRef(entry.book, entry.page)})` })),
    ...(current && !company ? [{ value: current, label: current }] : []),
  ];

  return (
    <SelectField
      path="identity.company"
      label="Adventuring company"
      options={options}
      className={`identity-panel-wide identity-panel-company${ownLine ? ' identity-panel-own-line' : ''}`}
    />
  );
}
