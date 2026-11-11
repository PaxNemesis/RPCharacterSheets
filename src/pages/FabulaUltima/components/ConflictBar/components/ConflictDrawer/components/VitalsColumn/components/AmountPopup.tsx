import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';

type AmountPopupProps = {
  /** What happens, such as "Damage to HP". */
  title: string;
  label: string;
  current: number;
  max: number;
  /** −1 to lower the pool, 1 to raise it. */
  sign: 1 | -1;
  /** The amount filled in when it opens, selected so typing replaces it. */
  preset?: number;
  crisis?: number;
  /** The button that opened the popup: it sits beside it, and clicks on it don't count as outside. */
  anchor: HTMLElement;
  onApply: (next: number) => void;
  onClose: () => void;
};

const WIDTH = 240;
const GAP = 8;
const EDGE = 16;

/** Asks how much, shows the result before it is applied, and applies it with Enter. */
export function AmountPopup({
  title,
  label,
  current,
  max,
  sign,
  preset,
  crisis,
  anchor,
  onApply,
  onClose,
}: AmountPopupProps) {
  const ref = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(preset === undefined ? '' : String(preset));
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const amount = Math.max(0, Math.floor(Number(value)) || 0);
  const next = Math.min(max, Math.max(0, current + sign * amount));
  const warnings = [
    crisis !== undefined && current > crisis && next <= crisis && next > 0 && 'Crisis',
    label === 'HP' && next === 0 && current > 0 && '0 HP',
    label !== 'HP' && sign < 0 && amount > current && 'not enough',
  ].filter(Boolean);

  // Above the button when there is room, else below it, and always inside the window.
  useLayoutEffect(() => {
    const box = anchor.getBoundingClientRect();
    const height = ref.current?.offsetHeight ?? 0;
    const above = box.top - height - GAP;
    setPosition({
      top: above >= EDGE ? above : box.bottom + GAP,
      left: Math.max(EDGE, Math.min(window.innerWidth - WIDTH - EDGE, box.right - WIDTH)),
    });
  }, [anchor]);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  useEffect(() => {
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!ref.current?.contains(target) && !anchor.contains(target)) onClose();
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [anchor, onClose]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (value !== '') onApply(next);
    onClose();
  };
  // Escape closes only the popup, not the drawer around it.
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    event.stopPropagation();
    onClose();
  };

  return (
    <form
      ref={ref}
      className="vitals-column-popup"
      style={{ top: position.top, left: position.left, width: WIDTH }}
      role="dialog"
      aria-label={title}
      onSubmit={submit}
      onKeyDown={onKeyDown}
    >
      <label className="vitals-column-popup-title">
        {title}
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          min={0}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </label>
      <p className="vitals-column-popup-preview" aria-live="polite">
        {label} {current} → <strong>{next}</strong> / {max}
        {warnings.map((warning) => (
          <span key={String(warning)} className="vitals-column-popup-warning">
            {' '}
            · {warning}
          </span>
        ))}
      </p>
      <div className="vitals-column-popup-actions">
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="vitals-column-apply">
          Apply
        </button>
      </div>
    </form>
  );
}
