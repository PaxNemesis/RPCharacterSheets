import { Icon } from '@/components/Icon';
import { useSheet } from '@/components/SheetProvider';
import { useRowIds } from '@/hooks/useRowIds';
import { useIkCharacter } from '../../../../hooks/useIkCharacter';
import type { IkStoredKind } from '../../../../types';
import { EQUIPPED_LIST, equip, storedKind } from '../../../../utils/storage';
import { describeStored, KIND_LABELS } from './utils/describeStored';
import './StoredEquipment.styles.css';

type StoredEquipmentProps = {
  /** The kind of stored item to show. */
  kind: IkStoredKind;
  /** Also shows entries of no known kind, so they can be deleted. */
  showUnknown?: boolean;
};

/**
 * The stored items of one kind, under the table of that kind, with buttons to equip them, swap them
 * for an equipped item, or delete them. Shows nothing while none are stored.
 */
export function StoredEquipment({ kind: shownKind, showUnknown = false }: StoredEquipmentProps) {
  const { character, derived } = useIkCharacter();
  const { set } = useSheet();
  const { stored } = character;
  // Equipping takes an item out of the middle of the list; whatever it is swapped for goes on the end.
  const rowIds = useRowIds(stored.length);
  const shown = stored
    .map((item, index) => ({ item, index, kind: storedKind(item) }))
    .filter(({ kind }) => (kind ? kind === shownKind : showUnknown));
  if (shown.length === 0) return null;

  const apply = (kind: IkStoredKind, index: number, swap?: number) => {
    const next = equip(character, index, swap);
    rowIds.remove(index);
    set(EQUIPPED_LIST[kind], next[EQUIPPED_LIST[kind]]);
    set('stored', next.stored);
  };
  const remove = (index: number) => {
    const name = stored[index].name.trim() || 'this item';
    if (window.confirm(`Delete ${name}? It will be removed from the sheet.`)) {
      rowIds.remove(index);
      set(
        'stored',
        stored.filter((_, other) => other !== index),
      );
    }
  };

  return (
    <div className="stored-equipment-container">
      <h3 className="stored-equipment-heading">Stored</h3>
      <ul className="stored-equipment-list">
        {shown.map(({ item, index, kind }) => {
          const name = item.name.trim() || (kind ? `Unnamed ${KIND_LABELS[kind].toLowerCase()}` : 'Unknown item');
          const equipped = kind ? character[EQUIPPED_LIST[kind]] : [];
          return (
            <li key={rowIds.ids[index]} className="stored-equipment-item">
              <span className="stored-equipment-summary">
                <span className="stored-equipment-name">{name}</span>
                {kind && <span className="stored-equipment-details">{describeStored(item, kind, derived.stat)}</span>}
              </span>
              <span className="stored-equipment-actions">
                {kind && (
                  <button type="button" onClick={() => apply(kind, index)} aria-label={`Equip ${name}`}>
                    <Icon name="unarchive" className="stored-equipment-icon" />
                    Equip
                  </button>
                )}
                {kind &&
                  equipped.map((other, at) => {
                    const otherName = other.name.trim() || `${KIND_LABELS[kind].toLowerCase()} ${at + 1}`;
                    return (
                      <button
                        // oxlint-disable-next-line react/no-array-index-key -- Stateless buttons, one per equipped row in order.
                        key={at}
                        type="button"
                        onClick={() => apply(kind, index, at)}
                        title={`Equip ${name} and store ${otherName}`}
                        aria-label={`Swap ${name} for ${otherName}`}
                      >
                        <Icon name="swap_horiz" className="stored-equipment-icon" />
                        Swap for {otherName}
                      </button>
                    );
                  })}
                <button
                  type="button"
                  className="stored-equipment-delete"
                  onClick={() => remove(index)}
                  title="Delete"
                  aria-label={`Delete ${name}`}
                >
                  <Icon name="delete" className="stored-equipment-icon" />
                </button>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
