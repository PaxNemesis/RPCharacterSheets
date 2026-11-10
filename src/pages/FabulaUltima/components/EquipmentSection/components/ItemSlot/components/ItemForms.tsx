/* oxlint-disable react/no-array-index-key -- Form buttons hold no state of their own, so a key moving to the next form is harmless. */
import { Icon } from '@/components/Icon'
import { TextField } from '@/components/TextField'
import type { FuItem } from '../../../../../types'
import { addForm, currentForm, formLabel, hasForms, removeForm, switchForm } from '../../../utils/forms'

type ItemFormsProps = {
  item: FuItem
  onChange: (item: FuItem) => void
}

/** The forms of an item that transforms: pick the form to edit, rename it, add or remove forms. */
export function ItemForms({ item, onChange }: ItemFormsProps) {
  const add = (
    <button type="button" onClick={() => onChange(addForm(item))} title="Add a form" aria-label="Add a form">
      <Icon name="add" className="equipment-section-icon" />
    </button>
  )
  if (!hasForms(item)) {
    return (
      <div className="item-slot-forms">
        <div className="item-slot-actions">{add}</div>
        <span className="fu-note">Add a form for equipment that transforms, such as a gunbrella.</span>
      </div>
    )
  }

  const current = currentForm(item)
  const label = formLabel(item)
  const remove = () => {
    if (window.confirm(`Delete ${label}? Its stats will be removed from the item.`)) onChange(removeForm(item))
  }

  return (
    <>
      <div className="item-slot-forms">
        <div className="item-slot-actions" role="group" aria-label="Forms">
          {item.forms?.map((_, index) => (
            <button key={index} type="button" aria-pressed={index === current} onClick={() => onChange(switchForm(item, index))}>
              {formLabel(item, index)}
            </button>
          ))}
          {add}
        </div>
        <TextField path={`forms.${current}.label`} label="Form name" className="item-slot-form-name" />
        <div className="item-slot-actions">
          <button type="button" className="item-slot-delete" onClick={remove} title="Delete this form" aria-label={`Delete ${label}`}>
            <Icon name="delete" className="equipment-section-icon" />
          </button>
        </div>
      </div>
      <p className="fu-note">The fields below are {label}’s stats. Switching forms on the slot keeps each form’s stats.</p>
    </>
  )
}
