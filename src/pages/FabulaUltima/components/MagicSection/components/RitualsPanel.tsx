import { CheckboxField } from '@/components/CheckboxField'
import { Panel } from '@/components/Panel'
import { TextField } from '@/components/TextField'
import { DISCIPLINES } from '../../../constants/attributes'
import type { Discipline } from '../../../types'

type RitualsPanelProps = {
  /** Disciplines the character's classes grant. */
  disciplines: Discipline[]
}

export function RitualsPanel({ disciplines }: RitualsPanelProps) {
  const granted = DISCIPLINES.filter(({ key }) => disciplines.includes(key)).map(({ label }) => label)
  const others = DISCIPLINES.filter(({ key }) => !disciplines.includes(key))

  return (
    <Panel title="Rituals">
      <p className="fu-note">
        {granted.length > 0
          ? `Your classes let you perform ${granted.join(', ')} rituals.`
          : 'None of your classes grant ritual disciplines yet.'}{' '}
        Rituals: pp. 118–121.
      </p>
      {others.length > 0 && (
        <>
          <p className="fu-note">Other disciplines you can perform:</p>
          <div className="fu-checks">
            {others.map(({ key, label }) => (
              <CheckboxField key={key} path={`rituals.disciplines.${key}`} label={label} />
            ))}
          </div>
        </>
      )}
      <TextField path="rituals.notes" label="Ritual notes" rows={4} />
    </Panel>
  )
}
