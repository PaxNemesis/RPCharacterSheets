import { describe, expect, it } from 'vitest'
import type { FuItem } from '../../../types'
import { createItem } from '../../../utils/createCharacter'
import { addForm, currentForm, formLabel, hasForms, nextForm, removeForm, switchForm } from '../utils/forms'

const dagger: FuItem = { ...createItem('weapon'), name: 'Eyre', category: 'Dagger', range: 'melee', damage: 5 }

describe('forms', () => {
  it('adds a second form as a copy of the first and switches to it', () => {
    const item = addForm(dagger)
    expect(hasForms(item)).toBe(true)
    expect(currentForm(item)).toBe(1)
    expect(item).toMatchObject({ name: 'Eyre', category: 'Dagger', damage: 5 })
    expect([formLabel(item, 0), formLabel(item, 1)]).toEqual(['Form I', 'Form II'])
  })

  it("keeps each form's own stats when switching between them", () => {
    const gun = { ...addForm(dagger), category: 'Firearm', range: 'ranged' as const, damage: 10 }
    const back = switchForm(gun, 0)
    expect(back).toMatchObject({ name: 'Eyre', category: 'Dagger', range: 'melee', damage: 5, form: 0 })
    expect(switchForm(back, 1)).toMatchObject({ category: 'Firearm', range: 'ranged', damage: 10, form: 1 })
  })

  it('cycles to the next form and keeps custom form names', () => {
    const item = addForm(addForm(dagger))
    expect([nextForm(switchForm(item, 0)), nextForm(item)]).toEqual([1, 0])
    const named = { ...item, forms: item.forms?.map((form, index) => (index === 2 ? { ...form, label: 'Gun' } : form)) }
    expect(formLabel(named)).toBe('Gun')
  })

  it('becomes an ordinary item again when only one form is left', () => {
    const gun = { ...addForm(dagger), damage: 10 }
    const single = removeForm(gun)
    expect(single).not.toHaveProperty('forms')
    expect(single).toMatchObject({ category: 'Dagger', damage: 5 })
  })
})
