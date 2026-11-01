import { Fragment } from 'react'
import type { FormulaTerm } from '@/components/FormulaRow'
import { NumberField } from '@/components/NumberField'

type PoolRowProps = {
  pool: 'hp' | 'mp' | 'ip'
  label: string
  max: number
  /** HP only: half the maximum. */
  crisis?: number
  inCrisis?: boolean
  /** What the maximum is made of, shown small underneath. */
  terms: FormulaTerm[]
}

export function PoolRow({ pool, label, max, crisis, inCrisis, terms }: PoolRowProps) {
  return (
    <div className={`points-panel-row points-panel-${pool}`}>
      <span className="points-panel-label">{label}</span>
      <div className="points-panel-max">
        <NumberField value={max} label={`Max ${label}`} hideLabel size="lg" />
        {crisis !== undefined && (
          <NumberField value={crisis} label="Crisis" size="sm" className="points-panel-crisis" />
        )}
      </div>
      <div className="points-panel-current">
        <NumberField
          path={`${pool}.current`}
          label={`Current ${label}`}
          hideLabel
          size="lg"
          className={inCrisis ? 'points-panel-in-crisis' : undefined}
        />
        {inCrisis && <span className="points-panel-status">In Crisis</span>}
      </div>
      <div className="points-panel-formula" role="group" aria-label={`Max ${label} breakdown`}>
        {terms.map((term, index) => (
          <Fragment key={term.label}>
            {index > 0 && (
              <span className="points-panel-operator" aria-hidden="true">
                +
              </span>
            )}
            {term.path ? (
              <NumberField path={term.path} label={term.label} size="sm" />
            ) : (
              <NumberField value={term.value ?? null} label={term.label} size="sm" />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
