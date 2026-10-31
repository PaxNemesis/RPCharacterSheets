import { NumberField } from '@/components/NumberField'
import { SelectField } from '@/components/SelectField'
import { TextField } from '@/components/TextField'
import { ATTRIBUTE_KEYS, ATTRIBUTES } from '../../../../../constants/attributes'
import { BASIC_WEAPONS } from '../../../../../constants/equipment'
import type { FuDerived, FuItem } from '../../../../../types'

const CATEGORIES = [...new Set(BASIC_WEAPONS.map((weapon) => weapon.category))]
const DAMAGE_TYPES = ['physical', 'air', 'bolt', 'dark', 'earth', 'fire', 'ice', 'light', 'poison']
const ATTRIBUTE_OPTIONS = ATTRIBUTE_KEYS.map((key) => ({ value: key, label: ATTRIBUTES[key].short }))
const HANDS = [
  { value: '', label: '—' },
  { value: 'one', label: 'One-handed' },
  { value: 'two', label: 'Two-handed' },
]
const RANGES = [
  { value: '', label: '—' },
  { value: 'melee', label: 'Melee' },
  { value: 'ranged', label: 'Ranged' },
]

type WeaponFieldsProps = {
  item: FuItem
  derived: FuDerived
}

export function WeaponFields({ item, derived }: WeaponFieldsProps) {
  const a = ATTRIBUTES[item.accuracyA]?.short ?? '?'
  const b = ATTRIBUTES[item.accuracyB]?.short ?? '?'
  const bonus = item.accuracyBonus ? ` ${item.accuracyBonus > 0 ? '+' : '−'} ${Math.abs(item.accuracyBonus)}` : ''
  const dice = `d${derived.current(item.accuracyA)} + d${derived.current(item.accuracyB)}`

  return (
    <>
      <div className="fu-fields">
        <TextField path="category" label="Category" suggestions={CATEGORIES} />
        <SelectField path="hands" label="Hands" options={HANDS} />
        <SelectField path="range" label="Range" options={RANGES} />
        <SelectField path="accuracyA" label="Accuracy" options={ATTRIBUTE_OPTIONS} />
        <SelectField path="accuracyB" label="+ attribute" options={ATTRIBUTE_OPTIONS} />
        <NumberField path="accuracyBonus" label="Accuracy bonus" />
        <NumberField path="damage" label="Damage (HR +)" />
        <TextField path="damageType" label="Damage type" suggestions={DAMAGE_TYPES} />
      </div>
      <p className="fu-note">
        Accuracy: 【{a} + {b}】{bonus}, now {dice}
        {bonus}. Damage: 【HR + {item.damage ?? 0}】 {item.damageType}.
      </p>
    </>
  )
}
