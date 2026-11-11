import { useId, useState } from 'react';
import { CheckboxField } from '@/components/CheckboxField';
import { NumberField } from '@/components/NumberField';
import { useSheet } from '@/components/SheetProvider';
import { STATUSES } from '../../../../../constants/attributes';
import type { FuCharacter, FuDerived } from '../../../../../types';

type DrawerResourcesProps = {
  character: FuCharacter;
  derived: FuDerived;
};

type PoolKey = 'hp' | 'mp' | 'ip';

/** HP, MP and IP, raised or lowered by an amount at a time, with Fabula Points and status effects. */
export function DrawerResources({ character, derived }: DrawerResourcesProps) {
  const { set } = useSheet();
  const [amount, setAmount] = useState(1);
  const amountId = useId();
  const fabulaPoints = character.fabulaPoints ?? 0;
  const pools: { key: PoolKey; label: string; max: number }[] = [
    { key: 'hp', label: 'HP', max: derived.maxHp },
    { key: 'mp', label: 'MP', max: derived.maxMp },
    { key: 'ip', label: 'IP', max: derived.maxIp },
  ];

  // A blank current value counts as full; the result stays between 0 and the maximum.
  const change = (key: PoolKey, max: number, sign: 1 | -1) =>
    set(`${key}.current`, Math.min(max, Math.max(0, (character[key].current ?? max) + sign * amount)));

  return (
    <div className="conflict-drawer-section">
      <h3 className="conflict-drawer-heading">Resources</h3>
      <div className="conflict-drawer-pools">
        <label className="conflict-drawer-amount" htmlFor={amountId}>
          Amount
          <input
            id={amountId}
            type="number"
            min={1}
            value={amount}
            onChange={(event) => setAmount(Math.max(1, Math.floor(Number(event.target.value)) || 1))}
          />
        </label>
        {pools.map(({ key, label, max }) => (
          <div key={key} className="conflict-drawer-pool-row" role="group" aria-label={label}>
            <span className="conflict-drawer-pool-label">{label}</span>
            <button type="button" onClick={() => change(key, max, -1)} aria-label={`Lose ${amount} ${label}`}>
              −{amount}
            </button>
            <NumberField path={`${key}.current`} label={`Current ${label}`} hideLabel size="sm" />
            <span className="conflict-drawer-max">/{max}</span>
            <button type="button" onClick={() => change(key, max, 1)} aria-label={`Recover ${amount} ${label}`}>
              +{amount}
            </button>
          </div>
        ))}
        <div className="conflict-drawer-pool-row" role="group" aria-label="Fabula Points">
          <span className="conflict-drawer-pool-label" title="Fabula Points">
            FP
          </span>
          <button
            type="button"
            onClick={() => set('fabulaPoints', Math.max(0, fabulaPoints - 1))}
            aria-label="Spend a Fabula Point"
          >
            −1
          </button>
          <NumberField path="fabulaPoints" label="Fabula Points" hideLabel size="sm" />
          <button type="button" onClick={() => set('fabulaPoints', fabulaPoints + 1)} aria-label="Gain a Fabula Point">
            +1
          </button>
        </div>
      </div>
      <div className="conflict-drawer-statuses">
        {STATUSES.map(({ key, label }) => (
          <CheckboxField key={key} path={`statuses.${key}`} label={label} />
        ))}
      </div>
    </div>
  );
}
