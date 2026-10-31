import { NumberField } from '@/components/NumberField'
import { Panel } from '@/components/Panel'
import { TextField } from '@/components/TextField'
import type { FuCharacter, FuDerived } from '../../../types'

type IdentityPanelProps = {
  character: FuCharacter
  derived: FuDerived
}

export function IdentityPanel({ character, derived }: IdentityPanelProps) {
  return (
    <Panel title="Character">
      <div className="fu-fields">
        <TextField path="identity.name" label="Name" />
        <TextField path="identity.pronouns" label="Pronouns" />
        <TextField path="identity.player" label="Player" />
        <TextField path="identity.identity" label="Identity" className="fu-wide" />
        <TextField path="identity.theme" label="Theme" />
        <TextField path="identity.origin" label="Origin" />
      </div>
      <div className="fu-fields">
        <NumberField value={derived.level} label="Level" />
        <NumberField path="xp" label="Experience points" />
        <NumberField path="fabulaPoints" label="Fabula Points" />
      </div>
      {(character.xp ?? 0) >= 10 && (
        <p className="fu-warning" role="status">
          10 or more XP: lose 10 XP and gain a level by adding it to a class (p. 226).
        </p>
      )}
      <p className="fu-note">
        Level is the total of your class levels. Fabula Points: p. 96. Experience at the end of a session: p. 226.
      </p>
    </Panel>
  )
}
