import { useRef, useState } from 'react';
import { useSheet } from '@/components/SheetProvider';
import { AmountPopup } from './components';
import { POOL_VERBS, type PoolKey } from './PoolButtons.constants';
import './PoolButtons.styles.css';

type PoolButtonsProps = {
  pool: PoolKey;
  current: number;
  max: number;
  /** HP at or below this is Crisis, which the popup warns about. */
  crisis?: number;
  /** 'lg' matches the large number fields of the HP, MP and IP panel. */
  size?: 'md' | 'lg';
};

/**
 * − and + for HP, MP or IP: each asks how much, shows the result, and keeps the pool between 0 and
 * its maximum. The buttons are grid or flex items of whatever holds them.
 */
export function PoolButtons({ pool, current, max, crisis, size = 'md' }: PoolButtonsProps) {
  const { set } = useSheet();
  const [sign, setSign] = useState<1 | -1>();
  // The popup sits beside the button that opened it.
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const lowerRef = useRef<HTMLButtonElement>(null);
  const raiseRef = useRef<HTMLButtonElement>(null);
  const refFor = (which: 1 | -1) => (which < 0 ? lowerRef : raiseRef);
  const verbs = POOL_VERBS[pool];
  const verb = sign && verbs[sign < 0 ? 0 : 1];
  const label = pool.toUpperCase();

  const open = (which: 1 | -1) => {
    setSign(which);
    setAnchor(refFor(which).current);
  };
  const close = () => {
    if (sign) refFor(sign).current?.focus();
    setSign(undefined);
  };

  return (
    <span className={`pool-buttons-container pool-buttons-${size}`}>
      {verbs.map((entry, index) => {
        const which = index === 0 ? -1 : 1;
        return (
          <button
            key={entry.label}
            ref={refFor(which)}
            type="button"
            className={which < 0 ? 'pool-buttons-lower' : 'pool-buttons-raise'}
            aria-label={entry.label}
            title={entry.title}
            aria-expanded={sign === which}
            onClick={() => (sign === which ? close() : open(which))}
          >
            {which < 0 ? '−' : '+'}
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
          preset={verb.preset}
          crisis={crisis}
          anchor={anchor}
          onApply={(next) => set(`${pool}.current`, next)}
          onClose={close}
        />
      )}
    </span>
  );
}
