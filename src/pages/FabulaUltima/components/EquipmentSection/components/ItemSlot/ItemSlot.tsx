import { CheckboxField } from '@/components/CheckboxField'
import { Panel } from '@/components/Panel'
import { SelectField } from '@/components/SelectField'
import { SheetProvider } from '@/components/SheetProvider'
import { TextField } from '@/components/TextField'
import type { FuDerived, FuItem, ItemKind, SlotKey } from '../../../../types'
import { DefenseFields, ItemPicker, WeaponFields } from './components'

const KIND_LABELS: Record<ItemKind, string> = {
  '': 'Empty',
  weapon: 'Weapon',
  shield: 'Shield',
  armor: 'Armor',
  accessory: 'Accessory',
}

type ItemSlotProps = {
  slot: { key: SlotKey; label: string; kinds: ItemKind[] }
  item: FuItem
  derived: FuDerived
}

export function ItemSlot({ slot, item, derived }: ItemSlotProps) {
  const choosesKind = slot.kinds.length > 1

  return (
    <SheetProvider path={`equipment.${slot.key}`}>
      <Panel title={slot.label} actions={<ItemPicker kinds={slot.kinds} slotLabel={slot.label} />}>
        {choosesKind && (
          <SelectField
            path="kind"
            label="Holding"
            options={slot.kinds.map((kind) => ({ value: kind, label: KIND_LABELS[kind] }))}
          />
        )}
        {item.kind !== '' && (
          <>
            <TextField path="name" label="Name" placeholder={item.kind === 'armor' ? 'No armor' : undefined} />
            <CheckboxField path="martial" label="Martial" />
            {item.kind === 'weapon' && <WeaponFields item={item} derived={derived} />}
            <DefenseFields isArmor={item.kind === 'armor'} />
            <TextField path="quality" label="Quality & notes" rows={2} />
          </>
        )}
      </Panel>
    </SheetProvider>
  )
}
