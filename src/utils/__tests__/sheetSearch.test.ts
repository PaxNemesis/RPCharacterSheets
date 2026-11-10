import { describe, expect, it } from 'vitest';
import { validateSheetSearch } from '../sheetSearch';

describe('validateSheetSearch', () => {
  it('keeps a panel name and drops everything else', () => {
    expect(validateSheetSearch({ panel: 'steamjacks', other: '1' })).toEqual({ panel: 'steamjacks' });
    expect(validateSheetSearch({ panel: '' })).toEqual({});
    expect(validateSheetSearch({ panel: 3 })).toEqual({});
    expect(validateSheetSearch({})).toEqual({});
  });
});
