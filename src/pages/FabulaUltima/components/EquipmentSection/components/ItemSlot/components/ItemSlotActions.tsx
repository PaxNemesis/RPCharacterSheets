import { Icon } from '@/components/Icon'

type ItemSlotActionsProps = {
  slotLabel: string
  /** The item's name, or the slot's when it has none. */
  label: string
  empty: boolean
  open: boolean
  editorId: string
  /** The form the switch button changes to; missing for items with one form. */
  nextForm?: string
  canUnequip: boolean
  canDelete: boolean
  onToggle: () => void
  onSwitch: () => void
  onUnequip: () => void
  onDelete: () => void
}

/** Edit, switch form, unequip and delete, joined into one button group. */
export function ItemSlotActions(props: ItemSlotActionsProps) {
  const { slotLabel, label, empty, open, editorId, nextForm, canUnequip, canDelete } = props
  const slot = slotLabel.toLowerCase()

  return (
    <div className="item-slot-actions" role="group" aria-label={`${slotLabel} actions`}>
      <button
        type="button"
        className="item-slot-edit"
        aria-expanded={open}
        aria-controls={editorId}
        aria-label={`${open ? 'Done editing' : empty ? 'Add to' : 'Edit'} ${slot}`}
        title={open ? 'Done' : empty ? 'Add' : 'Edit'}
        onClick={props.onToggle}
      >
        <Icon name={open ? 'check' : empty ? 'add' : 'edit'} className="equipment-section-icon" />
      </button>
      {nextForm && (
        <button type="button" onClick={props.onSwitch} title={`Switch to ${nextForm}`} aria-label={`Switch ${label} to ${nextForm}`}>
          <Icon name="swap_horiz" className="equipment-section-icon" />
        </button>
      )}
      {canUnequip && (
        <button type="button" onClick={props.onUnequip} title="Move to stored equipment in the backpack" aria-label={`Unequip ${label}`}>
          <Icon name="archive" className="equipment-section-icon" />
        </button>
      )}
      {canDelete && (
        <button type="button" className="item-slot-delete" onClick={props.onDelete} title="Delete" aria-label={`Delete ${label}`}>
          <Icon name="delete" className="equipment-section-icon" />
        </button>
      )}
    </div>
  )
}
