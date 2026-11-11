import type { FuCharacter, FuDerived } from './character';

/**
 * Moments that change what the character is tracking. A conflict is a scene, so ending one is
 * 'endScene'; 'rest' also ends the scene.
 */
export type ConflictEvent = 'startConflict' | 'startTurn' | 'endTurn' | 'endScene' | 'rest';

/** Returns the character as it is after the event. Must not change anything when there is nothing to do. */
export type ConflictHook = (character: FuCharacter, derived: FuDerived) => FuCharacter;

/** What a class does at each event; it only runs for characters with that rulebook class. */
export type ClassConflictRules = {
  className: string;
  on: Partial<Record<ConflictEvent, ConflictHook>>;
};
