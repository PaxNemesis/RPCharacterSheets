import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import './SuggestionInput.styles.css';

type SuggestionInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** Called after onChange when a suggestion is picked from the list, not when it is typed. */
  onPick?: (value: string) => void;
  /** Called when the user is done with the value: Enter, leaving the field, or picking a suggestion. */
  onCommit?: () => void;
  suggestions: string[];
  placeholder?: string;
};

const LIST_HEIGHT = 240;

// A text input with its own suggestion list. The browser's <datalist> popup is drawn by the
// browser itself and lands in the wrong place in some embedded browsers, such as VS Code's.
export function SuggestionInput({
  id,
  value,
  onChange,
  onPick,
  onCommit,
  suggestions,
  placeholder,
}: SuggestionInputProps) {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [rect, setRect] = useState<DOMRect>();
  const [active, setActive] = useState(-1);
  const open = rect !== undefined;

  const query = value.trim().toLowerCase();
  const matches = suggestions.filter((s) => s.toLowerCase().includes(query) && s.toLowerCase() !== query);
  const showList = open && matches.length > 0;

  const openList = () => {
    if (inputRef.current) setRect(inputRef.current.getBoundingClientRect());
  };
  const close = () => {
    setRect(undefined);
    setActive(-1);
  };
  const pick = (suggestion: string) => {
    onChange(suggestion);
    onPick?.(suggestion);
    close();
    onCommit?.();
  };

  // The list is fixed-positioned so table scroll areas don't clip it; follow the input while open.
  useEffect(() => {
    if (!open) return;
    const follow = () => inputRef.current && setRect(inputRef.current.getBoundingClientRect());
    window.addEventListener('scroll', follow, true);
    window.addEventListener('resize', follow);
    return () => {
      window.removeEventListener('scroll', follow, true);
      window.removeEventListener('resize', follow);
    };
  }, [open]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) openList();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActive((current) => (current + step + matches.length) % Math.max(matches.length, 1));
    } else if (event.key === 'Enter' && showList && active >= 0) {
      event.preventDefault();
      pick(matches[active]);
    } else if (event.key === 'Enter') {
      close();
      onCommit?.();
    } else if (event.key === 'Escape' && open) {
      close();
    }
  };

  const below = !rect || rect.bottom + LIST_HEIGHT < window.innerHeight || rect.top < LIST_HEIGHT;
  const position = rect && {
    left: rect.left,
    width: Math.max(rect.width, 200),
    ...(below ? { top: rect.bottom + 2 } : { bottom: window.innerHeight - rect.top + 2 }),
  };

  return (
    <>
      <input
        ref={inputRef}
        id={id}
        type="text"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value);
          setActive(-1);
          openList();
        }}
        onFocus={openList}
        onBlur={() => {
          close();
          onCommit?.();
        }}
        onKeyDown={onKeyDown}
      />
      {showList && (
        <ul id={listId} role="listbox" className="suggestion-input-list" style={position}>
          {matches.map((suggestion, index) => (
            <li
              key={suggestion}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              // Keep focus in the input so blur doesn't close the list before the click lands.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => pick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
