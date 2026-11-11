import { findDance } from '../../../utils/dancer';
import { GROWTH_CLOCK_SIZE, MAGISEEDS } from '../../../constants/floralist';
import type { FuCharacter, FuDerived } from '../../../types';
import { hasRulebookClass } from '../../../utils/rules';
import { soulBeadLimit } from '../../../utils/monk';
import { symbolLimits } from '../../../utils/symbolist';
import type { ClassStatus } from '../ConflictBar.types';

const UNTIL_NEXT_TURN = 'until your next turn';

/** A dance lasting until your next turn runs from when it is performed until you start your next turn. */
function dancer({ dancer: { current, previous }, conflict }: FuCharacter): ClassStatus {
  const lasting = [current, conflict.acting ? '' : previous].filter((name) => findDance(name)?.duration === 'turn');
  return {
    panel: 'dances',
    label: 'Dances',
    summary: current ? `Dance: ${current}` : conflict.acting || !previous ? 'No dance yet' : `Last: ${previous}`,
    effects: lasting.map((name) => ({ name, lasts: UNTIL_NEXT_TURN })),
  };
}

/** The Growth Clock fills at the end of your turn, and then the magiseed's end-of-turn effect applies (NF p. 140). */
function floralist({ floralist: { garden, growth }, conflict }: FuCharacter): ClassStatus {
  const seed = MAGISEEDS.find((entry) => entry.name === garden);
  const status = { panel: 'garden', label: 'Garden', effects: [] };
  if (!seed) return { ...status, summary: 'Garden empty' };
  const next = growth + 1;
  const reminder = conflict.acting
    ? next >= GROWTH_CLOCK_SIZE
      ? `Ending your turn fills the Growth Clock: ${seed.name} leaves the garden.`
      : `Ending your turn fills the Growth Clock to ${next}, then ${seed.name}'s end-of-turn effect applies.`
    : growth > 0
      ? `End of turn: apply ${seed.name}'s effect for ${growth} filled section${growth > 1 ? 's' : ''}, if it has one (NF p. ${seed.page}).`
      : undefined;
  return { ...status, summary: `${seed.name} ${growth}/${GROWTH_CLOCK_SIZE}`, reminder };
}

/** What each of the character's classes is tracking: Soul Beads, dances, the garden, verses and symbols. */
export function classStatuses(character: FuCharacter, derived: FuDerived): ClassStatus[] {
  const has = (name: string) => hasRulebookClass(character, name);
  const inConflict = character.conflict.active;
  const statuses: (ClassStatus | false)[] = [
    has('Monk') &&
      inConflict && {
        panel: 'soul-beads',
        label: 'Soul Beads',
        summary: `Core ${character.monk.core} · Resolve ${character.monk.resolve} of ${soulBeadLimit(derived)}`,
        effects: [],
      },
    has('Dancer') && inConflict && dancer(character),
    has('Floralist') && inConflict && floralist(character),
    has('Chanter') &&
      inConflict && {
        panel: 'verses',
        label: 'Verses',
        summary: character.chanter.sung ? 'Verse sung this turn' : 'No verse yet',
        effects: [],
      },
    has('Symbolist') && {
      panel: 'symbols',
      label: 'Symbols',
      summary: `${character.symbolist.active.length} of ${symbolLimits(character).active} symbols active`,
      effects: [],
    },
  ];
  return statuses.filter((status): status is ClassStatus => Boolean(status));
}
