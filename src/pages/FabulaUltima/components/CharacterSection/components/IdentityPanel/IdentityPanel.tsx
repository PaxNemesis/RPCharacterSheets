import { NumberField } from '@/components/NumberField'
import { Panel } from '@/components/Panel'
import { TextField } from '@/components/TextField'
import type { FuCharacter, FuDerived } from '../../../../types'
import './IdentityPanel.styles.css'

type IdentityPanelProps = {
  character: FuCharacter
  derived: FuDerived
}

export function IdentityPanel({ character, derived }: IdentityPanelProps) {
  // Every 10 XP buys a level (p. 226).
  const levelsReady = Math.floor((character.xp ?? 0) / 10)

  return (
    <Panel title="Character" className="identity-panel-container">
      <div className="identity-panel-grid">
        <TextField path="identity.name" label="Name" className="identity-panel-name" />
        <TextField path="identity.pronouns" label="Pronouns" className="identity-panel-pronouns" />
        <TextField path="identity.player" label="Player" className="identity-panel-player" />
        <TextField path="identity.identity" label="Identity" className="identity-panel-identity" />
        <TextField path="identity.theme" label="Theme" className="identity-panel-theme" />
        <TextField path="identity.origin" label="Origin" className="identity-panel-origin" />
        <NumberField value={derived.level} label="Level" className="identity-panel-level" />
        <NumberField path="xp" label="Experience points" className="identity-panel-xp" />
        <NumberField path="fabulaPoints" label="Fabula Points" className="identity-panel-fabula" />
      </div>
      {levelsReady > 0 ? (
        <p className="fu-warning" role="status">
          {character.xp} XP is enough for {levelsReady === 1 ? 'a level' : `${levelsReady} levels`}: for each, lose 10 XP
          and add a level to a class (p. 226).
        </p>
      ) : (
        <p className="fu-note">
          Level is the total of your class levels. Fabula Points: p. 96. Experience at the end of a session: p. 226.
        </p>
      )}
    </Panel>
  )
}
