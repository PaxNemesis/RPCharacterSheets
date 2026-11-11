import { SelectField } from '@/components/SelectField';
import { bookEnabled, bookRef } from '../../../../../constants/books';
import { COMPANIES } from '../../../../../constants/companies';
import { useIkCharacter } from '../../../../../hooks/useIkCharacter';
import { companyOf } from '../../../../../utils/company';
import { compareNames } from '@/utils/alphabetical';

/** The adventuring company (pp. 151–153), at the end of the careers line when there's room. Its notes are in CompanyNotes. */
type CompanyFieldsProps = {
  /** No room on the careers line, so it starts a line of its own. */
  ownLine: boolean;
};

export function CompanyFields({ ownLine }: CompanyFieldsProps) {
  const { character } = useIkCharacter();
  const current = character.identity.company ?? '';
  const company = companyOf(character);
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
