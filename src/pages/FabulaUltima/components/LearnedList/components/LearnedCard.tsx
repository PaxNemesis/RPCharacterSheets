import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import { TextField } from '@/components/TextField';

type LearnedCardProps = {
  entry: { name: string; ref: string; detail?: string };
  notesPath: string;
  highlighted: boolean;
  actions?: ReactNode;
  onForget: () => void;
};

/** One learned entry: its page, its data and the player's own notes on what it does. */
export function LearnedCard({ entry, notesPath, highlighted, actions, onForget }: LearnedCardProps) {
  return (
    <section
      className={highlighted ? 'learned-list-card learned-list-highlighted' : 'learned-list-card'}
      aria-label={entry.name}
    >
      <header className="learned-list-card-header">
        <h3>{entry.name}</h3>
        <button
          type="button"
          className="learned-list-forget"
          onClick={onForget}
          title="Forget"
          aria-label={`Forget ${entry.name}`}
        >
          <Icon name="delete" className="learned-list-icon" />
        </button>
      </header>
      <p className="fu-note">
        {entry.ref}
        {entry.detail && ` · ${entry.detail}`}
      </p>
      {actions && <div className="learned-list-actions">{actions}</div>}
      <TextField
        path={notesPath}
        label={`${entry.name} notes`}
        hideLabel
        rows={2}
        placeholder="What it does, in your words…"
      />
    </section>
  );
}
