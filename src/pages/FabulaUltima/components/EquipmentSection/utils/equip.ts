import { SLOTS } from '../../../constants/slots'
import type { FuCharacter, FuItem, SlotKey } from '../../../types'
import { createItem } from '../../../utils/createCharacter'

type Gear = Pick<FuCharacter, 'equipment' | 'stored'>

const emptyFor = (slot: SlotKey) => createItem(slot === 'armor' ? 'armor' : slot === 'accessory' ? 'accessory' : '')

/** Whether the slot holds anything worth keeping: an empty armor slot still has kind 'armor'. */
export const hasContent = (item: FuItem) =>
  item.kind !== '' &&
  Boolean(
    item.name.trim() ||
      item.quality.trim() ||
      item.defense !== null ||
      item.defenseBonus ||
      item.magicDefenseBonus ||
      item.initiative ||
      (item.kind === 'weapon' && item.damage !== null),
  )

const isTwoHanded = (item: FuItem) => item.kind === 'weapon' && item.hands === 'two'

/** The slots a stored item can be equipped to; a two-handed weapon only goes in the main hand. */
export const slotsFor = (item: FuItem): SlotKey[] =>
  isTwoHanded(item) ? ['mainHand'] : SLOTS.filter((slot) => slot.kinds.includes(item.kind)).map((slot) => slot.key)

/** Moves the slot's item into storage and empties the slot. */
export function unequip({ equipment, stored }: Gear, slot: SlotKey): Gear {
  return { equipment: { ...equipment, [slot]: emptyFor(slot) }, stored: [...stored, equipment[slot]] }
}

/**
 * Equips a stored item. Whatever the slot held goes into storage in its place; a two-handed weapon
 * also stores the off-hand item, since it uses both hands.
 */
export function equip({ equipment, stored }: Gear, index: number, slot: SlotKey): Gear {
  const item = stored[index]
  const displaced: SlotKey[] = [slot, ...(isTwoHanded(item) && slot === 'mainHand' ? (['offHand'] as const) : [])]
  const nextEquipment = { ...equipment, [slot]: item }
  const moved: FuItem[] = []
  for (const key of displaced) {
    if (hasContent(equipment[key])) moved.push(equipment[key])
    if (key !== slot) nextEquipment[key] = emptyFor(key)
  }
  return { equipment: nextEquipment, stored: [...stored.filter((_, other) => other !== index), ...moved] }
}
