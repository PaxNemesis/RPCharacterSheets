import { describe, expect, it } from 'vitest';
import { createSteamjack } from '../../../utils/createCharacter';
import { jackCombat } from '../utils/jackCombat';

const jack = (overrides: Partial<ReturnType<typeof createSteamjack>>) => ({ ...createSteamjack(), ...overrides });
const stats = { ...createSteamjack().stats, prw: 5, poi: 4, spd: 5, per: 2 };

describe('jackCombat', () => {
  it('adds the cortex bonus and advancement to MAT and RAT (pp. 304, 324)', () => {
    const arcanum = jack({
      stats,
      cortex: { ...createSteamjack().cortex, grade: 'arcanum' },
      advancement: { mat: 1, rat: null },
    });
    expect(jackCombat(arcanum)).toMatchObject({ cortexBonus: 2, advancementLimit: 2, mat: 8, rat: 6, initiative: 12 });
  });

  it('adds nothing for a missing or unknown cortex, and leaves MAT and RAT blank without PRW and POI', () => {
    const unknown = jack({ stats, cortex: { ...createSteamjack().cortex, grade: 'mithril' as never } });
    expect(jackCombat(unknown)).toMatchObject({ cortexBonus: 0, advancementLimit: 0, mat: 5, rat: 4 });
    expect(jackCombat(createSteamjack())).toMatchObject({ mat: null, rat: null, initiative: null });
  });
});
