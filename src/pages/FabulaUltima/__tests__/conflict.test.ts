import { describe, expect, it } from 'vitest';
import type { ConflictEvent, FuCharacter, FuEffect, FuUse } from '../types';
import { runConflictEvent } from '../utils/conflict';
import { character, classWith } from './character';

const run = (sheet: FuCharacter, ...events: ConflictEvent[]) => events.reduce(runConflictEvent, sheet);

const effect = (name: string, lasts: FuEffect['lasts']): FuEffect => ({ name, source: '', lasts, notes: '' });
const use = (name: string, resets: FuUse['resets']): FuUse => ({ name, used: 1, max: 1, resets });

describe('conflict', () => {
  it('counts your turns and whether it is your turn', () => {
    const sheet = run(character(), 'startConflict', 'startTurn', 'endTurn', 'startTurn');
    expect(sheet.conflict).toEqual({ active: true, turn: 2, acting: true });
    expect(run(sheet, 'endScene').conflict).toEqual({ active: false, turn: 0, acting: false });
  });

  it('ignores starting or ending a turn twice, or outside a conflict', () => {
    const acting = run(character(), 'startConflict', 'startTurn');
    expect(runConflictEvent(acting, 'startTurn')).toBe(acting);
    const waiting = runConflictEvent(acting, 'endTurn');
    expect(runConflictEvent(waiting, 'endTurn')).toBe(waiting);
    const idle = character();
    expect(runConflictEvent(idle, 'startTurn')).toBe(idle);
  });

  it('ends effects at the end of this turn, the start of the next, or the end of the scene', () => {
    const effects = [
      effect('Turn', 'endOfTurn'),
      effect('Next', 'nextTurn'),
      effect('Scene', 'scene'),
      effect('Kept', 'removed'),
      effect('Unknown', ''),
    ];
    const acting = run(character(), 'startConflict', 'startTurn');
    const names = (sheet: FuCharacter) => sheet.effects.map((entry) => entry.name);
    const waiting = run({ ...acting, effects }, 'endTurn');
    expect(names(waiting)).toEqual(['Next', 'Scene', 'Kept', 'Unknown']);
    expect(names(run(waiting, 'startTurn'))).toEqual(['Scene', 'Kept', 'Unknown']);
    expect(names(run(waiting, 'endScene'))).toEqual(['Kept', 'Unknown']);
  });

  it('gives back limited uses each turn, scene or rest', () => {
    const uses = [use('Turn', 'turn'), use('Scene', 'scene'), use('Rest', 'rest')];
    const used = (sheet: FuCharacter) => sheet.uses.map((entry) => entry.used);
    const waiting = run(character({ uses }), 'startConflict');
    expect(used(run(waiting, 'startTurn'))).toEqual([0, 1, 1]);
    expect(used(run(waiting, 'endScene'))).toEqual([0, 0, 1]);
    expect(used(run(waiting, 'rest'))).toEqual([0, 0, 0]);
  });

  it('restores HP and MP and ends status effects on a rest, but not IP, and ends the conflict', () => {
    const base = character();
    const hurt = run(
      {
        ...base,
        hp: { current: 3, other: null },
        mp: { current: 1, other: null },
        ip: { current: 2, other: null },
        statuses: { ...base.statuses, shaken: true, poisoned: true },
      },
      'startConflict',
      'rest',
    );
    expect([hurt.hp.current, hurt.mp.current, hurt.ip.current]).toEqual([40, 40, 2]);
    expect(Object.values(hurt.statuses).some(Boolean)).toBe(false);
    expect(hurt.conflict.active).toBe(false);
  });
});

describe('class rules in a conflict', () => {
  it('only applies the rules of classes the character has', () => {
    const sheet = run(
      character({ floralist: { discovered: [], seedNotes: {}, garden: 'Remedy Lily', growth: 2 } }),
      'startConflict',
      'startTurn',
      'endTurn',
    );
    expect(sheet.floralist.growth).toBe(2);
  });

  it('gives a Monk full Core Beads, then turns one into 2 Resolve Beads at the start of each turn', () => {
    const monk = character({ classes: [classWith('Monk', ['Clarity', 1])] });
    const waiting = run(monk, 'startConflict');
    expect(waiting.monk).toMatchObject({ core: 4, resolve: 0 });
    const turns = (count: number) =>
      run(waiting, ...Array.from({ length: count }, (): ConflictEvent[] => ['startTurn', 'endTurn']).flat()).monk;
    expect(turns(1)).toMatchObject({ core: 3, resolve: 2 });
    expect(turns(2)).toMatchObject({ core: 2, resolve: 4 });
    // Resolve Beads are full at the limit of 4, so the Core Beads are kept.
    expect(turns(3)).toMatchObject({ core: 2, resolve: 4 });
    const almostFull = { ...waiting, monk: { ...waiting.monk, core: 1, resolve: 3 } };
    expect(run(almostFull, 'startTurn').monk).toMatchObject({ core: 0, resolve: 4 });
    expect(run(run(waiting, 'startTurn'), 'endScene').monk).toMatchObject({ core: 0, resolve: 0 });
  });

  it('lets a Chanter sing again from the start of the next turn or scene', () => {
    const chanter = character({ classes: [classWith('Chanter', ['Magichant', 1])] });
    const acting = run(chanter, 'startConflict', 'startTurn');
    const sung = { ...acting, chanter: { ...acting.chanter, sung: true } };
    expect(run(sung, 'endTurn').chanter.sung).toBe(true);
    expect(run(sung, 'endTurn', 'startTurn').chanter.sung).toBe(false);
    expect(run(sung, 'endScene').chanter.sung).toBe(false);
  });

  it("makes a Dancer's dance last turn's at the end of the turn, and forgets both at the end of the scene", () => {
    const dancer = character({ classes: [classWith('Dancer', ['Dance', 1])] });
    const acting = run(dancer, 'startConflict', 'startTurn');
    const danced = { ...acting, dancer: { ...acting.dancer, current: 'Phoenix Dance' } };
    const waiting = run(danced, 'endTurn');
    expect(waiting.dancer).toMatchObject({ current: '', previous: 'Phoenix Dance' });
    expect(run(waiting, 'startTurn', 'endTurn').dancer.previous).toBe('');
    expect(run(danced, 'endScene').dancer).toMatchObject({ current: '', previous: '' });
  });

  it("fills a Floralist's Growth Clock at the end of each turn, and removes the magiseed when it is full", () => {
    const floralist = character({ classes: [classWith('Floralist', ['Chloromancy', 1])] });
    const acting = run(floralist, 'startConflict', 'startTurn');
    const planted = { ...acting, floralist: { ...acting.floralist, garden: 'Remedy Lily' } };
    const turns = (count: number) =>
      run(planted, ...Array.from({ length: count }, (): ConflictEvent[] => ['endTurn', 'startTurn']).flat());
    expect(turns(1).floralist).toMatchObject({ garden: 'Remedy Lily', growth: 1 });
    expect(turns(3).floralist).toMatchObject({ garden: 'Remedy Lily', growth: 3 });
    expect(turns(4).floralist).toMatchObject({ garden: '', growth: 0 });
    expect(run(turns(2), 'endScene').floralist).toMatchObject({ garden: '', growth: 0 });
    expect(run(acting, 'endTurn').floralist.growth).toBe(0);
  });
});
