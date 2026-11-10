import { describe, expect, it } from 'vitest';
import { migrate } from '../utils/migrate';

type Data = Record<string, unknown>;
const classes = (data: unknown) => (data as { classes: Data[] }).classes;
const spells = (data: unknown) => (data as { spells: Data[] }).spells;

describe('migrate', () => {
  it('works class levels out from Skill Levels, adding a Skill for any missing levels', () => {
    const old = { classes: [{ name: 'Guardian', level: 5, skills: [{ name: 'Fortress', level: 3, notes: '' }] }] };
    const [guardian] = classes(migrate(old, 1));
    expect(guardian).not.toHaveProperty('level');
    expect(guardian.skills).toEqual([
      { name: 'Fortress', level: 3, notes: '' },
      { name: '', level: 2, notes: '' },
    ]);
  });

  it('leaves a class whose Skills already add up to its level as it was', () => {
    const old = { classes: [{ name: 'Orator', level: 2, skills: [{ name: 'Condemn', level: 2, notes: '' }] }] };
    expect(classes(migrate(old, 1))[0].skills).toEqual([{ name: 'Condemn', level: 2, notes: '' }]);
  });

  it('moves a spell page out of the notes the old rulebook picker wrote', () => {
    const old = {
      spells: [
        { name: 'Heal', notes: 'Spiritist, p. 208' },
        { name: 'Glamour', notes: 'Illusionist, LF p. 97' },
        { name: 'Own', notes: 'My own notes' },
      ],
    };
    expect(spells(migrate(old, 3)).map(({ page, notes }) => ({ page, notes }))).toEqual([
      { page: 'p. 208', notes: '' },
      { page: 'LF p. 97', notes: '' },
      { page: '', notes: 'My own notes' },
    ]);
  });

  it('never overwrites a spell page that is already filled in, so it is safe to run twice', () => {
    const once = migrate({ spells: [{ name: 'Heal', notes: 'Spiritist, p. 208' }] }, 3);
    expect(migrate(once, 3)).toEqual(once);
    const kept = { spells: [{ name: 'Heal', page: 'p. 1', notes: 'Spiritist, p. 208' }] };
    expect(spells(migrate(kept, 3))[0]).toMatchObject({ page: 'p. 1', notes: 'Spiritist, p. 208' });
  });

  it("moves a custom class's Ritualism into its list of disciplines", () => {
    const old = {
      classes: [
        { name: 'Hedge Witch', custom: { hp: null, ritualism: true, disciplines: { entropism: true } }, skills: [] },
      ],
    };
    const once = migrate(old, 4);
    expect(classes(once)[0].custom).toEqual({ hp: null, disciplines: { entropism: true, ritualism: true } });
    expect(migrate(once, 4)).toEqual(once);
  });

  it('leaves current data and non-objects alone', () => {
    const current = { classes: [] };
    expect(migrate(current, 5)).toBe(current);
    expect(migrate(null, 1)).toBeNull();
  });
});
