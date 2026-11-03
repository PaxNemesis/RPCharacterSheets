import { Panel } from '@/components/Panel'
import type { FuCharacter, FuDerived } from '../../../types'
import { monkSkills, soulBeadLimit, soulRenewal } from '../../../utils/monk'

type MonkSkillsPanelProps = {
  character: FuCharacter
  derived: FuDerived
}

/** The numbers for the Skills that release Soul Beads, from their Skill Levels (LF pp. 102–103). */
export function MonkSkillsPanel({ character, derived }: MonkSkillsPanelProps) {
  const sl = monkSkills(character)
  const fullResolve = character.monk.resolve >= soulBeadLimit(derived)
  const crystalClear = character.heroicSkills.some((skill) => skill.name.trim().toLowerCase() === 'crystal clear')
  const rows = [
    sl.soulRenewal > 0 && ['Soul Renewal', `${soulRenewal(derived.level)} HP or MP per bead, up to three creatures.`],
    sl.spiritShot > 0 && [
      'Spirit Shot',
      `【DEX + WLP】, now d${derived.current('dex')} + d${derived.current('wlp')}. ${sl.spiritShot * 4} HP or MP loss per bead, ignoring Resistances.`,
    ],
    sl.spiritualFortress > 0 && ['Spiritual Fortress', `−${sl.spiritualFortress * 2} damage per bead, before Affinities, for up to three creatures.`],
    crystalClear && [
      'Crystal Clear',
      `+2 Defense, Magic Defense and Accuracy while your Resolve Beads are full${fullResolve ? ' (active now)' : ''}; +1 for allies through Resonant Clarity.`,
    ],
  ].filter((row): row is [string, string] => Boolean(row))

  return (
    <Panel title="Bead Skills">
      {rows.length === 0 ? (
        <p className="fu-note">Learn Soul Renewal, Spirit Shot or Spiritual Fortress to release your beads (LF p. 102).</p>
      ) : (
        <dl className="soul-beads-section-skills">
          {rows.map(([name, text]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      )}
      <p className="fu-note">Each bead released costs 2 MP. Skills: LF p. 102; Heroic Skills: LF p. 103.</p>
    </Panel>
  )
}
