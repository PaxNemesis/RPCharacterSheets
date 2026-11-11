import { CheckboxField } from '@/components/CheckboxField';
import { bookRef } from '../../../../../constants/books';
import type { CompanyData, IkCharacter } from '../../../../../types';
import { choiceOptions, companyPackage } from '../../../../../utils/company';

type CompanyPackageProps = {
  company: CompanyData;
  character: IkCharacter;
  /** Company abilities the careers already give; the player picks another career ability instead. */
  repeated: string[];
  onChoose: (pick: string) => void;
};

const list = (values: string[]) => (values.length > 0 ? values.join(', ') : '—');

/** What the adventuring company gives this character, with the pick for its "one of the following" benefit. */
export function CompanyPackage({ company, character, repeated, onChoose }: CompanyPackageProps) {
  const { abilities, connections, skills, extraLevels, assets, notes } = companyPackage(character);
  const pick = character.identity.companyChoice ?? '';
  const options = choiceOptions(company);
  const { leader } = company;
  const leaderGets = leader
    ? [...(leader.abilities ?? []), ...(leader.note ? [leader.note.replace(/\.$/, '')] : [])].join('; ')
    : '';

  return (
    <div className="starting-package-career">
      <h3>
        {company.name} ({bookRef(company.book, company.page)})
      </h3>
      {/* Ticking it adds the leader's benefits to the lists below. */}
      {leader && (
        <CheckboxField
          path="identity.companyLeader"
          label={`${leader.title}: this character leads the company`}
          description={`Also gets ${leaderGets}.`}
        />
      )}
      <dl>
        {options.length > 0 && (
          <>
            <dt>Choose one</dt>
            <dd>
              <select
                aria-label={`${company.name}: choose a benefit`}
                value={options.includes(pick) ? pick : ''}
                onChange={(event) => onChoose(event.target.value)}
              >
                <option value="">Choose…</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </dd>
          </>
        )}
        <dt>Skills</dt>
        <dd>
          {list([...skills.map((skill) => `${skill.name} ${skill.level}`), ...extraLevels.map((name) => `${name} +1`)])}
        </dd>
        <dt>Abilities</dt>
        <dd>{list(abilities)}</dd>
        <dt>Connections</dt>
        <dd>{list(connections)}</dd>
        <dt>Assets</dt>
        <dd>{list(assets)}</dd>
      </dl>
      {company.split && (
        <p className="ik-note">
          {company.split.when} characters get different benefits from the others; these are this character’s.
        </p>
      )}
      {notes.length > 0 && <p className="ik-note">Not added to the sheet: {notes.join(' ')}</p>}
      {repeated.length > 0 && (
        <p className="ik-warning">
          Your careers already give {list(repeated)}; choose another ability from your careers instead (p. 151).
        </p>
      )}
    </div>
  );
}
