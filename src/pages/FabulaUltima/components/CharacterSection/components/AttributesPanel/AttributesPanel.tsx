import { CheckboxField } from '@/components/CheckboxField'
import { Field } from '@/components/Field'
import { Panel } from '@/components/Panel'
import { SelectField } from '@/components/SelectField'
import { ATTRIBUTE_KEYS, ATTRIBUTES, DICE, STARTING_SPREADS, STATUSES } from '../../../../constants/attributes'
import type { FuDerived } from '../../../../types'
import { BoostToggle } from './components'
import './AttributesPanel.styles.css'

const DIE_OPTIONS = DICE.map((size) => ({ value: String(size), label: `d${size}` }))
const singleStatus = (key: string) => STATUSES.find((status) => status.attributes.length === 1 && status.attributes[0] === key)
// Enraged and Poisoned each cover two neighboring rows, bracketed like on the printed sheet.
const PAIRS = STATUSES.filter((status) => status.attributes.length > 1)

type AttributesPanelProps = {
  derived: FuDerived
}

export function AttributesPanel({ derived }: AttributesPanelProps) {
  return (
    <Panel title="Attributes & status effects" className="attributes-panel-container">
      <div className="attributes-panel-grid">
        <span aria-hidden="true" />
        <span className="attributes-panel-head">Base</span>
        <span className="attributes-panel-head">Current</span>
        <span className="attributes-panel-head">Boost</span>
        <span aria-hidden="true" />
        <span aria-hidden="true" className="attributes-panel-pair-head" />
        {ATTRIBUTE_KEYS.map((key) => {
          const { short, label } = ATTRIBUTES[key]
          const status = singleStatus(key)
          const change = derived.current(key) - derived.base(key)
          const changed = change < 0 ? 'attributes-panel-lowered' : change > 0 ? 'attributes-panel-raised' : undefined
          return (
            <div key={key} className="attributes-panel-row">
              <span className="attributes-panel-name">
                <span className="attributes-panel-long">{label}</span>
                <span className="attributes-panel-short" aria-hidden="true">
                  {short}
                </span>
              </span>
              <SelectField path={`attributes.${key}`} label={`${label} base die`} hideLabel options={DIE_OPTIONS} />
              <Field label={`${label} current die`} hideLabel className={changed}>
                {(id) => <input id={id} type="text" readOnly tabIndex={-1} value={`d${derived.current(key)}`} />}
              </Field>
              <BoostToggle attribute={key} />
              {status && <CheckboxField path={`statuses.${status.key}`} label={status.label} />}
            </div>
          )
        })}
        {PAIRS.map((pair) => (
          <div
            key={pair.key}
            className={`attributes-panel-pair attributes-panel-${pair.key}`}
            title={`Lowers ${pair.attributes.map((key) => ATTRIBUTES[key].short).join(' and ')}`}
          >
            <span className="attributes-panel-bracket" aria-hidden="true" />
            <CheckboxField path={`statuses.${pair.key}`} label={pair.label} />
          </div>
        ))}
      </div>
      <p className="fu-note">
        A boost raises a die one size, up to d12. Each status effect then lowers its attributes by one die size, down to
        d6; Enraged lowers DEX and INS, Poisoned MIG and WLP (p. 94). Start with {STARTING_SPREADS.join(', or ')} (p. 162).
      </p>
    </Panel>
  )
}
