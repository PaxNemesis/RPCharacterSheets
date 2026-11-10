import { useMemo } from 'react'
import { Panel } from '@/components/Panel'
import { RepeatTable, type RepeatTableColumn, type RepeatTableRowAction } from '@/components/RepeatTable'
import { useSheet } from '@/components/SheetProvider'
import { useIkCharacter } from '../../hooks/useIkCharacter'
import type { IkGear, IkStoredKind } from '../../types'
import { createArmor } from '../../utils/createCharacter'
import { toStored } from '../../utils/storage'
import { createMeleeWeapon, createRangedWeapon, meleeWeaponColumns, rangedWeaponColumns } from '../../utils/weaponColumns'
import { meleePresets, rangedPresets } from '../../utils/weaponPresets'
import { StoredEquipment } from './components'

const GEAR_COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Name', width: 'minmax(140px, 1fr)' },
  { key: 'notes', label: 'Benefit / notes', width: 'minmax(200px, 3fr)', rows: 2 },
  { key: 'quantity', label: 'Qty', width: '56px', type: 'number' },
]

const ARMOR_COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Name', width: 'minmax(140px, 1fr)' },
  { key: 'spd', label: 'SPD', width: '52px', type: 'number' },
  { key: 'def', label: 'DEF', width: '52px', type: 'number' },
  { key: 'arm', label: 'ARM', width: '52px', type: 'number' },
  { key: 'notes', label: 'Description / notes', width: 'minmax(200px, 3fr)', rows: 2 },
]

const createGear = (): IkGear => ({ name: '', notes: '', quantity: null })

/** Weapons, armor and other gear, with the weapons and armor that are stored under each table. */
export function EquipmentSection() {
  const { character, derived } = useIkCharacter()
  const { set } = useSheet()
  const { stat } = derived
  const { settings, skills } = character
  // Presets read the books in use and the character's skill levels, not the rest of the sheet.
  const ranged = useMemo(() => rangedWeaponColumns(stat, false, rangedPresets({ settings, skills })), [stat, settings, skills])
  const melee = useMemo(() => meleeWeaponColumns(stat, false, meleePresets({ settings, skills })), [stat, settings, skills])
  const store = (kind: IkStoredKind): RepeatTableRowAction => ({
    icon: 'archive',
    label: 'Store',
    title: kind === 'armor' ? 'Take off and store' : 'Store',
    onClick: (row) => set('stored', [...character.stored, toStored(kind, row)]),
  })

  return (
    <div className="ik-section">
      <p className="ik-note">
        Store a weapon or armor you aren&apos;t using to keep it with its values under its table. Stored items don&apos;t
        count toward any stats; equip one again, or swap it for one in use.
      </p>
      <Panel title="Ranged weapons">
        <p className="ik-note">
          RAT = POI (PRW for thrown weapons) + skill + mod. Pick a weapon from the rulebooks by name to fill in its
          values and your skill level.
        </p>
        <RepeatTable path="rangedWeapons" columns={ranged} createRow={createRangedWeapon} itemName="ranged weapon" rowAction={store('ranged')} />
        <StoredEquipment kind="ranged" />
      </Panel>
      <Panel title="Melee weapons">
        <p className="ik-note">
          MAT = PRW + skill + mod. P+S = POW + STR. Pick a weapon from the rulebooks by name to fill in its values and
          your skill level.
        </p>
        <RepeatTable path="meleeWeapons" columns={melee} createRow={createMeleeWeapon} itemName="melee weapon" rowAction={store('melee')} />
        <StoredEquipment kind="melee" />
      </Panel>
      <Panel title="Worn armor">
        <p className="ik-note">
          The DEF and ARM modifiers of everything listed here are added to DEF and ARM on the Character tab. The SPD
          modifier changes your movement, not your DEF or Initiative.
        </p>
        <RepeatTable path="armor" columns={ARMOR_COLUMNS} createRow={createArmor} itemName="armor" rowAction={store('armor')} />
        <StoredEquipment kind="armor" showUnknown />
      </Panel>
      <Panel title="Gear">
        <RepeatTable path="gear" columns={GEAR_COLUMNS} createRow={createGear} itemName="item" />
      </Panel>
    </div>
  )
}
