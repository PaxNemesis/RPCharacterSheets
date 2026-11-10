type MartialFilterNoteProps = {
  /** How many suggestions need martial equipment the character can't equip. */
  blocked: number;
  showAll: boolean;
  onToggle: () => void;
};

/** Says how many martial suggestions are hidden, with a button to show or hide them. */
export function MartialFilterNote({ blocked, showAll, onToggle }: MartialFilterNoteProps) {
  if (blocked === 0) return null;

  return (
    <p className="fu-note item-slot-martial-note">
      {showAll
        ? `Showing ${blocked} martial ${blocked === 1 ? 'item' : 'items'} your classes and Quirk don't let you equip.`
        : `${blocked} martial ${blocked === 1 ? 'item is' : 'items are'} hidden, since your classes and Quirk don't let you equip ${blocked === 1 ? 'it' : 'them'}.`}
      <button type="button" className="item-slot-text-button" onClick={onToggle}>
        {showAll ? 'Hide them' : 'Show them'}
      </button>
    </p>
  );
}
