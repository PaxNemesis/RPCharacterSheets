import { useState } from 'react'
import { Panel } from '@/components/Panel'
import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable'
import { useSheet } from '@/components/SheetProvider'
import { TASTES } from '../../../constants/gourmet'
import type { FuGourmet, FuIngredient } from '../../../types'
import { rollDie } from '@/utils/rollDie'

const COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Ingredient', width: 'minmax(160px, 2fr)' },
  {
    key: 'taste',
    label: 'Taste',
    width: 'minmax(110px, 1fr)',
    type: 'select',
    options: [{ value: '', label: 'Choose…' }, ...TASTES.map((taste) => ({ value: taste.key, label: taste.label }))],
  },
  { key: 'quantity', label: 'Qty', width: '64px', type: 'number' },
]

const createIngredient = (): FuIngredient => ({ name: '', taste: '', quantity: 1 })

type IngredientsPanelProps = {
  gourmet: FuGourmet
  /** Skill Level in Cooking, which sets how many ingredients can be carried. */
  cooking: number
}

export function IngredientsPanel({ gourmet, cooking }: IngredientsPanelProps) {
  const { set } = useSheet()
  const [lastRoll, setLastRoll] = useState<string>()
  const count = (ingredient: FuIngredient) => ingredient.quantity ?? 1
  const total = gourmet.ingredients.reduce((sum, ingredient) => sum + count(ingredient), 0)
  const capacity = 10 + cooking * 5
  const byTaste = TASTES.map((taste) => ({
    ...taste,
    amount: gourmet.ingredients.filter((ingredient) => ingredient.taste === taste.key).reduce((sum, i) => sum + count(i), 0),
  }))

  // A new ingredient's taste is a d6 roll; a 6 lets the player choose (NF p. 150).
  const roll = () => {
    const result = rollDie(6)
    const taste = TASTES[result - 1]
    set('gourmet.ingredients', [...gourmet.ingredients, { ...createIngredient(), taste: taste?.key ?? '' }])
    setLastRoll(taste ? `Rolled ${result}: ${taste.label}. Give it a name.` : 'Rolled 6: choose its taste and give it a name.')
  }

  return (
    <Panel
      title="Gathered ingredients"
      actions={
        <button type="button" onClick={roll} title="Add an ingredient with a random taste">
          Roll taste
        </button>
      }
    >
      <p className={total > capacity ? 'fu-warning' : 'fu-note'}>
        {total} of at most {capacity} ingredients (10 + 5 × Cooking SL, NF p. 149).{' '}
        {byTaste.map((taste) => `${taste.label} ${taste.amount}`).join(' · ')}
      </p>
      {lastRoll && (
        <p className="fu-note" role="status">
          {lastRoll}
        </p>
      )}
      <RepeatTable path="gourmet.ingredients" columns={COLUMNS} createRow={createIngredient} itemName="ingredient" />
    </Panel>
  )
}
