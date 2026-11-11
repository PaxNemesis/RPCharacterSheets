import type { EffectDuration, FuCharacter } from '../../../types';
import type { BarChip, ClassStatus } from '../ConflictBar.types';

const LASTS: Record<EffectDuration, string> = {
  endOfTurn: 'this turn',
  nextTurn: 'next turn',
  scene: 'scene',
  removed: '',
};

/** The chips on the bar's second line: classes with something happening, then the character's effects. */
export function barChips(character: FuCharacter, statuses: ClassStatus[]): BarChip[] {
  const classChips = statuses.flatMap((status) => (status.chip ? [status.chip] : []));
  const effects = character.effects
    .filter((effect) => effect.name.trim())
    .map((effect, index) => ({
      key: `effect-${index}`,
      text: effect.name,
      note: LASTS[effect.lasts as EffectDuration] || undefined,
      title: effect.notes || undefined,
    }));
  return [...classChips, ...effects];
}
