import type { ArchetypeData } from '../types';

const onPage = (page: number, names: string[]) => names.map((name) => ({ name, page }));

// Core rules pp. 115–117. The supplements grant some of these benefits but add none.
export const ARCHETYPE_DATA: ArchetypeData[] = [
  {
    name: 'Gifted',
    page: 115,
    summary:
      'Can work magic and take arcane careers. Has an arcane tradition (p. 228): focuser with the Warcaster career, otherwise will weaver. Only Gifted characters have ARC, starting at 2 for a focuser and 3 for a will weaver.',
    benefits: onPage(115, [
      'Additional Study',
      'Combat Caster',
      'Fast Caster',
      'Feat: Dominator',
      'Feat: Powerful Caster',
      'Feat: Quick Cast',
      'Feat: Strength of Will',
      'Magic Sensitivity',
      'Rune Reader',
      'Warding Circle',
    ]),
  },
  {
    name: 'Intellectual',
    page: 115,
    summary:
      '+1 on attack and damage rolls. Friendly characters in its command range who follow its orders get the same +1; it does not stack between Intellectuals.',
    benefits: [
      ...onPage(115, ['Battlefield Coordination', 'Feat: Flawless Timing']),
      ...onPage(116, [
        'Feat: Perfect Plot',
        'Feat: Plan of Action',
        'Feat: Prescient',
        'Feat: Quick Thinking',
        'Feat: Unconventional Warfare',
        'Genius',
        'Hyper Perception',
        'Photographic Memory',
      ]),
    ],
  },
  {
    name: 'Mighty',
    page: 116,
    summary: 'An additional die on melee damage rolls.',
    benefits: onPage(116, [
      'Beat Back',
      'Feat: Back Swing',
      'Feat: Bounding Leap',
      'Feat: Counter Charge',
      'Feat: Invulnerable',
      'Feat: Revitalize',
      'Feat: Shield Breaker',
      'Feat: Vendetta',
      'Righteous Anger',
      'Tough',
    ]),
  },
  {
    name: 'Skilled',
    page: 116,
    summary: 'One additional attack during an Activation Phase in which it chooses to attack.',
    benefits: onPage(117, [
      'Ambidextrous',
      'Cagey',
      'Deft',
      'Feat: Defensive Strike',
      'Feat: Disarm',
      'Feat: Swashbuckler',
      'Feat: Untouchable',
      'Preternatural Awareness',
      'Sidestep',
      'Virtuoso',
    ]),
  },
];

export const findArchetype = (name: string) =>
  ARCHETYPE_DATA.find((archetype) => archetype.name.toLowerCase() === name.trim().toLowerCase());

/** Page of an archetype benefit, e.g. "116"; "Virtuoso (Rifle)" finds Virtuoso. */
export const archetypeBenefitRef = (name: string) => {
  const base = name
    .replace(/\s*\(.*\)\s*$/, '')
    .trim()
    .toLowerCase();
  const page = ARCHETYPE_DATA.flatMap((archetype) => archetype.benefits).find(
    (benefit) => benefit.name.toLowerCase() === base,
  )?.page;
  return page === undefined ? '' : String(page);
};

/** XP totals that give an archetype benefit, and those that give a benefit or a new career instead (p. 154). */
export const BENEFIT_XP = [12, 50, 140];
export const BENEFIT_OR_CAREER_XP = [30, 80, 110];
