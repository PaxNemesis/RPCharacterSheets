import { describe, expect, it } from 'vitest';
import { FAITHS } from '../constants/faiths';
import { NATIONALITIES } from '../constants/nationalities';
import { compareNames } from '@/utils/alphabetical';

describe('suggestion lists', () => {
  it.each([
    ['nationalities', NATIONALITIES],
    ['faiths', FAITHS],
  ])('lists the %s alphabetically', (_, list) => {
    expect(list).toEqual([...list].sort(compareNames));
  });
});
