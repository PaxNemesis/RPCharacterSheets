import { useMemo } from 'react'
import { ImageField } from '@/components/ImageField'
import { Panel } from '@/components/Panel'
import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable'
import { useSheet } from '@/components/SheetProvider'
import { TextField } from '@/components/TextField'
import type { IkSteamjack, StatKey } from '../../../IronKingdomsFmf.types'
import { createMeleeWeapon, createRangedWeapon, meleeWeaponColumns, rangedWeaponColumns } from '../../../utils/weaponColumns'
import { JackDamageGrid } from './JackDamageGrid'
import { JackStatsPanel } from './JackStatsPanel'

const CATASTROPHIC_COLUMNS: RepeatTableColumn[] = [
  { key: 'area', label: 'Area damaged', width: 'minmax(140px, 1fr)' },
  { key: 'notes', label: 'Description / notes', width: 'minmax(200px, 3fr)', rows: 2 },
]
const GEAR_COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Name', width: 'minmax(140px, 1fr)' },
  { key: 'notes', label: 'Description / notes', width: 'minmax(200px, 3fr)', rows: 2 },
]
const POWER_ATTACK_COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Name', width: 'minmax(140px, 1fr)' },
  { key: 'description', label: 'Requirement / roll / effect', width: 'minmax(200px, 3fr)', rows: 2 },
]

/** One steamjack; rendered inside a SheetProvider scoped to `steamjacks.<index>`. */
export function SteamjackSheet() {
  const { get } = useSheet()
  const jack = get('') as IkSteamjack
  const stats = jack.stats

  const columns = useMemo(() => {
    const stat = (key: StatKey) => (key === 'arc' ? null : (stats[key] ?? null))
    return { ranged: rangedWeaponColumns(stat, true), melee: meleeWeaponColumns(stat, true) }
  }, [stats])

  return (
    <div className="ik-section">
      <Panel title="Steamjack">
        <div className="ik-fields">
          <TextField path="name" label="Name" />
          <TextField path="chassis" label="Chassis type" />
          <TextField path="height" label="Height" />
          <TextField path="weight" label="Weight" />
          <TextField path="fuelLoad" label="Max fuel load" />
          <TextField path="fuelUse" label="Fuel consumption" />
        </div>
      </Panel>
      <div className="ik-columns">
        <Panel title="Image">
          <ImageField path="image" label="Steamjack image" />
        </Panel>
        <JackStatsPanel jack={jack} />
      </div>
      <div className="ik-columns">
        <JackDamageGrid />
        <Panel title="Cortex">
          <TextField path="cortex.imprint" label="Imprint" />
          <TextField path="cortex.fightingBonus" label="Fighting bonus" />
          <TextField path="cortex.language" label="Language" />
          <TextField path="cortex.notes" label="Notes" rows={3} />
        </Panel>
      </div>
      <Panel title="Ranged weapons">
        <RepeatTable path="rangedWeapons" columns={columns.ranged} createRow={createRangedWeapon} itemName="ranged weapon" />
      </Panel>
      <Panel title="Melee weapons">
        <RepeatTable path="meleeWeapons" columns={columns.melee} createRow={createMeleeWeapon} itemName="melee weapon" />
      </Panel>
      <Panel title="Catastrophic damage">
        <RepeatTable
          path="catastrophic"
          columns={CATASTROPHIC_COLUMNS}
          createRow={() => ({ area: '', notes: '' })}
          itemName="entry"
        />
      </Panel>
      <Panel title="Gear & upgrades">
        <RepeatTable path="gear" columns={GEAR_COLUMNS} createRow={() => ({ name: '', notes: '' })} itemName="upgrade" />
      </Panel>
      <Panel title="Power attacks & special abilities">
        <RepeatTable
          path="powerAttacks"
          columns={POWER_ATTACK_COLUMNS}
          createRow={() => ({ name: '', description: '' })}
          itemName="power attack"
        />
      </Panel>
    </div>
  )
}
