import { CheckboxField } from '@/components/CheckboxField'
import { Panel } from '@/components/Panel'

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
          description="Pick careers from the core rules to get starting packages and skill maximums. Turn off for custom careers."
        />
        <CheckboxField path="settings.magic" label="Spells" description="Show the arcane tradition and spell list." />
        <CheckboxField path="settings.mechanika" label="Mechanika" description="Show mechanika housings and rune plates." />
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
    </div>
  )
}
