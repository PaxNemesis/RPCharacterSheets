import { Fragment } from 'react'
import { NumberField } from '@/components/NumberField'
import type { Num } from '../types'

/** A term is either typed in (`path`) or calculated (`value`). */
type FormulaTerm = { label: string; path?: string; value?: Num }

type FormulaRowProps = {
  title: string
  terms: FormulaTerm[]
  total: Num
}

export function FormulaRow({ title, terms, total }: FormulaRowProps) {
  return (
    <div className="ik-formula" role="group" aria-label={title}>
      <span className="ik-formula-title">{title}</span>
      {terms.map((term, index) => (
        <Fragment key={term.label}>
          {index > 0 && (
            <span className="ik-operator" aria-hidden="true">
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
      <span className="ik-operator" aria-hidden="true">
        =
      </span>
      <NumberField value={total} label="Total" size="sm" className="ik-formula-total" />
    </div>
  )
}
