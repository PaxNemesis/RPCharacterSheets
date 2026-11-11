import { PoolButtons } from '../../../../../../PoolButtons';
import { VitalMeter } from '../../../../VitalMeter';

type PoolRowProps = {
  pool: 'hp' | 'mp' | 'ip';
  current: number;
  max: number;
  crisis?: number;
};

/** One pool: its meter, then − and + buttons that ask how much. */
export function PoolRow({ pool, current, max, crisis }: PoolRowProps) {
  const label = pool === 'hp' ? 'HP' : pool === 'mp' ? 'MP' : 'IP';
  const inCrisis = crisis !== undefined && current <= crisis;

  return (
    <div className={inCrisis ? 'vitals-column-pool vitals-column-crisis' : 'vitals-column-pool'}>
      <span className="vitals-column-pool-label">{label}</span>
      <VitalMeter label={label} current={current} max={max} crisis={crisis} named={false} />
      <PoolButtons pool={pool} current={current} max={max} crisis={crisis} />
    </div>
  );
}
