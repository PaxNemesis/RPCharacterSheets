import type { FuItem, FuItemForm } from '../../../types'

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

/** "Form I", "Form II", … like the rulebooks. */
export const defaultFormLabel = (index: number) => `Form ${NUMERALS[index] ?? index + 1}`

/** The current form's index, kept in range for hand-edited or older saves. */
export const currentForm = (item: FuItem) => Math.min(Math.max(item.form ?? 0, 0), Math.max((item.forms?.length ?? 1) - 1, 0))

export const hasForms = (item: FuItem) => (item.forms?.length ?? 0) > 1

export const formLabel = (item: FuItem, index = currentForm(item)) =>
  item.forms?.[index]?.label.trim() || defaultFormLabel(index)

/** The stats that belong to the current form: everything but the shared name and kind. */
function snapshot(item: FuItem, label: string): FuItemForm {
  const { kind: _kind, name: _name, forms: _forms, form: _form, ...stats } = item
  return { label, ...stats }
}

/** Saves the current stats into the forms list, so another form can be loaded or added. */
function saved(item: FuItem): FuItemForm[] {
  const index = currentForm(item)
  const forms = item.forms?.length ? item.forms : []
  return forms.length === 0
    ? [snapshot(item, defaultFormLabel(0))]
    : forms.map((form, other) => (other === index ? snapshot(item, form.label) : form))
}

function load(item: FuItem, forms: FuItemForm[], index: number): FuItem {
  const { label: _label, ...stats } = forms[index]
  return { ...item, ...stats, forms, form: index }
}

/** Switches the item to another of its forms. */
export function switchForm(item: FuItem, index: number): FuItem {
  return index === currentForm(item) || !item.forms?.[index] ? item : load(item, saved(item), index)
}

/** The form after the current one, wrapping around: what the slot's switch button changes to. */
export const nextForm = (item: FuItem) => (currentForm(item) + 1) % (item.forms?.length || 1)

/** Adds a form that starts as a copy of the current one, and switches to it for editing. */
export function addForm(item: FuItem): FuItem {
  const forms = saved(item)
  return load(item, [...forms, snapshot(item, defaultFormLabel(forms.length))], forms.length)
}

/** Removes the current form and loads a neighbour; with one form left, it's an ordinary item again. */
export function removeForm(item: FuItem): FuItem {
  const index = currentForm(item)
  const forms = saved(item).filter((_, other) => other !== index)
  if (forms.length > 1) return load(item, forms, Math.min(index, forms.length - 1))
  const { forms: _forms, form: _form, ...single } = load(item, forms, 0)
  return single
}
