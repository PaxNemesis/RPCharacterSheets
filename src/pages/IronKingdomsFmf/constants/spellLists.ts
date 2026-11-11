/* oxlint-disable max-lines -- Every career spell list in one table, in book order, so each can be checked against its page. */

/** A spell list from its COST 1–4 rows, each a comma-separated row as printed. */
const list = (...costs: string[]) => costs.flatMap((row) => row.split(', '));

/**
 * Spells each career can learn: core rules pp. 234–236, Scrutator (KNG p. 360) and Thamarite Advocate
 * (UA p. 67). A Priest's list follows the faith and a Sorcerer's the element, keyed "Priest: Menite".
 * Names follow the spell entries where a list spells them differently (Foxhole, Crusader's Call, Deadeye).
 */
export const CAREER_SPELL_LISTS: Record<string, string[]> = {
  'Arcane Mechanik': list(
    'Jackhammer, Jump Start, Locomotion, Power Booster, Protection from Electricity, Return Fire, Short Out',
    'Arcantrik Bolt, Electrify, Fortify, Polarity Shield, Positive Charge, Redline, Refuge, Temper Metal',
    'Broadside, Electrical Blast, Fail Safe, Force Field, Full Throttle, Grind, Guided Fire, Iron Aggression, Superiority',
    'Black Out, Tide of Steel, Voltaic Lock',
  ),
  Arcanist: list(
    'Arcane Strike, Blizzard, Fire Starter, Guided Blade, Influence, Light in the Darkness, Protection from Cold, Protection from Corrosion, Protection from Electricity, Protection from Fire, Storm Tossed',
    'Arcane Bolt, Ashen Cloud, Aura of Protection, Banishing Ward, Celerity, Foxhole, Hand of Fate, Howling Flames, Icy Grip, Occultation, Rock Wall, Telekinesis, True Sight, Vision, Wind Blast',
    'Fog of War, Force Field, Hex Blast, Inhospitable Ground, Lightning Tendrils, Mirage, Rift, Rock Hammer, Zephyr',
    'Force Hammer, Overmind, Tempest',
  ),
  'Gun Mage': list(
    'Return Fire, Rune Shot: Accuracy, Rune Shot: Black Penny, Rune Shot: Brutal, Rune Shot: Iron Rot, Rune Shot: Molten Shot, Rune Shot: Silencer, Rune Shot: Spontaneous Combustion, Rune Shot: Thunderbolt',
    'Fire Group, Heightened Reflexes, Refuge, Rune Shot: Fire Beacon, Rune Shot: Shadow Fire, Rune Shot: Trick Shot, Snipe, True Sight',
    'Guided Fire, Rune Shot: Detonator, Rune Shot: Earth Shaker, Rune Shot: Phantom Seeker, Rune Shot: Spell Cracker',
    'Rune Shot: Freeze Fire, Rune Shot: Heart Stopper, Rune Shot: Momentum',
  ),
  'Priest: Menite': list(
    'Flames of Wrath, Guided Blade, Influence, Protection from Fire',
    'Ashen Cloud, Banishing Ward, Hymn of Battle, Hymn of Passage, Ignite, Immolation, Righteous Flames, Vision, Wall of Fire',
    'Cleansing Fire, Crevasse, Crusader’s Call, Hex Blast, Lamentation, Purification, True Path',
    'Ashes to Ashes, Blazing Effigy, Hymn of Shielding',
  ),
  'Priest: Morrowan': list(
    'Blessing of Health, Guided Blade, Light in the Darkness, Solovin’s Boon',
    'Aura of Protection, Banishing Ward, Blade of Radiance, Blessings of War, Eyes of Truth, Hand of Fate, Shield of Faith, Triage, True Sight',
    'Blessing of Morrow, Crusader’s Call, Daylight, Prayer of Guidance, Sanguine Blessing, Sunburst, True Path',
    'Force of Faith, Heal, Star Fire',
  ),
  'Sorcerer: Fire': list(
    'Fire Starter, Flames of Wrath, Protection from Fire',
    'Ashen Cloud, Extinguisher, Howling Flames, Ignite, Immolation, Wall of Fire',
    'Barrier of Flames, Cleansing Fire, Flare, Fuel the Flames, Inferno',
    'Ashes to Ashes, Blazing Effigy, Sea of Fire',
  ),
  'Sorcerer: Ice': list(
    'Blizzard, Ice Shield, Protection from Cold',
    'Chiller, Frostbite, Ice Bolt, Icy Grip, Shatter Storm, Staying Winter’s Hand',
    'Brittle Frost, Deep Freeze, Frozen Ground, Hoarfrost, Winter Storm',
    'Freezing Grip, Freezing Mist, White Out',
  ),
  'Sorcerer: Stone': list(
    'Earth’s Cradle, Entangle, Stone Stance',
    'Battering Ram, Fortify, Foxhole, Rock Wall, Solid Ground, Stone Strength',
    'Crevasse, Earthquake, Inhospitable Ground, Rift, Rock Hammer',
    'Earthsplitter, Obliteration, Shock Wave',
  ),
  'Sorcerer: Storm': list(
    'Fair Winds, Storm Tossed, Wind Strike',
    'Boundless Charge, Celerity, Razor Wind, Telekinesis, Wind Blast, Wings of Air',
    'Chain Lightning, Deceleration, Fog of War, Lightning Tendrils, Zephyr',
    'Raging Winds, Tempest, Tornado',
  ),
  Warcaster: list(
    'Arcane Strike, Jump Start, Return Fire',
    'Arcane Bolt, Aura of Protection, Battering Ram, Boundless Charge, Convection, Fortify, Foxhole, Redline, Refuge, Snipe, Temper Metal, Transference',
    'Awareness, Batten Down the Hatches, Eliminator, Fail Safe, Grind, Guided Fire, Iron Aggression, Rift, Superiority',
    'Force Hammer, Obliteration, Tide of Steel',
  ),
  Scrutator: list(
    'Influence, Light in the Darkness, Protection from Fire, Short Out',
    'Banishing Ward, Chasten, Cloak of Fear, Devil’s Tongue, Eyes of Truth, Holy Ward, Immolation, Righteous Flames, Vision',
    'Cleansing Fire, Crevasse, Eye of Menoth, Hex Blast, Hex Hammer, Protector’s Mark, Purification',
    'Ashes to Ashes, Mindlock, Overmind',
  ),
  'Thamarite Advocate': list(
    'Fire Starter, Grave Whispers, Influence, Soul Mark',
    'Ashen Cloud, Banishing Ward, Bleed, Bone Shaker, Chiller, Cloak of Fear, Dark Fire, Devil’s Tongue, Occultation, Telgesh Mark, True Sight',
    'Affliction, Dominate Undead, Entropic Force, Ghost Shroud, Hellfire, Hex Blast, Star Crossed, Stygian Abyss',
    'Annihilation, Death Field, Overmind',
  ),
};

/**
 * Kingdom career options (Kings, Nations, and Gods) that replace their career's spell list (`list`), or
 * add to it (`extra`, such as the Arcane Tempest's Rune Shot: Disruption, KNG p. 87).
 */
export const OPTION_SPELL_LISTS: Record<string, { list?: string[]; extra?: string[] }> = {
  'Cygnaran Warcaster': {
    list: list(
      'Arcane Strike, Jump Start, Return Fire',
      'Arcane Bolt, Aura of Protection, Blur, Deadeye, Disruptor, Electrify, Fortify, Foxhole, Heightened Reflexes, Lightning Shroud, Positive Charge, Refuge, Snipe',
      'Arcane Blast, Chain Lightning, Deceleration, Earthquake, Electrical Blast, Fail Safe, Force Field, Guided Fire',
      'Force Hammer, Tide of Steel, Voltaic Lock',
    ),
  },
  'Arcane Tempest Gun Mage': { extra: ['Rune Shot: Disruption'] },
  'Illuminated Arcanist': {
    list: list(
      'Arcane Strike, Guided Blade, Light in the Darkness',
      'Banishing Ward, Blade of Radiance, Blessings of War, Eyes of Truth, Exorcism, Occultation, Shield of Faith, True Sight',
      'Daylight, Hex Blast, Lamentation, Purification, Sunburst',
      'Force Hammer, Force of Faith, Star Fire',
    ),
  },
  Greylord: {
    list: list(
      'Blizzard, Guided Blade, Influence, Light in the Darkness, Power Booster, Protection from Cold, Storm Tossed',
      'Banishing Ward, Chiller, Frostbite, Hand of Fate, Ice Bolt, Icy Grip, Iron Flesh, Shatter Storm, True Sight, Wind Blast',
      'Battle Rage, Deep Freeze, Fog of War, Gallows, Hoarfrost, Inhospitable Ground, Rift, Winter Storm, Zephyr',
      'Freezing Grip, Overmind, Tempest',
    ),
  },
  'Khadoran Warcaster': {
    list: list(
      'Guided Blade, Jump Start, Locomotion',
      'Battering Ram, Boundless Charge, Infernal Machine, Iron Flesh, Ravager, Razor Wind, Redline, Shatter Storm, Transference, Wind Blast',
      'Battle Rage, Eliminator, Fog of War, Gallows, Grind, Inhospitable Ground, Rift, Superiority, Watcher',
      'Freezing Grip, Tempest, Tide of Steel',
    ),
  },
  'Amethyst Rose Gun Mage': {
    list: list(
      'Return Fire, Rune Shot: Accuracy, Rune Shot: Black Penny, Rune Shot: Brutal, Rune Shot: Iron Rot, Rune Shot: Silencer, Rune Shot: Spontaneous Combustion',
      'Celerity, Heightened Reflexes, Occultation, Refuge, Rune Shot: Piercer, Rune Shot: Shadow Fire, Rune Shot: Trick Shot, Vision',
      'Mirage, Rune Shot: Detonator, Rune Shot: Phantom Seeker, Rune Shot: Spell Cracker, Zephyr',
      'Quickened, Rune Shot: Freeze Fire, Rune Shot: Heart Stopper',
    ),
  },
  'Llaelese Warcaster': {
    list: list(
      'Entangle, Fair Winds, Jump Start',
      'Admonition, Arcane Bolt, Battering Ram, Blur, Boundless Charge, Celerity, Deadeye, Positive Charge, Redline, Refuge, Twister, Wind Blast',
      'Awareness, Eliminator, Fail Safe, Force Field, Gallows, Grind, Guided Fire, Rift, Winter Storm',
      'Quickened, Tide of Steel, Tornado',
    ),
  },
  'Maritime Order of the Trident Arcanist': {
    list: list(
      'Blizzard, Buoyancy, Fair Winds, Protection from Cold, Protection from Fire, Storm Tossed, Wind Strike',
      'Celerity, Deadeye, Deadweight, Extinguisher, Fortune, Howling Flames, Icy Grip, Phantasm, Razor Wind, Sea Legs, Shatter Storm, Triage, Wind Blast, Wings of Air',
      'Broadside, Fog of War, Force Field, Gallows, Guided Fire, Mirage, Rift, Winter Storm',
      'Powder Keg, Shock Wave, Tempest',
    ),
  },
  'Ordic Warcaster': {
    list: list(
      'Jump Start, Locomotion, Storm Tossed',
      'Bullet Dodger, Battering Ram, Convection, Deadweight, Fire Group, Fortune, Hot Shot, Redline, Sea Legs, Temper Metal',
      'Batten Down the Hatches, Blow the Man Down, Broadside, Eliminator, Fail Safe, Full Throttle, Gallows, Iron Aggression, Rift',
      'Force Hammer, Obliteration, Powder Keg',
    ),
  },
  'Vassal of Menoth': {
    list: list(
      'Arcane Strike, Fire Starter, Jackhammer, Jump Start, Power Booster, Protection from Fire, Short Out',
      'Arcane Bolt, Ashen Veil, Fortify, Immolation, Positive Charge, Redline, Refuge, Temper Metal',
      'Broadside, Cleansing Fire, Fail Safe, Grind, Guided Fire, Hex Blast, Hex Hammer, Iron Aggression, Superiority',
      'Black Out, Blazing Effigy, Voltaic Lock',
    ),
  },
  'Protectorate Warcaster': {
    list: list(
      'Flames of Wrath, Guided Blade, Stone Stance',
      'Ashen Veil, Blaze of Glory, Convection, Hallowed Avenger, Hand of Fate, Howling Flames, Immolation, Perdition, Righteous Flames, Shield of Faith, Synergy, Wall of Fire',
      'Awareness, Cleansing Fire, Crevasse, Crusader’s Call, Eliminator, Hex Blast, Hex Hammer, Iron Aggression, Rift',
      'Ashes to Ashes, Blazing Effigy, Force Hammer',
    ),
  },
};
