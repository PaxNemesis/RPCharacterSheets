import { findCompany } from '../constants/companies';
import type { CompanyData, CompanyGrant, IkCharacter, SkillGrant } from '../types';
import { careersOf } from './rules';

const isGifted = (character: IkCharacter) => character.identity.archetype.trim().toLowerCase() === 'gifted';

/** The character's adventuring company, if one from the books is chosen. */
export const companyOf = (character: IkCharacter): CompanyData | undefined =>
  findCompany(character.identity.company ?? '');

/** The company's "one of the following" options, in the order they're offered. */
export const choiceOptions = (company: CompanyData) => [
  ...(company.choice?.abilities ?? []),
  ...(company.choice?.extraLevels ?? []).map((skill) => `${skill} +1`),
  ...(company.choice?.assets ?? []),
];

/** Whether the split's condition holds: the Gifted archetype, or a career by name. */
const meetsSplit = (character: IkCharacter, when: string) =>
  when === 'Gifted' ? isGifted(character) : careersOf(character).some((career) => career.name === when);

/** The pick for the company's choice, turned into a grant. */
function chosenGrant(character: IkCharacter, company: CompanyData): CompanyGrant {
  const pick = character.identity.companyChoice ?? '';
  const { abilities = [], extraLevels = [], assets = [] } = company.choice ?? {};
  if (abilities.includes(pick)) return { abilities: [pick] };
  const skill = extraLevels.find((name) => `${name} +1` === pick);
  if (skill) return { extraLevels: [skill] };
  if (assets.includes(pick)) return { assets: [pick] };
  return {};
}

/** Every grant that applies to this character: membership, the Gifted or career split, leadership and the pick. */
export function companyGrants(character: IkCharacter): CompanyGrant[] {
  const company = companyOf(character);
  if (!company) return [];
  const { split, leader } = company;
  return [
    company.member ?? {},
    split ? (meetsSplit(character, split.when) ? split.yes : split.no) : {},
    leader && character.identity.companyLeader ? leader : {},
    chosenGrant(character, company),
  ];
}

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** Everything the company gives this character, as flat lists. */
export function companyPackage(character: IkCharacter) {
  const grants = companyGrants(character);
  const names = (key: 'abilities' | 'connections' | 'extraLevels' | 'assets') =>
    grants.flatMap((grant) => grant[key] ?? []);
  return {
    abilities: names('abilities'),
    connections: names('connections'),
    skills: grants.flatMap((grant) => grant.skills ?? []),
    extraLevels: names('extraLevels'),
    assets: names('assets'),
    notes: grants.flatMap((grant) => (grant.note ? [grant.note] : [])),
  };
}

/**
 * The starting skills with the company's added: a skill at a set level is kept if the careers give more, and
 * "one additional occupational skill level" goes on top of what the careers give.
 */
export function withCompanySkills(skills: SkillGrant[], company: ReturnType<typeof companyPackage>): SkillGrant[] {
  const result = skills.map((skill) => ({ ...skill }));
  for (const grant of company.skills) {
    const existing = result.find((skill) => same(skill.name, grant.name));
    if (existing) existing.level = Math.max(existing.level, grant.level);
    else result.push({ ...grant });
  }
  for (const name of company.extraLevels) {
    const existing = result.find((skill) => same(skill.name, name));
    if (existing) existing.level += 1;
    else result.push({ name, level: 1 });
  }
  return result;
}

/**
 * Membership problems the sheet can check: the careers, unless turned off in Settings. Race, faith and
 * nation are left to the player, and the open benefit choice is shown in the Starting package.
 */
export function companyIssues(character: IkCharacter): string[] {
  const company = companyOf(character);
  if (!company) return [];
  const careers = careersOf(character);
  const issues: string[] = [];
  if (
    character.settings.companyCareers !== false &&
    company.careers &&
    careers.length > 0 &&
    !careers.some((career) => company.careers?.includes(career.name))
  ) {
    issues.push(`None of this character’s careers can join ${company.name}.`);
  }
  return issues;
}
