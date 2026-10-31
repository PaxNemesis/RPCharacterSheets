import { useMemo } from 'react'
import { Panel } from '@/components/Panel'
import { RepeatTable } from '@/components/RepeatTable'
import { useIkCharacter } from '../../hooks/useIkCharacter'
import {
  createMeleeWeapon,
  createRangedWeapon,
  meleeWeaponColumns,
  rangedWeaponColumns,
} from '../../utils/weaponColumns'
import { DamagePanel } from './components'

export function CombatSection() {
  const { character, derived } = useIkCharacter()
  const { stat } = derived
  const ranged = useMemo(() => rangedWeaponColumns(stat), [stat])
  const melee = useMemo(() => meleeWeaponColumns(stat), [stat])

  return (
    <div className="ik-section">
      <Panel title="Ranged weapons">
        <p className="ik-note">RAT = POI (PRW for thrown weapons) + skill + mod.</p>
        <RepeatTable path="rangedWeapons" columns={ranged} createRow={createRangedWeapon} itemName="ranged weapon" />
      </Panel>
      <Panel title="Melee weapons">
        <p className="ik-note">MAT = PRW + skill + mod. P+S = POW + STR.</p>
        <RepeatTable path="meleeWeapons" columns={melee} createRow={createMeleeWeapon} itemName="melee weapon" />
      </Panel>
      <DamagePanel character={character} derived={derived} />
    </div>
  )
}
