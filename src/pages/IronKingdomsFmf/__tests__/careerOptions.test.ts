import { describe, expect, it } from 'vitest';
import { findCareer } from '../constants/careers';
import { availableOptions, resolveCareer } from '../utils/careerOptions';
import { character } from './character';

const stormguard = (options: string[] = ['Stormguard'], kng = true) =>
  character({
    identity: { race: 'Human', careerList: ['Stormblade', 'Man-at-Arms'], careerOptions: options },
    settings: { books: { kng, ua: true } },
  });

describe('availableOptions', () => {
  it('offers options whose careers are both starting careers', () => {
    const names = availableOptions(stormguard()).map((option) => option.name);
    expect(names).toContain('Stormguard');
    expect(names).not.toContain('Storm Lance');
  });

  it('hides options from books that are turned off', () => {
    expect(availableOptions(stormguard(['Stormguard'], false))).toEqual([]);
  });
});

describe('resolveCareer', () => {
  it('is undefined for a career that isn’t in the books', () => {
    expect(resolveCareer(character(), 'Dreamer')).toBeUndefined();
  });

  it('returns the rulebook career unchanged without options', () => {
    const career = resolveCareer(stormguard([]), 'Stormblade');
    expect(career).toEqual(findCareer('Stormblade'));
    expect(career?.abilities).toEqual(['Blaster', 'Specialization']);
  });

  it('applies a chosen option’s additions and removals (KNG p. 88)', () => {
    const career = resolveCareer(stormguard(), 'Stormblade');
    expect(career?.abilities).toEqual(['Set Defense', 'Specialization (Voltaic Halberd)']);
    expect(career?.assets).toEqual(['Storm Knight armor', 'Voltaic halberd']);
    expect(career?.abilityList).toContain('Set Defense');
  });

  it('applies removals to the option’s other career, but adds only to the first', () => {
    const manAtArms = resolveCareer(stormguard(), 'Man-at-Arms');
    expect(manAtArms?.abilities).not.toContain('Defensive Line');
    expect(manAtArms?.abilities).not.toContain('Set Defense');
  });

  it('adds supplement additions only with their book on', () => {
    const ironFang = (kng: boolean) =>
      resolveCareer(character({ settings: { books: { kng, ua: true } } }), 'Iron Fang');
    expect(ironFang(true)?.pairsWith).toContain('Horseman');
    expect(ironFang(false)?.pairsWith).not.toContain('Horseman');
  });
});
