import type { BookId, IkSettings } from '../types'
import { compareNames } from '../utils/alphabetical'
import { bookEnabled, bookRef } from './books'

// Page of each ability's entry: core rules pp. 157–168, Kings, Nations, and Gods and Urban Adventure.
const PAGES: Record<BookId, Record<number, string[]>> = {
  core: {
    157: ['Ace Commander', 'Acrobatics', 'Advisor', 'Ambush', 'Anatomical Precision', 'Appraise', 'Arcane Assassin', 'Arcane Defenses', 'Arcane Engineer', 'Arcane Precision', 'Arcane Scholar', 'Astute', 'Backstab', 'Battle Commander', 'Battle Plan: Call to Action', 'Battle Plan: Coordinated Strike', '’Jack Marshal'],
    158: ['Battle Plan: Desperate Pace', 'Battle Plan: Go to Ground', 'Battle Plan: Reconnaissance', 'Battle Plan: Shadow', 'Bayonet Charge', 'Big Game Hunter', 'Binding', 'Blaster', 'Blood Spiller', 'Bodge', 'Bodyguard', 'Bomber', 'Bond'],
    159: ['Brew Master', 'Camouflage', 'Card Sharp', 'Cautious Advance', 'Cavalry Charge', 'Chain Attack: Bleed Out', 'Chain Attack: Pin Down', 'Choir', 'Cleave', 'Close Shot', 'Combat Rider', 'Conniver', 'Cover Identity', 'Crackshot'],
    160: ['Craft Rune Shot', 'Crossbowman', 'Defender', 'Defensive Line', 'Dig In', 'Disease Resistance', 'Dispel'],
    161: ['Dodger', 'Drive: Ancillary Attack', 'Drive: Assault', 'Drive: Off Road', 'Drive: Pronto', 'Dual Shot', 'Elemental Mastery', 'Empower', 'Expert Rider', 'Fast Cook', 'Fast Draw', 'Fast Rearm', 'Fast Reload', 'Fell Call: Cacophony', 'Fell Call: Call of Defiance'],
    162: ['Fell Call: Ground Shaker', 'Fell Call: Heroic Ballad', 'Fell Call: Reverberation', 'Fell Call: Signal Call', 'Fell Call: Sonic Blast', 'Field Alchemist', 'Field Marshal: Magical Attack', 'Field Marshal: Relentless Charge', 'Field Marshal: Shield Guard', 'Find Cover'],
    163: ['Fire in the Hole!', 'Fleet Foot', 'Free Style', 'Gang', 'Get Away', 'Girded', 'Good Breeding', 'Great Power', 'Grenadier', 'Gunfighter'],
    164: ['Head-Butt', 'Hit the Deck!', 'Hyper Awareness', 'Immunity: Cold', 'Immunity: Corrosion', 'Immunity: Electricity', 'Immunity: Fire', 'Inscribe Formulae', 'Iron Sentinel', 'Iron Will', 'Keen Eyed', 'Language', 'Legacy of Bragg', 'Light Cavalry', 'Load Bearing', 'Mage Killer'],
    165: ['Marksman', 'Natural Leader', 'Night Fighter', 'Parry', 'Pathfinder', 'Poison Resistance', 'Port of Call', 'Precision Strike', 'Press the Attack', 'Privilege', 'Prowl', 'Pursuit'],
    166: ['Quick Work', 'Rallying Cry', 'Relentless Charge', 'Resourceful', 'Retaliatory Strike', 'Return Fire', 'Ride-By Attack', 'Riposte', 'Rock Solid', 'Roll With It', 'Saddle Shot'],
    167: ['Scrounge', 'Sentry', 'Set Defense', 'Shadow Magic', 'Shield Guard', 'Shield Slam', 'Signal Language', 'Sniper', 'Specialization', 'Steady', 'Steamo', 'Sucker!', 'Swift Hunter', 'Swift Rider', 'Take Down'],
    168: ['Targeteer', 'Team Leader', 'Traceless Path', 'Truth Reader', 'Tune Up', 'Two-Weapon Fighting', 'University Education', 'Waylay'],
  },
  kng: {
    90: ['Electromancer', 'Eye of the Storm', 'Maestro', 'Runesmith', 'Storm Booster', 'Weatherman', 'Weather Vane'],
    181: ['Abomination', 'Berserk', 'Bloodlust', 'Fearless', 'Fearsome Howl', 'Ironhead', 'Man of Iron', 'Mounted: Counter Charge', 'Onslaught', 'Silence', 'Steam Jockey', 'Trained Rider'],
    240: ['Strangler'],
    305: ['Battle Plan: Close Fire', 'Battle Plan: Orchestrate Fire', 'Boarding Action', 'Double Powder Ration', 'Scorched Earth', 'Test the Wind'],
    361: ['Aegis', 'Authority', 'Chain Attack: Body Slam', 'Chain Attack: Smite', 'Circular Vision', 'Communion', 'Divine Fortitude', 'Dominating Presence', 'Fist of God', 'Flesh of Steel', 'Flying Fists', 'Gatekeeper', 'Hardened Strike', 'Imperishable Conviction', 'Impervious Wall Stance'],
    362: ['Oath of Silence', 'Reclaim', 'Reed in the Wind', 'Relentless Advance', 'Restoration', 'Sanguine Bond', 'Serpent Strike', 'Shifting Sands Stance', 'Soulstorm', 'Stone-and-Mortar Stance', 'Torture', 'Trip', 'Urcaen’s Gate', 'Whirlwind', 'Whispers of the Creator'],
  },
  ua: {
    10: ['Adaptable', 'Always a Deal to Be Made', 'Archer', 'Brawler', 'Counter Offer', 'Flash Thief', 'Flying Fists', 'Grappler', 'Heave Ho', 'Hit ’Em Low', 'Instructor'],
    11: ['Hulking Presence', 'Lost in the Crowd', 'Low Breeding', 'Perfect Timing', 'Power of Truth', 'Scoping It Out', 'Silver Tongued', 'Street Survivor', 'Team Player', 'Trip'],
    68: ['Black Tongue', 'Corruptor', 'Dark Scribe', 'Ghost Shield', 'Grave Man', 'Haruspex', 'Imbue Weapon', 'Inscribe Thrall Rune', 'Necromancer', 'Soul Taker'],
    69: ['Soul Thief'],
  },
}

/** Every ability entry; Flying Fists and Trip appear in two books. */
export const ABILITIES = Object.entries(PAGES).flatMap(([book, pages]) =>
  Object.entries(pages).flatMap(([page, names]) => names.map((name) => ({ name, book: book as BookId, page: Number(page) }))),
)

/** Names of the abilities in the books the character uses. */
export const abilityNames = (settings: IkSettings) => [
  ...new Set(ABILITIES.filter((ability) => bookEnabled(settings, ability.book)).map((ability) => ability.name)),
].sort(compareNames)

/** Page reference for an ability, e.g. "157" or "KNG 361"; "Specialization (Firebrand)" finds Specialization. */
export const abilityRef = (name: string, settings: IkSettings) => {
  const base = name.replace(/\s*\(.*\)\s*$/, '').trim().toLowerCase()
  const match = ABILITIES.find((ability) => ability.name.toLowerCase() === base && bookEnabled(settings, ability.book))
  return match ? bookRef(match.book, match.page) : undefined
}
