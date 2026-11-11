import { describe, expect, it } from 'vitest';
import { runConflictEvent } from '../utils/conflict';
import { hunterSkills, trapIp, trapLimit } from '../utils/hunter';
import { character, classWith } from './character';

const hunter = (setTrap: number, heroic: string[] = []) =>
  character({
    classes: [classWith('Hunter', ['Set Trap', setTrap], ['Lock-On', 1])],
    heroicSkills: heroic.map((name) => ({ name, source: 'Hunter', notes: '' })),
  });

describe('hunter', () => {
  it('learns two traps per level of Set Trap', () => {
    expect([trapLimit(hunter(1)), trapLimit(hunter(3))]).toEqual([2, 6]);
  });

  it('costs IP equal to the trap’s Skill Level, 1 less from SL 2 up with Master Trapper', () => {
    expect([1, 2, 5].map((sl) => trapIp(sl, false))).toEqual([1, 2, 5]);
    expect([1, 2, 5].map((sl) => trapIp(sl, true))).toEqual([1, 1, 4]);
  });

  it('knows the Hunter’s Heroic Skills', () => {
    expect(hunterSkills(hunter(1, ['Master Trapper', 'Unerring Focus']))).toMatchObject({
      setTrap: 1,
      lockOn: 1,
      masterTrapper: true,
      unerringFocus: true,
      fatalPrecision: false,
    });
  });

  it('allows a new trap once the scene ends, but keeps an ambush trap for the conflict it starts', () => {
    const ambush = { ...hunter(1), hunter: { traps: ['Tripwire'], notes: {}, trapSet: 'Tripwire' } };
    const started = runConflictEvent(ambush, 'startConflict');
    expect(started.hunter.trapSet).toBe('Tripwire');
    expect(runConflictEvent(started, 'endScene').hunter.trapSet).toBe('');
  });
});
