import { Fragment } from 'react';
import { Panel } from '@/components/Panel';
import type { IkCharacter, IkDerived } from '../../../../types';
import { formatPart, formatRoll, meleeRolls, rangedRolls, type Roll } from './utils/attackRolls';
import './AttacksPanel.styles.css';

type AttacksPanelProps = {
  character: IkCharacter;
  derived: IkDerived;
};

/** `detail` is the kind of weapon, with range and AOE for ranged weapons: "Ranged · RNG 8 · AOE 3". */
type Attack = { name: string; detail: string; attack: Roll; damage: Roll };

/** "Attack 2d6 +", with the dice in a lighter style, as a column header and as a card's cell label. */
const rollLabel = (label: string) => (
  <>
    {label} <span className="attacks-panel-dice">2d6 +</span>
  </>
);

/**
 * The number to add to the roll, and where it comes from, in one table cell. Each part stays on one
 * line, so a long breakdown only wraps between parts. The label is only shown when rows become cards;
 * screen readers get it from the column header.
 */
const rollCell = (roll: Roll, label: string) => (
  <td>
    <span className="attacks-panel-cell-label" aria-hidden="true">
      {rollLabel(label)}
    </span>
    <span className="attacks-panel-roll">{formatRoll(roll)}</span>
    {roll.parts.length > 0 && (
      <span className="attacks-panel-parts">
        {/* The space before each "+" sits outside the parts, so lines only break there. */}
        {roll.parts.map((part, index) => (
          <Fragment key={part.label}>
            {index > 0 && ' '}
            <span className="attacks-panel-part">
              {index > 0 && '+ '}
              {formatPart(part)}
            </span>
          </Fragment>
        ))}
      </span>
    )}
  </td>
);

/** The equipped weapons' attack and damage rolls, read-only, for use during play. */
export function AttacksPanel({ character, derived }: AttacksPanelProps) {
  const { stat } = derived;
  const attacks: Attack[] = [
    ...character.rangedWeapons.map((weapon) => ({
      name: weapon.name.trim() || 'Unnamed ranged weapon',
      detail: [
        'Ranged',
        weapon.rng.trim() && `RNG ${weapon.rng.trim()}`,
        weapon.aoe.trim() && `AOE ${weapon.aoe.trim()}`,
      ]
        .filter(Boolean)
        .join(' · '),
      ...rangedRolls(weapon, stat),
    })),
    ...character.meleeWeapons.map((weapon) => ({
      name: weapon.name.trim() || 'Unnamed melee weapon',
      detail: 'Melee',
      ...meleeRolls(weapon, stat),
    })),
  ];

  return (
    <Panel title="Attacks" className="attacks-panel-container">
      {attacks.length === 0 ? (
        <p className="ik-note">Add weapons on the Weapons &amp; gear tab to see their attack and damage rolls here.</p>
      ) : (
        <>
          <div className="attacks-panel-table-wrap">
            <table className="attacks-panel-table">
              <thead>
                <tr>
                  <th scope="col">Weapon</th>
                  <th scope="col">{rollLabel('Attack')}</th>
                  <th scope="col">{rollLabel('Damage')}</th>
                </tr>
              </thead>
              <tbody>
                {attacks.map((attack, index) => (
                  // oxlint-disable-next-line react/no-array-index-key -- Read-only rows with no state, in list order.
                  <tr key={index}>
                    <th scope="row">
                      {attack.name}
                      <span className="attacks-panel-parts">{attack.detail}</span>
                    </th>
                    {rollCell(attack.attack, 'Attack')}
                    {rollCell(attack.damage, 'Damage')}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="ik-note">
            Attack rolls are against the target&apos;s DEF, damage rolls against its ARM. Edit, store and swap weapons
            on the Weapons &amp; gear tab.
          </p>
        </>
      )}
    </Panel>
  );
}
