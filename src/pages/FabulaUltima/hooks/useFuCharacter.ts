import { useMemo } from 'react';
import { useSheet } from '@/components/SheetProvider';
import type { FuCharacter } from '../types';
import { calculate } from '../utils/calculate';

/** The open character and its derived values. Use at the sheet root, not inside a scoped SheetProvider. */
export const useFuCharacter = () => {
  const { get } = useSheet();
  const character = get('') as FuCharacter;
  const derived = useMemo(() => calculate(character), [character]);
  return { character, derived };
};
