import { CheckboxField } from '@/components/CheckboxField';
import { Panel } from '@/components/Panel';
import { SUPPLEMENTS } from '../constants/books';

export function SettingsSection() {
  return (
    <div className="ik-section">
      <Panel title="Sheet settings">
        <p className="ik-note">These are saved with the character, so each character can have its own.</p>
        <CheckboxField
          path="settings.raceRules"
          label="Use rulebook races"
          description="Pick a race from the core rules to get its archetypes, starting stats and stat maximums. Turn off for custom races and type the maximums yourself."
        />
        <CheckboxField
          path="settings.careerRules"
          label="Use rulebook careers"
          description="Pick careers from the rulebooks to get starting packages and skill maximums. Turn off for custom careers."
        />
        <CheckboxField path="settings.magic" label="Spells" description="Show the arcane tradition and spell list." />
        <CheckboxField
          path="settings.mechanika"
          label="Mechanika"
          description="Show mechanika housings and rune plates."
        />
        <CheckboxField
          path="settings.steamjacks"
          label="Steamjacks"
          description="Show the Steamjacks tab for characters who own or control steamjacks."
        />
        <CheckboxField
          path="settings.powerField"
          label="Power field"
          description="Show power field boxes on the life spiral, for warcasters."
        />
      </Panel>
      <Panel title="Supplements">
        <p className="ik-note">
          Turn on the books your group uses. Their page references are marked with the book's initials.
        </p>
        {SUPPLEMENTS.map((book) => (
          <CheckboxField
            key={book.id}
            path={`settings.books.${book.id}`}
            label={`${book.title} (${book.short})`}
            description="Offer its careers, kingdom career options and abilities."
          />
        ))}
      </Panel>
    </div>
  );
}
