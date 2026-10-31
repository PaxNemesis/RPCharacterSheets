import { NumberField } from '@/components/NumberField'

type DefenseFieldsProps = {
  /** Armor can replace the DEX die with a fixed Defense. */
  isArmor: boolean
}

export function DefenseFields({ isArmor }: DefenseFieldsProps) {
  return (
    <div className="fu-fields">
      {isArmor && <NumberField path="defense" label="Fixed Defense" />}
      <NumberField path="defenseBonus" label="Defense +" />
      <NumberField path="magicDefenseBonus" label="Magic Def. +" />
      <NumberField path="initiative" label="Initiative" />
      {isArmor && <p className="fu-note fu-wide">Leave Fixed Defense blank for armor that adds to your DEX die.</p>}
    </div>
  )
}
