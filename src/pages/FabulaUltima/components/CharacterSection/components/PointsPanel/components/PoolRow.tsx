import { Fragment } from 'react';
import type { FormulaTerm } from '@/components/FormulaRow';
import { NumberField } from '@/components/NumberField';
import { PoolButtons } from '../../../../PoolButtons';

type PoolRowProps = {
  pool: 'hp' | 'mp' | 'ip';
  label: string;
  max: number;
  /** The current value, blank counted as full, for the − and + buttons. */
  current: number;
  /** HP only: half the maximum. */
  crisis?: number;
  inCrisis?: boolean;
  /** What the maximum is made of, shown small underneath. */
  terms: FormulaTerm[];
};

export function PoolRow({ pool, label, max, current, crisis, inCrisis, terms }: PoolRowProps) {
  return (
    <div className={`points-panel-row points-panel-${pool}`}>
      <span className="points-panel-label">{label}</span>
      <div className="points-panel-max">
        <NumberField value={max} label={`Max ${label}`} hideLabel size="lg" />
        {/* Being in Crisis lights up this box rather than adding a line, so the rows never move. */}
        {crisis !== undefined && (
          <NumberField
            value={crisis}
            label={inCrisis ? 'In Crisis' : 'Crisis'}
            size="sm"
            className={inCrisis ? 'points-panel-crisis points-panel-crisis-on' : 'points-panel-crisis'}
          />
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
        <PoolButtons pool={pool} current={current} max={max} crisis={crisis} size="lg" />
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
  );
}
