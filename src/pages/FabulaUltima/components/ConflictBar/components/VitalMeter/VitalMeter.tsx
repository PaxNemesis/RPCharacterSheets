import type { CSSProperties } from 'react';
import './VitalMeter.styles.css';

type VitalMeterProps = {
  label: 'HP' | 'MP';
  current: number;
  max: number;
  /** HP at or below this is Crisis: marked with a notch, and the meter turns to warning colours. */
  crisis?: number;
  /** Whether the text inside starts with the label; the drawer's rows already name it. */
  named?: boolean;
};

/**
 * A meter with its numbers inside. The text changes colour where the fill ends, so it reads on both
 * the fill and the empty part.
 */
export function VitalMeter({ label, current, max, crisis, named = true }: VitalMeterProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (current / max) * 100)) : 0;
  const inCrisis = crisis !== undefined && current <= crisis;
  const style = { '--vital-meter-percent': `${percent}%` } as CSSProperties;
  const text = `${named ? `${label} ` : ''}${current}/${max}`;

  return (
    <span
      className={`vital-meter-container vital-meter-${label.toLowerCase()}${inCrisis ? ' vital-meter-crisis' : ''}`}
      style={style}
      role="img"
      aria-label={`${label} ${current} of ${max}${inCrisis ? ', in Crisis' : ''}`}
      title={inCrisis ? 'In Crisis' : undefined}
    >
      <span className="vital-meter-fill" />
      {crisis !== undefined && max > 0 && (
        <span className="vital-meter-mark" style={{ left: `${(crisis / max) * 100}%` }} />
      )}
      <span className="vital-meter-text" aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
