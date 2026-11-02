import { useState } from 'react'
import { Field } from '@/components/Field'
import { Icon } from '@/components/Icon'
import { Panel } from '@/components/Panel'
import { useSheet } from '@/components/SheetProvider'
import { TASTE_PAIRS, TASTES } from '../../../../constants/gourmet'
import type { FuGourmet, Taste } from '../../../../types'
import { delicacyPairs, effectOf, rollCombination } from '../../utils/delicacies'
import { PairEffect } from './components'
import './DelicacyPanel.styles.css'

const SLOTS = ['First ingredient', 'Second ingredient', 'Third ingredient (optional)']
const tasteLabel = (taste: string) => TASTES.find((entry) => entry.key === taste)?.label ?? 'No taste'

type DelicacyPanelProps = {
  gourmet: FuGourmet
}

/** Combine 2 or 3 ingredients: shows the delicacy's effects, rolls new combinations, then uses the ingredients up. */
export function DelicacyPanel({ gourmet }: DelicacyPanelProps) {
  const { set } = useSheet()
  const [picked, setPicked] = useState(['', '', ''])
  // The last delicacy, kept on screen while its effects are resolved.
  const [cooked, setCooked] = useState<{ ingredients: string[]; effects: string[] }>()
  const { ingredients } = gourmet

  const chosen = picked.filter(Boolean).map(Number).filter((index) => ingredients[index]?.taste)
  const uses = new Map<number, number>()
  for (const index of chosen) uses.set(index, (uses.get(index) ?? 0) + 1)
  const short = [...uses].filter(([index, count]) => count > (ingredients[index]?.quantity ?? 1))
  const pairs = chosen.length >= 2 ? delicacyPairs(chosen.map((index) => ingredients[index].taste as Taste)) : []
  const entries = pairs.map((key) => ({
    key,
    label: TASTE_PAIRS.find((pair) => pair.key === key)?.label ?? key,
    ...gourmet.combinations[key],
  }))
  const unresolved = entries.filter((entry) => !entry.effect || (effectOf(entry.effect)?.choices && !entry.choice))
  const canCook = chosen.length >= 2 && short.length === 0 && unresolved.length === 0

  const pick = (slot: number, value: string) => setPicked((current) => current.map((old, i) => (i === slot ? value : old)))
  const roll = (key: string) => {
    const { effect, choice } = rollCombination(gourmet, key)
    set(`gourmet.combinations.${key}`, { effect, choice })
  }
  const cook = () => {
    const names = chosen.map((index) => ingredients[index].name.trim() || tasteLabel(ingredients[index].taste))
    const effects = entries.map((entry) => effectOf(entry.effect)?.label + (entry.choice ? ` (${entry.choice})` : ''))
    // Used-up ingredients stay at 0, so their names and tastes are kept for later.
    const left = ingredients.map((ingredient, index) =>
      uses.has(index) ? { ...ingredient, quantity: (ingredient.quantity ?? 1) - (uses.get(index) ?? 0) } : ingredient,
    )
    set('gourmet.ingredients', left)
    setPicked(['', '', ''])
    setCooked({ ingredients: names, effects })
  }

  const options = ingredients
    .map((ingredient, index) => ({ ingredient, index }))
    .filter(({ ingredient }) => ingredient.taste && (ingredient.quantity ?? 1) > 0)

  return (
    <Panel title="Prepare a delicacy" className="delicacy-panel-container">
      <div className="delicacy-panel-picks">
        {SLOTS.map((label, slot) => (
          <Field key={label} label={label}>
            {(id) => (
              <select id={id} value={picked[slot]} onChange={(event) => pick(slot, event.target.value)}>
                <option value="">—</option>
                {options.map(({ ingredient, index }) => (
                  <option key={index} value={index}>
                    {ingredient.name.trim() || 'Unnamed'} ({tasteLabel(ingredient.taste)}) ×{ingredient.quantity ?? 1}
                  </option>
                ))}
              </select>
            )}
          </Field>
        ))}
      </div>
      {options.length < 2 && <p className="fu-note">Add ingredients with a taste to cook with them.</p>}
      {short.map(([index]) => (
        <p key={index} className="fu-warning">
          Not enough {ingredients[index].name.trim() || tasteLabel(ingredients[index].taste)} for that.
        </p>
      ))}
      {entries.length > 0 && (
        <ul className="delicacy-panel-effects">
          {entries.map((entry) => (
            <PairEffect key={entry.key} gourmet={gourmet} entry={entry} onRoll={() => roll(entry.key)} />
          ))}
        </ul>
      )}
      {entries.filter((entry) => entry.effect === '5').length > 1 && (
        <p className="fu-warning">Only one damage effect applies: choose one and forgo the others (NF p. 153).</p>
      )}
      {entries.filter((entry) => entry.effect === '12').length > 1 && (
        <p className="fu-warning">Only one damage-type effect applies: choose one and forgo the others (NF p. 153).</p>
      )}
      <div className="delicacy-panel-cook">
        <button type="button" onClick={cook} disabled={!canCook}>
          Cook
        </button>
        <span className="fu-note">
          {unresolved.length > 0
            ? 'Roll and record every new combination first.'
            : 'Uses up the ingredients. You choose the order of the effects and may forgo any; effects 5–12 only work in conflicts (NF p. 153).'}
        </span>
      </div>
      {cooked && (
        <section className="delicacy-panel-result" role="status" aria-label="Delicacy ready">
          <header className="delicacy-panel-result-header">
            <h3>Delicacy ready</h3>
            <button
              type="button"
              className="delicacy-panel-dismiss"
              onClick={() => setCooked(undefined)}
              title="Dismiss"
              aria-label="Dismiss the delicacy"
            >
              <Icon name="check" className="delicacy-panel-icon" />
            </button>
          </header>
          <p className="fu-note">Made with {cooked.ingredients.join(', ')}</p>
          <ul>
            {cooked.effects.map((effect) => (
              <li key={effect}>{effect}</li>
            ))}
          </ul>
        </section>
      )}
    </Panel>
  )
}
