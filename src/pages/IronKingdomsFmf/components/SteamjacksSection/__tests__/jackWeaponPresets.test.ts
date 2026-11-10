import { describe, expect, it } from 'vitest';
import { createCharacter } from '../../../utils/createCharacter';
import { createMeleeWeapon, createRangedWeapon } from '../../../utils/weaponColumns';
import { jackMeleePresets, jackRangedPresets } from '../utils/jackWeaponPresets';

const { settings } = createCharacter();
const light = { size: 'light' as const, chassis: 'Talon' };
const heavy = { size: 'heavy' as const, chassis: 'Nomad' };

describe('steamjack weapon presets', () => {
  it('offers only weapons the jack’s size can use', () => {
    expect(jackRangedPresets(settings, light).names).toContain('Light Gun');
    expect(jackRangedPresets(settings, light).names).not.toContain('Cannon');
    expect(jackRangedPresets(settings, heavy).names).toContain('Cannon');
    expect(jackRangedPresets(settings, heavy).names).not.toContain('Light Gun');
  });

  it('fills in a heavy jack’s values where they differ, and the page and limits as notes', () => {
    const halberd = jackMeleePresets(settings, heavy).pick('halberd', createMeleeWeapon());
    expect(halberd).toMatchObject({ name: 'Halberd', attackMod: 0, pow: 6, notes: 'p. 307. Reach' });
    expect(jackMeleePresets(settings, light).pick('Halberd', createMeleeWeapon())).toMatchObject({ pow: 4 });
    const flamer = jackRangedPresets(settings, heavy).pick('Flamethrower', createRangedWeapon());
    expect(flamer).toMatchObject({ rng: 'SP 10', ammo: '10', pow: 12 });
  });

  it('offers a chassis’s own weapons only to that chassis, and picks the version that fits', () => {
    const devastator = { size: 'heavy' as const, chassis: 'Devastator' };
    expect(jackRangedPresets(settings, devastator).names).toContain('Shoulder Cannons');
    expect(jackRangedPresets(settings, heavy).names).not.toContain('Shoulder Cannons');
    expect(jackMeleePresets(settings, devastator).pick('Shield Fist', createMeleeWeapon())).toMatchObject({ pow: 4 });
    expect(
      jackMeleePresets(settings, { size: 'light', chassis: 'Repenter' }).pick('Shield Fist', createMeleeWeapon()),
    ).toMatchObject({
      pow: 2,
    });
  });

  it('sets a fixed location, keeps the row’s own otherwise, and leaves out books that are off', () => {
    const row = { ...createRangedWeapon(), location: 'R' };
    expect(jackRangedPresets(settings, light).pick('Grenade Launcher', row)).toMatchObject({ location: 'L' });
    expect(jackRangedPresets(settings, light).pick('Harpoon', row)).toMatchObject({ location: 'R' });
    const coreOnly = { ...settings, books: { kng: false, ua: false } };
    expect(jackRangedPresets(coreOnly, light).names).not.toContain('Grenade Launcher');
  });
});
