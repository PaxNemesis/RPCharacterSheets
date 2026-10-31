import { useMemo } from 'react'
import { useSheet } from '@/components/SheetProvider'
import type { IkCharacter } from '../IronKingdomsFmf.types'
import { calculate } from '../utils/calculate'

/** The open character and its derived values. Use at the sheet root, not inside a scoped SheetProvider. */
export const useIkCharacter = () => {
  const { get } = useSheet()
  const character = get('') as IkCharacter
  const derived = useMemo(() => calculate(character), [character])
  return { character, derived }
}
