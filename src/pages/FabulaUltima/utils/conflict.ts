import type { ConflictEvent, ConflictHook, EffectDuration, FuCharacter, FuUse, UseReset } from '../types';
import { calculate } from './calculate';
import { chanterConflict } from './chanter';
import { dancerConflict } from './dancer';
import { floralistConflict } from './floralist';
import { hunterConflict } from './hunter';
import { monkConflict } from './monk';
import { hasRulebookClass } from './rules';

const CLASS_RULES = [chanterConflict, dancerConflict, floralistConflict, hunterConflict, monkConflict];

const NOT_IN_CONFLICT = { active: false, turn: 0, acting: false };

/** Removes effects that end with any of these durations. Unknown durations are kept until removed by hand. */
const endEffects = (character: FuCharacter, ending: EffectDuration[]): FuCharacter => ({
  ...character,
  effects: character.effects.filter((effect) => !ending.includes(effect.lasts as EffectDuration)),
});

/** Gives back the uses that reset at any of these moments. */
const resetUses = (character: FuCharacter, resets: UseReset[]): FuCharacter => ({
  ...character,
  uses: character.uses.map((use): FuUse => (resets.includes(use.resets as UseReset) ? { ...use, used: 0 } : use)),
});

/** What every character tracks, whatever their classes. */
const GENERAL: Record<ConflictEvent, ConflictHook> = {
  startConflict: (character) => ({ ...character, conflict: { active: true, turn: 0, acting: false } }),
  startTurn: (character) =>
    resetUses(
      endEffects(
        { ...character, conflict: { ...character.conflict, turn: character.conflict.turn + 1, acting: true } },
        ['nextTurn'],
      ),
      ['turn'],
    ),
  endTurn: (character) =>
    endEffects({ ...character, conflict: { ...character.conflict, acting: false } }, ['endOfTurn']),
  endScene: (character) =>
    resetUses(endEffects({ ...character, conflict: NOT_IN_CONFLICT }, ['nextTurn', 'endOfTurn', 'scene']), [
      'turn',
      'scene',
    ]),
  // Resting restores all HP and MP and ends all status effects, but not IP (core p. 90).
  rest: (character, derived) =>
    resetUses(
      {
        ...character,
        hp: { ...character.hp, current: derived.maxHp },
        mp: { ...character.mp, current: derived.maxMp },
        statuses: { slow: false, dazed: false, weak: false, shaken: false, enraged: false, poisoned: false },
      },
      ['rest'],
    ),
};

/** Whether the event makes sense now, so a double click or a stale button does nothing. */
function canRun(character: FuCharacter, event: ConflictEvent) {
  const { active, acting } = character.conflict;
  if (event === 'startTurn') return active && !acting;
  if (event === 'endTurn') return active && acting;
  return true;
}

function apply(character: FuCharacter, event: ConflictEvent): FuCharacter {
  const hooks = [
    GENERAL[event],
    ...CLASS_RULES.filter((rules) => hasRulebookClass(character, rules.className)).map((rules) => rules.on[event]),
  ];
  // Each hook sees the values derived from the changes before it, such as a lowered status effect.
  return hooks.reduce((next, hook) => (hook ? hook(next, calculate(next)) : next), character);
}

/** The character after an event, with every class's rules applied. A rest also ends the scene. */
export function runConflictEvent(character: FuCharacter, event: ConflictEvent): FuCharacter {
  if (!canRun(character, event)) return character;
  return event === 'rest' ? apply(apply(character, 'endScene'), 'rest') : apply(character, event);
}
