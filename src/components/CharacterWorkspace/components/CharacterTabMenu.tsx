import { Icon } from '@/components/Icon';

type CharacterTabMenuProps = {
  onDuplicate: () => void;
  onClose: () => void;
};

/** What can be done with one open character, from the menu on its tab. */
export function CharacterTabMenu({ onDuplicate, onClose }: CharacterTabMenuProps) {
  return (
    <ul>
      <li>
        <button type="button" className="dropdown-item" onClick={onDuplicate}>
          <Icon name="content_copy" />
          Duplicate
        </button>
      </li>
      <li role="separator" className="dropdown-divider" />
      <li>
        <button type="button" className="dropdown-item dropdown-item-danger" onClick={onClose}>
          <Icon name="delete" />
          Close…
        </button>
      </li>
    </ul>
  );
}
