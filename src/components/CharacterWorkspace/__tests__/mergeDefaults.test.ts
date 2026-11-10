import { describe, expect, it } from 'vitest';
import { mergeDefaults } from '../utils/mergeDefaults';

const defaults = { name: '', level: 1, xp: null as number | null, alive: true, items: [{ name: '', qty: 1 }] };

describe('mergeDefaults', () => {
  it('returns the defaults when there is no data', () => {
    expect(mergeDefaults(defaults, undefined)).toBe(defaults);
  });

  it('fills in missing fields and keeps unknown ones', () => {
    expect(mergeDefaults(defaults, { name: 'Ana', extra: 'kept' })).toEqual({
      ...defaults,
      name: 'Ana',
      extra: 'kept',
    });
  });

  it('replaces values of the wrong type with the default', () => {
    const merged = mergeDefaults(defaults, { name: 42, level: 'high', alive: 'yes' });
    expect(merged).toMatchObject({ name: '', level: 1, alive: true });
  });

  it('lets a number field be cleared and a null field take any primitive', () => {
    expect(mergeDefaults(defaults, { level: null, xp: '12' })).toMatchObject({ level: null, xp: '12' });
    expect(mergeDefaults(defaults, { xp: { nested: true } }).xp).toBeNull();
  });

  it('drops list entries of the wrong kind and completes the rest', () => {
    const merged = mergeDefaults(defaults, { items: [{ name: 'Rope' }, 'junk', null] });
    expect(merged.items).toEqual([{ name: 'Rope', qty: 1 }]);
  });

  it('uses the list item template from items when there is one', () => {
    const merged = mergeDefaults({ tags: [] as { label: string }[] }, { tags: [{}] }, { tags: { label: '' } });
    expect(merged.tags).toEqual([{ label: '' }]);
  });
});
