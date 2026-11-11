import { useRef, useState } from 'react';
import { useSheet } from '@/components/SheetProvider';
import { VitalMeter } from '../../../../VitalMeter';
import { AmountPopup } from './AmountPopup';

type Verb = { label: string; title: string };

type PoolRowProps = {
  pool: 'hp' | 'mp' | 'ip';
  label: 'HP' | 'MP' | 'IP';
  current: number;
  max: number;
  crisis?: number;
  /** The words for lowering and raising this pool, such as Damage and Heal. */
  verbs: [Verb, Verb];
};

/** One pool: its value, a meter for HP and MP, and two buttons that ask how much. */
export function PoolRow({ pool, label, current, max, crisis, verbs }: PoolRowProps) {
  const { set } = useSheet();
  const [sign, setSign] = useState<1 | -1>();
  const lowerRef = useRef<HTMLButtonElement>(null);
  const raiseRef = useRef<HTMLButtonElement>(null);
  const refFor = (which: 1 | -1) => (which < 0 ? lowerRef : raiseRef);
  // The popup sits beside the button that opened it.
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const verb = sign && verbs[sign < 0 ? 0 : 1];

  const open = (which: 1 | -1) => {
    setSign(which);
    setAnchor(refFor(which).current);
  };
  const close = () => {
    if (sign) refFor(sign).current?.focus();
    setSign(undefined);
  };

  return (
    <div
      className={
        label === 'HP' && crisis !== undefined && current <= crisis
          ? 'vitals-column-pool vitals-column-crisis'
          : 'vitals-column-pool'
      }
    >
      <span className="vitals-column-pool-label">{label}</span>
      <VitalMeter label={label} current={current} max={max} crisis={crisis} named={false} />
      {verbs.map((entry, index) => {
        const entrySign = index === 0 ? -1 : 1;
        return (
          <button
            key={entry.label}
            ref={refFor(entrySign)}
            type="button"
            className={entrySign < 0 ? 'vitals-column-lower' : 'vitals-column-raise'}
            aria-label={entry.label}
            title={entry.title}
            aria-expanded={sign === entrySign}
            onClick={() => (sign === entrySign ? close() : open(entrySign))}
          >
            {entrySign < 0 ? '−' : '+'}
          </button>
        );
      })}
      {sign && verb && anchor && (
        <AmountPopup
          title={verb.title}
          label={label}
          current={current}
          max={max}
          sign={sign}
          crisis={crisis}
          anchor={anchor}
          onApply={(next) => set(`${pool}.current`, next)}
          onClose={close}
        />
      )}
    </div>
  );
}
