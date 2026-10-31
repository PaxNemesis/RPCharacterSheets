import { useSheet } from '@/components/SheetProvider'
import { BASIC_DEFENSIVE_ITEMS, BASIC_WEAPONS } from '../../../../../constants/equipment'
import type { ItemKind } from '../../../../../types'
import { itemFromDefensive, itemFromWeapon } from '../utils/itemFromRulebook'

type ItemPickerProps = {
  kinds: ItemKind[]
  slotLabel: string
}

/** Replaces the slot's item with a basic item from the core rules. */
export function ItemPicker({ kinds, slotLabel }: ItemPickerProps) {
  const { set } = useSheet()
  const weapons = kinds.includes('weapon') ? BASIC_WEAPONS : []
  const defensive = BASIC_DEFENSIVE_ITEMS.filter((item) => kinds.includes(item.kind))
  if (weapons.length + defensive.length === 0) return null

  const pick = (value: string) => {
    const [type, index] = value.split(':')
    if (type === 'weapon') set('', itemFromWeapon(weapons[Number(index)]))
    if (type === 'defensive') set('', itemFromDefensive(defensive[Number(index)]))
  }

  return (
    <select aria-label={`Fill ${slotLabel.toLowerCase()} from rulebook`} value="" onChange={(event) => pick(event.target.value)}>
      <option value="">Fill from rulebook…</option>
      {weapons.length > 0 && (
        <optgroup label="Basic weapons">
          {weapons.map((weapon, index) => (
            <option key={weapon.name} value={`weapon:${index}`}>
              {weapon.name} ({weapon.category}, p. {weapon.page})
            </option>
          ))}
        </optgroup>
      )}
      {defensive.length > 0 && (
        <optgroup label={kinds.includes('armor') ? 'Basic armor' : 'Basic shields'}>
          {defensive.map((item, index) => (
            <option key={item.name} value={`defensive:${index}`}>
              {item.name} (p. {item.page})
            </option>
          ))}
        </optgroup>
      )}
    </select>
  )
}
