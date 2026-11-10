import { Panel } from '@/components/Panel'
import { useSheet } from '@/components/SheetProvider'
import { useRowIds } from '@/hooks/useRowIds'
import type { FuCharacter } from '../../../types'
import { activeClarity, monkSkills } from '../../../utils/monk'
import { ClarityRow } from './ClarityRow'

type ClarityPanelProps = {
  character: FuCharacter
}

/** The benefits chosen with Clarity, in order, and how many the Resolve Beads power (LF p. 102). */
export function ClarityPanel({ character }: ClarityPanelProps) {
  const { set } = useSheet()
  const { clarity, resonantClarity } = monkSkills(character)
  const benefits = character.monk.clarity
  const active = activeClarity(character)

  const ids = benefits.filter((benefit) => benefit.kind && benefit.choice).map((benefit) => `${benefit.kind}:${benefit.choice}`)
  const duplicates = ids.length !== new Set(ids).size
  const shared = benefits.slice(0, active).filter((benefit) => benefit.shared).length

  const add = () => set('monk.clarity', [...benefits, { kind: '', choice: '', shared: false }])
  const rowIds = useRowIds(benefits.length)
  const remove = (index: number) => {
    rowIds.remove(index)
    set('monk.clarity', benefits.filter((_, other) => other !== index))
  }

  return (
    <Panel
      title="Clarity"
      actions={
        benefits.length < clarity && (
          <button type="button" onClick={add}>
            + Add benefit
          </button>
        )
      }
    >
      {clarity === 0 ? (
        <p className="fu-note">Learn the Clarity Skill to gain benefits from your Resolve Beads (LF p. 102).</p>
      ) : (
        <p className="fu-note">
          {active} of {clarity} active: one per pair of Resolve Beads, up to your Clarity SL, from the top of the list.
          {resonantClarity > 0 && ` Resonant Clarity shares up to ${resonantClarity} with allies.`}
        </p>
      )}
      {benefits.length > 0 && (
        <ul className="soul-beads-section-benefits">
          {benefits.map((benefit, index) => (
            <ClarityRow
              key={rowIds.ids[index]}
              index={index}
              benefit={benefit}
              active={index < active}
              canShare={resonantClarity > 0}
              onRemove={() => remove(index)}
            />
          ))}
        </ul>
      )}
      {benefits.length > clarity && <p className="fu-warning">Clarity SL {clarity} allows {clarity} benefits.</p>}
      {duplicates && <p className="fu-warning">Each benefit can only be chosen once.</p>}
      {shared > resonantClarity && <p className="fu-warning">Resonant Clarity SL {resonantClarity} shares up to {resonantClarity}.</p>}
    </Panel>
  )
}
