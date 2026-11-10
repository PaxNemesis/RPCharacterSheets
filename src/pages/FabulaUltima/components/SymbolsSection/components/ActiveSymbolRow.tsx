import { Icon } from '@/components/Icon';
import { SelectField } from '@/components/SelectField';
import { TextField } from '@/components/TextField';
import { SYMBOL_CHOICES } from '../../../constants/symbolist';
import type { FuActiveSymbol } from '../../../types';
import { findSymbol } from '../../../utils/symbolist';

type ActiveSymbolRowProps = {
  index: number;
  symbol: FuActiveSymbol;
  /** False at the active limit. */
  canCopy: boolean;
  onCopy: () => void;
  onDestroy: () => void;
};

/** One active symbol: who bears it and, for some symbols, the choice made when it was created. */
export function ActiveSymbolRow({ index, symbol, canCopy, onCopy, onDestroy }: ActiveSymbolRowProps) {
  const path = `symbolist.active.${index}`;
  const choice = findSymbol(symbol.name)?.choice;
  const label = symbol.name || 'Unknown symbol';

  return (
    <li className="symbols-section-symbol">
      <strong className="symbols-section-name">{label}</strong>
      <TextField path={`${path}.bearer`} label={`${label} bearer`} hideLabel placeholder="Borne by…" />
      {choice ? (
        <SelectField
          path={`${path}.choice`}
          label={`${label} ${SYMBOL_CHOICES[choice].label}`}
          hideLabel
          options={[
            { value: '', label: `Choose a ${SYMBOL_CHOICES[choice].label}…` },
            ...SYMBOL_CHOICES[choice].options.map((option) => ({ value: option, label: option })),
          ]}
        />
      ) : (
        <span />
      )}
      <div className="symbols-section-buttons">
        <button
          type="button"
          onClick={onCopy}
          disabled={!canCopy}
          title={canCopy ? 'Another copy from the same attack' : 'At your limit: destroy a symbol first'}
          aria-label={`Copy ${label}`}
        >
          <Icon name="content_copy" className="symbols-section-icon" />
        </button>
        <button
          type="button"
          className="symbols-section-destroy"
          onClick={onDestroy}
          title="Destroy"
          aria-label={`Destroy ${label}`}
        >
          <Icon name="delete" className="symbols-section-icon" />
        </button>
      </div>
    </li>
  );
}
