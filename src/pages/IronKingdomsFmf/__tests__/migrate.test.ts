import { describe, expect, it } from 'vitest';
import { migrate } from '../utils/migrate';

describe('migrate', () => {
  it('splits an old mechanika device into housing, capacitor and runes', () => {
    const old = {
      mechanika: [
        { name: 'Armor', runePlate: 'Aegis, Homebrew', capacitor: 'Storm Chamber', charges: 2, notes: 'Shiny' },
      ],
    };
    const [device] = (migrate(old, 1) as { mechanika: Record<string, unknown>[] }).mechanika;
    expect(device).toMatchObject({
      housing: 'Armor',
      capacitor: 'Storm Chamber',
      power: 5,
      notes: 'Charges: 2\n\nShiny',
    });
    expect(device.runes).toEqual([
      { name: 'Aegis', points: 1, page: '284', notes: '' },
      { name: 'Homebrew', points: null, page: '', notes: '' },
    ]);
  });

  it('keeps careers that are not in the book as text with career rules off', () => {
    const migrated = migrate({ identity: { careers: 'Soldier and Dreamer' } }, 1) as Record<
      string,
      Record<string, unknown>
    >;
    expect(migrated.identity.careers).toBe('Soldier and Dreamer');
    expect(migrated.settings.careerRules).toBe(false);
    expect(migrated.identity.careerList).toEqual(['', '']);
  });

  it('picks careers from the book out of the old career text, with career rules on', () => {
    const migrated = migrate({ identity: { careers: 'Soldier / Pistoleer', race: 'Human' } }, 1) as Record<
      string,
      Record<string, unknown>
    >;
    expect(migrated.identity.careerList).toEqual(['Soldier', 'Pistoleer']);
    expect(migrated.settings).toMatchObject({ careerRules: true, raceRules: true });
  });

  it('tidies typed spell UP and OFF values to the dropdowns’ Yes and No, and is safe to run twice', () => {
    const old = {
      spells: [
        { name: 'Heal', up: 'yes', off: 'N' },
        { name: 'Fire Starter', up: 'NO', off: '*' },
      ],
    };
    const once = migrate(old, 3) as { spells: { up: string; off: string }[] };
    expect(once.spells.map((spell) => [spell.up, spell.off])).toEqual([
      ['Yes', 'No'],
      ['No', '*'],
    ]);
    expect(migrate(once, 3)).toEqual(once);
  });

  it('moves a page reference from weapon and armor notes into their page, and is safe to run twice', () => {
    const old = {
      rangedWeapons: [{ name: 'Blunderbuss', notes: 'Rifle, p. 261. Mod –2 (one hand)' }],
      meleeWeapons: [
        { name: 'Axe', notes: 'Hand Weapon, p. 253' },
        { name: 'Club', notes: 'see p. 4 later' },
      ],
      armor: [{ name: 'Exemplar Plate', notes: 'KNG 364' }],
      stored: [{ kind: 'armor', name: 'Full Plate', notes: 'p. 252', page: '' }],
      steamjacks: [{ meleeWeapons: [{ name: 'Halberd', notes: 'p. 307. Reach' }] }],
    };
    type Rows = { notes: string; page?: string }[];
    const once = migrate(old, 4) as Record<string, Rows> & { steamjacks: { meleeWeapons: Rows }[] };
    expect(once.rangedWeapons[0]).toMatchObject({ notes: 'Rifle. Mod –2 (one hand)', page: '261' });
    expect(once.meleeWeapons).toMatchObject([{ notes: 'Hand Weapon', page: '253' }, { notes: 'see p. 4 later' }]);
    expect(once.meleeWeapons[1].page).toBeUndefined();
    expect(once.armor[0]).toMatchObject({ notes: '', page: 'KNG 364' });
    expect(once.stored[0]).toMatchObject({ notes: '', page: '252' });
    expect(once.steamjacks[0].meleeWeapons[0]).toMatchObject({ notes: 'Reach', page: '307' });
    expect(migrate(once, 4)).toEqual(once);
  });

  it('leaves current data and non-objects alone', () => {
    const current = { mechanika: [] };
    expect(migrate(current, 5)).toBe(current);
    expect(migrate(null, 1)).toBeNull();
  });
});
