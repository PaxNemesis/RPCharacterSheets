import { SelectField } from '@/components/SelectField';
import type { FuGourmet } from '../../../../../types';
import { effectOf, freeChoices } from '../../../utils/delicacies';

type PairEffectProps = {
  gourmet: FuGourmet;
  entry: { key: string; label: string; effect?: string; choice?: string };
  onRoll: () => void;
};

/** One taste pair of a delicacy: its recorded effect, or a d12 roll when it's new. */
export function PairEffect({ gourmet, entry, onRoll }: PairEffectProps) {
  const effect = effectOf(entry.effect);

  return (
    <li className="delicacy-panel-effect">
      <span className="delicacy-panel-pair">{entry.label}</span>
      {effect ? (
        <>
          <span>
            {effect.roll}. {effect.label}
          </span>
          {effect.choices && (
            <SelectField
              path={`gourmet.combinations.${entry.key}.choice`}
              label={`${entry.label} choice`}
              hideLabel
              options={[
                { value: '', label: 'Choose…' },
                ...freeChoices(gourmet, entry.key).map((choice) => ({ value: choice, label: choice })),
              ]}
            />
          )}
        </>
      ) : (
        <>
          <span className="fu-note">New combination</span>
          <button type="button" onClick={onRoll} title="Roll a d12 and record the effect in the cookbook">
            Roll d12
          </button>
        </>
      )}
    </li>
  );
}
