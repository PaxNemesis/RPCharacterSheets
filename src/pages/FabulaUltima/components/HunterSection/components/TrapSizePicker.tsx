import { TRAP_SIZES, type TrapSize } from '../../../constants/hunter';

type TrapSizePickerProps = {
  size: TrapSize;
  onSize: (size: TrapSize) => void;
  /** The trap set this conflict, or ''. */
  trapSet: string;
  /** Why no trap can be set right now, if so. */
  blocked?: string;
};

/** The size the trap cards below set their trap at, and whether one can be set now (LF p. 90). */
export function TrapSizePicker({ size, onSize, trapSet, blocked }: TrapSizePickerProps) {
  return (
    <div className="hunter-section-setting">
      <div className="hunter-section-sizes" role="group" aria-label="Trap size">
        {TRAP_SIZES.map((entry) => (
          <button key={entry.name} type="button" aria-pressed={size === entry.name} onClick={() => onSize(entry.name)}>
            {entry.name} · {entry.mp} MP · {entry.targets} {entry.targets === 1 ? 'creature' : 'creatures'}
          </button>
        ))}
      </div>
      <p className="fu-note">
        {trapSet
          ? `Set this conflict: ${trapSet}. One trap per conflict; ending the scene allows another.`
          : (blocked ??
            'Set one trap at the start of a conflict, before your first turn, or before it as an ambush with the surprise round rule. Targets make an Opposed DEX + INS Check, with your Set Trap SL as a bonus (LF p. 90).')}
      </p>
    </div>
  );
}
