// Page of each ability's entry in the core rules (pp. 157–168).
const PAGES: Record<number, string[]> = {
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
}

export const ABILITY_PAGES: Record<string, number> = Object.fromEntries(
  Object.entries(PAGES).flatMap(([page, names]) => names.map((name) => [name, Number(page)])),
)

export const abilityPage = (name: string) => {
  const base = name.replace(/\s*\(.*\)\s*$/, '').trim().toLowerCase()
  const match = Object.keys(ABILITY_PAGES).find((ability) => ability.toLowerCase() === base)
  return match ? ABILITY_PAGES[match] : undefined
}
