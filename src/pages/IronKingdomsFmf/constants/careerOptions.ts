// One data table of the kingdom career options in Kings, Nations, and Gods, kept in book order so each entry can be checked against the book.
import type { CareerAddition, CareerOption } from '../types'
import { grant } from '../utils/careerText'

export const CAREER_ADDITIONS: CareerAddition[] = [
  { book: 'kng', careers: ['Iron Fang'], pairsWith: ['Horseman'] },
  { book: 'kng', careers: ['Cutthroat', 'Ranger', 'Spy'], abilityList: ['Strangler'] },
  { book: 'kng', careers: ['Trencher'], pairsWith: ['Artillerist'] },
]

const WARCASTER_REQUIRES = 'human; character creation only'
const STORM_GLAIVE = 'Storm glaive'

export const CAREER_OPTIONS: CareerOption[] = [
  {
    name: 'Cygnaran Warcaster', book: 'kng', page: 87, careers: ['Warcaster'], requires: `Cygnaran ${WARCASTER_REQUIRES}`,
    pairsWith: ['Arcane Mechanik', 'Arcanist', 'Aristocrat', 'Field Mechanik', 'Gun Mage', 'Horseman', 'Knight', 'Man-at-Arms', 'Military Officer', 'Pistoleer', 'Ranger', 'Rifleman', 'Soldier', 'Sorcerer', 'Stormblade', 'Trencher'],
    add: { connections: ['Connections (Cygnaran military)'] }, spells: ['Arcane Bolt', 'Blur'], note: 'Uses its own spell list.',
  },
  {
    name: 'Arcane Tempest Gun Mage', book: 'kng', page: 87, careers: ['Gun Mage'], requires: 'Cygnaran human',
    pairsWith: ['Aristocrat', 'Horseman', 'Military Officer', 'Pistoleer', 'Ranger', 'Rifleman', 'Soldier', 'Spy', 'Warcaster'],
    add: { connections: ['Connections (Cygnaran military)'], assets: ['Armored great coat'], abilityList: ['Runesmith'] },
    note: 'Can learn Rune Shot: Disruption (KNG p. 91).',
  },
  {
    name: 'Illuminated Arcanist', book: 'kng', page: 88, careers: ['Arcanist'], requires: 'Morrowan human',
    add: { connections: ['Connections (Order of Illumination)'] }, spells: ['Eyes of Truth', 'Guided Blade', 'Occultation'], note: 'Uses its own spell list.',
  },
  {
    name: 'Stormguard', book: 'kng', page: 88, careers: ['Stormblade', 'Man-at-Arms'], requires: 'Starting careers Man-at-Arms and Stormblade',
    add: { abilities: ['Set Defense', 'Specialization (Voltaic Halberd)'], assets: ['Voltaic halberd'] },
    remove: { abilities: ['Blaster', 'Defensive Line', 'Specialization'], assets: [STORM_GLAIVE] },
  },
  {
    name: 'Storm Lance', book: 'kng', page: 88, careers: ['Stormblade', 'Knight'], requires: 'Starting careers Knight and Stormblade',
    add: { abilities: ['Cavalry Charge'], skills: [grant('Riding 1')], assets: ['Electro lance', 'Shield', 'Warhorse with tack and Storm Knight barding'] },
    remove: { abilities: ['Cleave', 'Defender'], assets: [STORM_GLAIVE] },
  },
  {
    name: 'Trencher Commando', book: 'kng', page: 88, careers: ['Trencher', 'Ranger'], requires: 'Starting careers Ranger and Trencher',
    add: { abilities: ['Anatomical Precision', 'Prowl'], assets: ['Carbine', 'Trench knife', 'Three explosive grenades'] },
    remove: { abilities: ['Bayonet Charge', 'Dig In'], assets: ['Bayonet', 'Entrenching spade', 'Military rifle'] },
  },
  {
    name: 'Greylord', book: 'kng', page: 175, careers: ['Arcanist'], requires: 'Khadoran human',
    pairsWith: ['Alchemist', 'Arcane Mechanik', 'Aristocrat', 'Explorer', 'Horseman', 'Investigator', 'Military Officer', 'Sorcerer', 'Spy', 'Warcaster'],
    add: { connections: ['Connections (Greylords Covenant)'] }, spells: ['Blizzard', 'Frostbite', 'Protection from Cold'], note: 'Uses its own spell list.',
  },
  {
    name: 'Khadoran Warcaster', book: 'kng', page: 176, careers: ['Warcaster'], requires: `Khadoran ${WARCASTER_REQUIRES}`,
    pairsWith: ['Arcane Mechanik', 'Arcanist', 'Aristocrat', 'Assault Kommando', 'Horseman', 'Investigator', 'Iron Fang', 'Military Officer', 'Pistoleer', 'Ranger', 'Rifleman', 'Soldier', 'Sorcerer', 'Spy'],
    add: { connections: ['Connections (Khadoran military)'] }, spells: ['Boundless Charge', 'Jump Start', 'Razor Wind'], note: 'Uses its own spell list.',
  },
  {
    name: 'Iron Fang Uhlan', book: 'kng', page: 176, careers: ['Iron Fang', 'Horseman'], requires: 'Starting careers Horseman and Iron Fang',
    add: { abilities: ['Fast Rearm (Blasting Lance)'], assets: ['Blasting lance with ten blasting heads', 'Pozdyov warhorse'] },
    remove: { abilities: ['Fast Rearm'], assets: ['Blasting pike (spear head and ten blasting heads)', 'Warhorse with tack and heavy barding'] },
  },
  {
    name: 'Man-O-War Drakhun', book: 'kng', page: 176, careers: ['Man-O-War', 'Horseman'], requires: 'Starting careers Horseman and Man-O-War',
    add: { abilities: ['Trained Rider (Karpathan Destrier)'], assets: ['Karpathan destrier warhorse'] },
    remove: { abilities: ['Combat Rider'], assets: ['Warhorse with tack and heavy barding'] },
  },
  {
    name: 'Amethyst Rose Gun Mage', book: 'kng', page: 239, careers: ['Gun Mage'], requires: 'Llaelese human',
    pairsWith: ['Duelist', 'Highwayman', 'Horseman', 'Military Officer', 'Pistoleer', 'Spy', 'Warcaster'],
    add: { connections: ['Connections (Loyal Order of the Amethyst Rose)'], assets: ['Dual magelock with ten rounds'] },
    remove: { assets: ['Magelock pistol or rifle with ten rounds'] },
    spells: ['Occultation', 'Rune Shot: Accuracy', 'Rune Shot: Brutal'], note: 'Uses its own spell list.',
  },
  {
    name: 'Llaelese Warcaster', book: 'kng', page: 240, careers: ['Warcaster'], requires: `Llaelese ${WARCASTER_REQUIRES}`,
    pairsWith: ['Aristocrat', 'Duelist', 'Field Mechanik', 'Gun Mage', 'Highwayman', 'Horseman', 'Military Officer', 'Pistoleer', 'Sorcerer', 'Spy'],
    spells: ['Blur', 'Twister'], note: 'Uses its own spell list.',
  },
  {
    name: 'Marine', book: 'kng', page: 301, careers: ['Soldier'], requires: 'Any character',
    add: {
      abilities: ['Boarding Action', 'Specialization (Cutlass or Gaff Spear)'],
      skills: ['Jumping 1', 'Sailing 1', 'Swimming 1'].map(grant),
      abilityList: ['Boarding Action', 'Specialization (Cutlass)', 'Specialization (Gaff Spear)'],
      maxima: { Sailing: 3 },
    },
    remove: { abilities: ['Find Cover', 'Sentry'], skills: ['Driving', 'Survival'] },
  },
  {
    name: 'Crucible Guard', book: 'kng', page: 301, careers: ['Soldier'], requires: 'Cygnaran, Llaelese or Ordic human',
    pairsWith: ['Artillerist', 'Field Mechanik', 'Horseman', 'Investigator', 'Man-at-Arms', 'Military Officer', 'Rifleman', 'Warcaster'],
    add: {
      connections: ['Connections (Golden Crucible)'],
      skills: ['Rifle 1', 'Thrown Weapon 1'].map(grant),
      assets: ['Crucible armor', '250 gc worth of grenades', 'Crucible Arms weapons and ammunition'],
    },
    remove: { skills: ['Crossbow', 'Great Weapon', 'Hand Weapon', 'Pistol', 'Rifle', 'Thrown Weapon'] },
    gold: 0,
  },
  {
    name: 'Maritime Order of the Trident Arcanist', book: 'kng', page: 302, careers: ['Arcanist'], requires: 'Ordic human',
    pairsWith: ['Arcane Mechanik', 'Aristocrat', 'Explorer', 'Soldier', 'Military Officer', 'Warcaster', 'Pirate', 'Priest', 'Sorcerer'],
    add: { connections: ['Connections (Ordic military)'], skills: ['Hand Weapon 1', 'Pistol 1'].map(grant), maxima: { 'Hand Weapon': 3, Pistol: 3 } },
    remove: { skills: ['Lore (Arcane)', 'Research'] },
    spells: ['Deadeye', 'Extinguisher', 'Triage'], note: 'Uses its own spell list.',
  },
  {
    name: 'Ordic Warcaster', book: 'kng', page: 303, careers: ['Warcaster'], requires: `Ordic ${WARCASTER_REQUIRES}`,
    pairsWith: ['Arcane Mechanik', 'Arcanist', 'Aristocrat', 'Artillerist', 'Duelist', 'Explorer', 'Field Mechanik', 'Horseman', 'Man-at-Arms', 'Military Officer', 'Pirate', 'Priest', 'Soldier', 'Sorcerer'],
    add: { connections: ['Connections (Ordic military)'] }, spells: ['Convection', 'Fortune'],
    note: 'Uses its own spell list. Can take naval warcaster armor (KNG p. 307) as the bonded item.',
  },
  {
    name: 'Vassal of Menoth', book: 'kng', page: 354, careers: ['Arcane Mechanik'], requires: 'Menite human; character creation only',
    pairsWith: ['Alchemist', 'Arcanist', 'Field Mechanik', 'Priest', 'Sorcerer'],
    add: { connections: ['Connections (Vassals of Menoth)'], assets: ['Vassal armor'] },
    remove: { assets: ['Mechanika weapon or armor worth up to 750 gc'] },
    spells: ['Arcane Bolt', 'Ashen Veil', 'Short Out'], note: 'Uses its own spell list.',
  },
  {
    name: 'Exemplar Errant', book: 'kng', page: 355, careers: ['Exemplar', 'Ranger'], requires: 'Starting careers Exemplar and Ranger',
    add: {
      abilities: ['Sanguine Bond', 'Specialization (Lawbringer Crossbow)'],
      skills: ['Crossbow 1', 'Hand Weapon 2', 'Shield 1'].map(grant),
      assets: ['Lawbringer crossbow with ten blessed bolts', 'Shield', 'Sword'],
    },
    remove: {
      skills: ['Archery', 'Crossbow', 'Great Weapon', 'Hand Weapon', 'Pistol', 'Rifle'],
      assets: ['One weapon: blazing sword, consecrated halberd, or relic blade'],
      archetypeBenefits: ['Righteous Anger'],
    },
  },
  {
    name: 'Exemplar Venger', book: 'kng', page: 355, careers: ['Exemplar', 'Horseman'], requires: 'Starting careers Exemplar and Horseman',
    add: { skills: ['Hand Weapon 2', 'Lance 2', 'Shield 1'].map(grant), assets: ['Blessed lance', 'Shield', 'Sword'] },
    remove: { skills: ['Great Weapon', 'Hand Weapon', 'Lance', 'Pistol'], assets: ['One weapon: blazing sword, consecrated halberd, or relic blade'] },
  },
  {
    name: 'Protectorate Warcaster', book: 'kng', page: 355, careers: ['Warcaster'], requires: `Menite ${WARCASTER_REQUIRES}`,
    pairsWith: ['Allegiant of the Order of the Fist', 'Cutthroat', 'Duelist', 'Exemplar', 'Field Mechanik', 'Paladin of the Order of the Wall', 'Priest', 'Reclaimer', 'Scrutator'],
    add: { connections: ['Connections (Protectorate military)'] }, spells: ['Ashen Veil', 'Immolation'], note: 'Uses its own spell list.',
  },
]
