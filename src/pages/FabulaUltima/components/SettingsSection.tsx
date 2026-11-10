import { CheckboxField } from '@/components/CheckboxField';
import { Panel } from '@/components/Panel';
import { SUPPLEMENTS } from '../constants/books';

export function SettingsSection() {
  return (
    <div className="fu-section">
      <Panel title="Optional rules">
        <CheckboxField
          path="settings.quirks"
          label="Quirks"
          description="Show the Quirk panel on the Character tab, with the Quirks from the High, Natural and Techno Fantasy Atlases."
        />
      </Panel>
      <Panel title="Books">
        <p className="fu-note">
          Turn on the books your group uses. They are saved with the character, so each character can have its own. A
          class from a book that is turned off is treated as a custom class, with free benefits you enter yourself.
        </p>
        {SUPPLEMENTS.map((book) => (
          <CheckboxField
            key={book.id}
            path={`settings.books.${book.id}`}
            label={book.title}
            description={`Offer its classes, Heroic Skills, spells and Quirks. Page references are marked ${book.short}.`}
          />
        ))}
      </Panel>
    </div>
  );
}
