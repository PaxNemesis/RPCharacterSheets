import { GROWTH_CLOCK_SIZE } from '../constants/floralist';
import type { ClassConflictRules, FuCharacter } from '../types';

const withGarden = (character: FuCharacter, garden: string, growth: number): FuCharacter => ({
  ...character,
  floralist: { ...character.floralist, garden, growth },
});

/**
 * The Growth Clock starts each scene empty. At the end of your turn, a planted magiseed fills a
 * section; filling the last one removes the magiseed and erases the clock. The garden empties at
 * the end of the scene (NF p. 140).
 */
export const floralistConflict: ClassConflictRules = {
  className: 'Floralist',
  on: {
    startConflict: (character) => withGarden(character, character.floralist.garden, 0),
    endTurn: (character) => {
      const { garden, growth } = character.floralist;
      if (!garden) return character;
      return growth + 1 >= GROWTH_CLOCK_SIZE ? withGarden(character, '', 0) : withGarden(character, garden, growth + 1);
    },
    endScene: (character) => withGarden(character, '', 0),
  },
};
