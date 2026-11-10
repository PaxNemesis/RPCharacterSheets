import { Fragment } from 'react';
import { NumberField } from '@/components/NumberField';
import './FormulaRow.styles.css';

/** A term is either typed in (`path`) or calculated (`value`). */
export type FormulaTerm = { label: string; path?: string; value?: number | null };

type FormulaRowProps = {
  title: string;
  terms: FormulaTerm[];
  total: number | null;
  /** Shown between the terms; defaults to +. */
  operator?: string;
};

export function FormulaRow({ title, terms, total, operator = '+' }: FormulaRowProps) {
  return (
    <div className="formula-row-container" role="group" aria-label={title}>
      <span className="formula-row-title">{title}</span>
      {terms.map((term, index) => (
        <Fragment key={term.label}>
          {index > 0 && (
            <span className="formula-row-operator" aria-hidden="true">
              {operator}
            </span>
          )}
          {term.path ? (
            <NumberField path={term.path} label={term.label} size="sm" />
          ) : (
            <NumberField value={term.value ?? null} label={term.label} size="sm" />
          )}
        </Fragment>
      ))}
      <span className="formula-row-operator" aria-hidden="true">
        =
      </span>
      <NumberField value={total} label="Total" size="sm" className="formula-row-total" />
    </div>
  );
}
