import { Panel } from '@/components/Panel'
import type { IkCharacter, IkDerived } from '../../../../types'
import { formatParts, formatRoll, meleeRolls, rangedRolls, type Roll } from './utils/attackRolls'
import './AttacksPanel.styles.css'

type AttacksPanelProps = {
  character: IkCharacter
  derived: IkDerived
}

type Attack = { name: string; kind: string; attack: Roll; damage: Roll; range: string }

/** The number to add to the roll, and where it comes from, in one table cell. */
const rollCell = (roll: Roll) => (
  <td>
    <span className="attacks-panel-roll">{formatRoll(roll)}</span>
    {formatParts(roll) && <span className="attacks-panel-parts">{formatParts(roll)}</span>}
  </td>
)

/** The equipped weapons' attack and damage rolls, read-only, for use during play. */
export function AttacksPanel({ character, derived }: AttacksPanelProps) {
  const { stat } = derived
  const attacks: Attack[] = [
    ...character.rangedWeapons.map((weapon) => ({
      name: weapon.name.trim() || 'Unnamed ranged weapon',
      kind: 'Ranged',
      ...rangedRolls(weapon, stat),
      range: [weapon.rng, weapon.aoe && `AOE ${weapon.aoe}`].map((part) => part.trim()).filter(Boolean).join(', ') || '—',
    })),
    ...character.meleeWeapons.map((weapon) => ({
      name: weapon.name.trim() || 'Unnamed melee weapon',
      kind: 'Melee',
      ...meleeRolls(weapon, stat),
      range: 'Melee',
    })),
  ]

  return (
    <Panel title="Attacks" className="attacks-panel-container">
      {attacks.length === 0 ? (
        <p className="ik-note">Add weapons on the Weapons &amp; gear tab to see their attack and damage rolls here.</p>
      ) : (
        <>
          <table className="attacks-panel-table">
            <thead>
              <tr>
                <th scope="col">Weapon</th>
                <th scope="col">Attack (2d6 +)</th>
                <th scope="col">Damage (2d6 +)</th>
                <th scope="col">Range</th>
              </tr>
            </thead>
            <tbody>
              {attacks.map((attack, index) => (
                // oxlint-disable-next-line react/no-array-index-key -- Read-only rows with no state, in list order.
                <tr key={index}>
                  <th scope="row">
                    {attack.name}
                    <span className="attacks-panel-parts">{attack.kind}</span>
                  </th>
                  {rollCell(attack.attack)}
                  {rollCell(attack.damage)}
                  <td>{attack.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="ik-note">
            Attack rolls are against the target&apos;s DEF, damage rolls against its ARM. Edit, store and swap weapons on
            the Weapons &amp; gear tab.
          </p>
        </>
      )}
    </Panel>
  )
}
