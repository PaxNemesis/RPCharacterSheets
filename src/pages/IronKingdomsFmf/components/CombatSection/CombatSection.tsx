import { useMemo } from 'react'
import { Panel } from '@/components/Panel'
import { RepeatTable, type RepeatTableRowAction } from '@/components/RepeatTable'
import { useSheet } from '@/components/SheetProvider'
import { useIkCharacter } from '../../hooks/useIkCharacter'
import type { IkStoredKind } from '../../types'
import { toStored } from '../../utils/storage'
import {
  createMeleeWeapon,
  createRangedWeapon,
  meleeWeaponColumns,
  rangedWeaponColumns,
} from '../../utils/weaponColumns'
import { meleePresets, rangedPresets } from '../../utils/weaponPresets'
import { StoredEquipment } from '../StoredEquipment'
import { DamagePanel } from './components'

export function CombatSection() {
  const { character, derived } = useIkCharacter()
  const { stat } = derived
  const { settings, skills } = character
  const { set } = useSheet()
  const store = (kind: IkStoredKind): RepeatTableRowAction => ({
    icon: 'archive',
    label: 'Store',
    title: 'Move to stored weapons',
    onClick: (row) => set('stored', [...character.stored, toStored(kind, row)]),
  })
  // Presets read the books in use and the character's skill levels, not the rest of the sheet.
  const ranged = useMemo(() => rangedWeaponColumns(stat, false, rangedPresets({ settings, skills })), [stat, settings, skills])
  const melee = useMemo(() => meleeWeaponColumns(stat, false, meleePresets({ settings, skills })), [stat, settings, skills])

  return (
    <div className="ik-section">
      <Panel title="Ranged weapons">
        <p className="ik-note">
          RAT = POI (PRW for thrown weapons) + skill + mod. Pick a weapon from the rulebooks by name to fill in its
          values and your skill level.
        </p>
        <RepeatTable path="rangedWeapons" columns={ranged} createRow={createRangedWeapon} itemName="ranged weapon" rowAction={store('ranged')} />
      </Panel>
      <Panel title="Melee weapons">
        <p className="ik-note">
          MAT = PRW + skill + mod. P+S = POW + STR. Pick a weapon from the rulebooks by name to fill in its values and
          your skill level.
        </p>
        <RepeatTable path="meleeWeapons" columns={melee} createRow={createMeleeWeapon} itemName="melee weapon" rowAction={store('melee')} />
      </Panel>
      <Panel title="Stored weapons">
        <StoredEquipment
          kinds={['ranged', 'melee']}
          emptyText="Store a weapon you aren't using to keep it here with its values. It can be equipped again or swapped for a ready weapon."
        />
      </Panel>
      <DamagePanel character={character} derived={derived} />
    </div>
  )
}
