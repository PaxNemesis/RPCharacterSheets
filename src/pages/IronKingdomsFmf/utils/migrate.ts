import { abilityRef } from '../constants/abilities';
import { archetypeBenefitRef } from '../constants/archetypes';
import { findCareer } from '../constants/careers';
import { findRune } from '../constants/mechanika';
import { findRace } from '../constants/races';
import { skillRef } from '../constants/skills';
import type { IkSettings } from '../types';
import { capacitorValues } from './mechanika';
import { toVersion5 } from './toVersion5';

type Data = Record<string, unknown>;
type Section = Record<string, unknown> | undefined;

/** Upgrades characters saved by older versions of the sheet, one version at a time. */
export function migrate(data: unknown, fromVersion: number): unknown {
  if (data === null || typeof data !== 'object') return data;
  let character = data as Data;
  if (fromVersion < 2) character = toVersion2(character);
  if (fromVersion < 3) character = toVersion3(character);
  if (fromVersion < 4) character = toVersion4(character);
  if (fromVersion < 5) character = toVersion5(character);
  return character;
}

/**
 * Version 2 added rulebook races and careers: characters whose race or careers don't match the
 * book keep their own text, with that rule setting turned off.
 */
function toVersion2(character: Data): Data {
  const identity = (character.identity as Section) ?? {};
  const race = typeof identity.race === 'string' ? identity.race : '';
  const careerText = typeof identity.careers === 'string' ? identity.careers : '';
  const careerNames = careerText
    .split(/,|\/|&| and /)
    .map((name) => name.trim())
    .filter(Boolean);
  const careersMatch = careerNames.every((name) => findCareer(name));

  return {
    ...character,
    identity: {
      ...identity,
      careerList: careersMatch ? [...careerNames, '', ''].slice(0, Math.max(2, careerNames.length)) : ['', ''],
    },
    settings: {
      ...(character.settings as Section),
      raceRules: race.trim() === '' || findRace(race) !== undefined,
      careerRules: careersMatch,
    },
  };
}

type Row = Record<string, unknown>;
type OldMechanika = { name?: string; runePlate?: string; capacitor?: string; charges?: number | null; notes?: string };
const text = (value: unknown) => (typeof value === 'string' ? value : '');

/**
 * Version 3 split each mechanika device into housing, capacitor and runes, and added pages to
 * skills, abilities and archetype benefits found in the books.
 */
function toVersion3(character: Data): Data {
  const settings = (character.settings ?? {}) as IkSettings;
  const withPages = (rows: unknown, pageOf: (name: string) => string | undefined) =>
    Array.isArray(rows)
      ? (rows as Row[]).map((row) => (text(row.page) ? row : { ...row, page: pageOf(text(row.name)) ?? '' }))
      : rows;
  const devices = Array.isArray(character.mechanika) ? (character.mechanika as OldMechanika[]) : [];
  return {
    ...character,
    mechanika: devices.map(splitDevice),
    skills: withPages(character.skills, skillRef),
    abilities: withPages(character.abilities, (name) => abilityRef(name, settings)),
    archetypeBenefits: withPages(character.archetypeBenefits, archetypeBenefitRef),
  };
}

/** The old housing, capacitor and comma-separated rune plate, with rulebook values where the names match. */
function splitDevice(old: OldMechanika) {
  const runes = text(old.runePlate)
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => {
      const rune = findRune(name);
      return { name, points: rune?.points ?? null, page: rune ? String(rune.page) : '', notes: '' };
    });
  const charges = typeof old.charges === 'number' ? `Charges: ${old.charges}` : '';
  return {
    name: '',
    type: '',
    housing: text(old.name),
    capacitor: text(old.capacitor),
    power: null,
    lifespan: '',
    ...capacitorValues(text(old.capacitor)),
    runes,
    notes: [charges, text(old.notes)].filter(Boolean).join('\n\n'),
  };
}

/** "yes", "Y", "NO" and the like as the sheet's Yes or No; anything else, such as "*", is kept. */
const yesNo = (value: unknown) => {
  const trimmed = text(value).trim();
  if (/^y(es)?$/i.test(trimmed)) return 'Yes';
  if (/^no?$/i.test(trimmed)) return 'No';
  return value;
};

/** Version 4 made a spell's UP and OFF dropdowns of Yes and No, so typed values are tidied to match. */
function toVersion4(character: Data): Data {
  if (!Array.isArray(character.spells)) return character;
  return {
    ...character,
    spells: (character.spells as Row[]).map((spell) =>
      spell && typeof spell === 'object' ? { ...spell, up: yesNo(spell.up), off: yesNo(spell.off) } : spell,
    ),
  };
}
