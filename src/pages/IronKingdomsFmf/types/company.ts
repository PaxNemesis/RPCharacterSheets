import type { BookId, SkillGrant } from './rules';

/** What joining an adventuring company gives a character created as a member. */
export type CompanyGrant = {
  abilities?: string[];
  connections?: string[];
  /** Skills at a starting level, kept if the careers already give a higher one. */
  skills?: SkillGrant[];
  /** "One additional occupational skill level": +1 to the skill, or level 1 if the character lacks it. */
  extraLevels?: string[];
  assets?: string[];
  /** Benefits the sheet can't add by itself, in short. */
  note?: string;
};

/** An adventuring company (core rules pp. 151–153 and the supplements). */
export type CompanyData = {
  name: string;
  book: BookId;
  page: number;
  /** Careers a member needs at least one of; missing when any character can join. */
  careers?: string[];
  /** Other membership requirements, in short, such as race, faith or the career option needed. */
  requires?: string;
  /** What the group gets as a whole, in short. */
  benefits: string;
  member?: CompanyGrant;
  /** What the leader gets on top, and what the company calls them, such as "Captain". */
  leader?: CompanyGrant & { title: string };
  /** Different grants for Gifted characters, or for characters with a given career. */
  split?: { when: 'Gifted' | string; yes: CompanyGrant; no: CompanyGrant };
  /** One pick from these: an ability, an extra skill level or an asset. */
  choice?: { abilities?: string[]; extraLevels?: string[]; assets?: string[] };
  /** Skills every member treats as career skills. */
  careerSkills?: string[];
};
