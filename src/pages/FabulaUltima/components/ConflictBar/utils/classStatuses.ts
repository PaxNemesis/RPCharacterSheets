import { GROWTH_CLOCK_SIZE, MAGISEEDS } from '../../../constants/floralist';
import type { FuCharacter, FuDerived } from '../../../types';
import { findDance } from '../../../utils/dancer';
import { soulBeadLimit } from '../../../utils/monk';
import { hasRulebookClass } from '../../../utils/rules';
import { symbolLimits } from '../../../utils/symbolist';
import type { ClassStatus } from '../ConflictBar.types';

function monk({ monk: { core, resolve } }: FuCharacter, derived: FuDerived): ClassStatus {
  const limit = soulBeadLimit(derived);
  const tracks = [
    { filled: core, size: limit, label: `Core ${core} of ${limit}` },
    { filled: resolve, size: limit, tone: 'resolve' as const, label: `Resolve ${resolve} of ${limit}` },
  ];
  return {
    panel: 'soul-beads',
    label: 'Soul Beads',
    // The dots say it all.
    summary: '',
    tracks,
    chip: { key: 'monk', text: 'Beads', tracks, title: `Core ${core} · Resolve ${resolve} of ${limit}` },
    effects: [],
  };
}

/** A dance lasting until your next turn runs from when it is performed until you start your next turn. */
function dancer({ dancer: { current, previous }, conflict }: FuCharacter): ClassStatus {
  const running = current || (conflict.acting ? '' : previous);
  const lasting = findDance(running)?.duration === 'turn';
  return {
    panel: 'dances',
    label: 'Dances',
    summary: current || 'No dance this turn',
    chip: running ? { key: 'dancer', text: running, note: lasting ? 'next turn' : undefined } : undefined,
    effects: lasting ? [{ name: running, lasts: 'until your next turn' }] : [],
  };
}

/** The Growth Clock fills at the end of your turn, and then the magiseed's end-of-turn effect applies (NF p. 140). */
function floralist({ floralist: { garden, growth }, conflict }: FuCharacter): ClassStatus {
  const seed = MAGISEEDS.find((entry) => entry.name === garden);
  const status = { panel: 'garden', label: 'Garden', effects: [] };
  if (!seed) return { ...status, summary: 'Empty' };
  const tracks = [{ filled: growth, size: GROWTH_CLOCK_SIZE, label: `Growth Clock ${growth} of ${GROWTH_CLOCK_SIZE}` }];
  const next = growth + 1;
  const sections = `${growth} filled section${growth === 1 ? '' : 's'}`;
  const chip = conflict.acting
    ? {
        note: `→ ${next >= GROWTH_CLOCK_SIZE ? 'leaves' : next}`,
        title:
          next >= GROWTH_CLOCK_SIZE
            ? `Ending your turn fills the Growth Clock: ${seed.name} leaves the garden.`
            : `Ending your turn fills the Growth Clock to ${next}, then ${seed.name}'s end-of-turn effect applies.`,
      }
    : growth > 0
      ? {
          note: '· apply effect',
          due: true,
          title: `End of turn: apply ${seed.name}'s effect for ${sections} (NF p. ${seed.page}).`,
        }
      : {};
  return {
    ...status,
    summary: seed.name,
    tracks,
    chip: { key: 'floralist', text: seed.name, tracks, ...chip },
  };
}

/** A trap can only be set before your first turn of a conflict, so the bar reminds you then (LF p. 90). */
function hunter({ hunter: { traps, trapSet }, conflict }: FuCharacter): ClassStatus {
  const status = { panel: 'hunt', label: 'Hunt', effects: [] };
  if (trapSet) {
    return { ...status, summary: `Trap set: ${trapSet}`, chip: { key: 'hunter', text: trapSet, note: 'trap set' } };
  }
  const canSet = traps.length > 0 && !conflict.acting && conflict.turn === 0;
  return {
    ...status,
    summary: 'No trap set',
    chip: canSet
      ? {
          key: 'hunter',
          text: 'Set a trap',
          note: 'before your first turn',
          title: 'Traps are set at the start of a conflict, before your first turn (LF p. 90).',
          due: true,
          panel: 'hunt',
        }
      : undefined,
  };
}

/** What each of the character's classes is tracking: Soul Beads, dances, the garden, verses and symbols. */
export function classStatuses(character: FuCharacter, derived: FuDerived): ClassStatus[] {
  const has = (name: string) => hasRulebookClass(character, name);
  const inConflict = character.conflict.active;
  const { sung } = character.chanter;
  const symbols = character.symbolist.active.length;
  const statuses: (ClassStatus | false)[] = [
    has('Monk') && inConflict && monk(character, derived),
    has('Dancer') && inConflict && dancer(character),
    has('Floralist') && inConflict && floralist(character),
    has('Hunter') && inConflict && hunter(character),
    has('Chanter') &&
      inConflict && {
        panel: 'verses',
        label: 'Verses',
        summary: sung ? 'Sung this turn' : 'No verse yet',
        chip: sung ? { key: 'chanter', text: 'Verse sung' } : undefined,
        effects: [],
      },
    has('Symbolist') && {
      panel: 'symbols',
      label: 'Symbols',
      summary: `${symbols} of ${symbolLimits(character).active} active`,
      chip: symbols > 0 ? { key: 'symbolist', text: `${symbols} ${symbols === 1 ? 'symbol' : 'symbols'}` } : undefined,
      effects: [],
    },
  ];
  return statuses.filter((status): status is ClassStatus => Boolean(status));
}
