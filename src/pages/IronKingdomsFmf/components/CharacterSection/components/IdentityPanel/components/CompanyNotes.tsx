import { useIkCharacter } from '../../../../../hooks/useIkCharacter';
import type { CompanyData } from '../../../../../types';
import { companyIssues, companyOf } from '../../../../../utils/company';

const requirements = ({ careers, requires }: CompanyData, checkCareers: boolean) => {
  if (careers && !checkCareers) {
    return `Career requirements are off in Settings.${requires ? ` ${requires}.` : ''}`;
  }
  if (careers) return `Requires one of these careers: ${careers.join(', ')}.${requires ? ` ${requires}.` : ''}`;
  return requires ? `Open to any career. ${requires}.` : 'Open to any career.';
};

/** What the adventuring company requires and gives the group, and any membership problems. */
export function CompanyNotes() {
  const { character } = useIkCharacter();
  const company = companyOf(character);
  if (!company) return null;
  const issues = companyIssues(character);

  return (
    <>
      <p className="ik-note ik-wide">
        {requirements(company, character.settings.companyCareers !== false)} {company.benefits} The Starting package on
        the Skills tab shows what each member gets.
      </p>
      {issues.length > 0 && (
        <p className="ik-warning ik-wide" role="status">
          {issues.join(' ')}
        </p>
      )}
    </>
  );
}
