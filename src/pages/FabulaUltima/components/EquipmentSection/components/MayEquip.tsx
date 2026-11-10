import { useSheetField } from '@/components/SheetProvider';
import { MARTIAL } from '../../../constants/attributes';
import type { FuDerived, MartialKey } from '../../../types';

type MayEquipProps = {
  derived: FuDerived;
};

/**
 * The martial equipment the character may use. Classes and the Quirk grant it; anything else, such
 * as a Heroic Skill or the GM's say-so, is switched on by clicking the type.
 */
export function MayEquip({ derived }: MayEquipProps) {
  const [allowed, setAllowed] = useSheetField<Record<MartialKey, boolean>>('modifiers.martial');

  return (
    <div className="equipment-section-martial" role="group" aria-label="May equip">
      <span className="equipment-section-martial-label">May equip</span>
      {MARTIAL.map(({ key, label }) => {
        const granted = derived.martialGranted[key];
        const added = !granted && allowed[key];
        const state = granted ? '' : added ? ' equipment-section-tag-added' : ' equipment-section-tag-off';
        return (
          <button
            key={key}
            type="button"
            className={`equipment-section-tag${state}`}
            aria-pressed={granted || added}
            disabled={granted}
            title={
              granted
                ? 'From your classes or Quirk'
                : added
                  ? 'Allowed by hand: click to remove'
                  : 'Click to allow anyway'
            }
            onClick={() => setAllowed({ ...allowed, [key]: !allowed[key] })}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
