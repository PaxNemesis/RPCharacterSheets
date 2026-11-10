import type { CSSProperties } from 'react'
import { NumberField } from '@/components/NumberField'
import { Panel } from '@/components/Panel'
import { useSheet } from '@/components/SheetProvider'
import { ASPECTS, STAT_KEYS, STAT_LABELS } from '../../../../constants/stats'
import type { IkCharacter, IkDerived } from '../../../../types'
import { startingStats } from '../../../../utils/rules'
import './StatsPanel.styles.css'

type StatsPanelProps = {
  character: IkCharacter
  derived: IkDerived
}

export function StatsPanel({ character, derived }: StatsPanelProps) {
  const { set } = useSheet()
  const raceRules = character.settings.raceRules
  const start = raceRules ? startingStats(character) : {}
  const canStart = Object.keys(start).length > 0
  const armorChangesSpeed = derived.armorSpeed !== null && derived.armorSpeed !== 0 && derived.speed !== null

  const applyStart = () => {
    const filled = STAT_KEYS.some((key) => character.stats[key]?.value !== null)
    if (filled && !window.confirm('Replace the current stats with the starting stats for this race?')) return
    set(
      'stats',
      Object.fromEntries(STAT_KEYS.map((key) => [key, { ...character.stats[key], value: start[key] ?? null }])),
    )
  }

  return (
    <Panel
      title="Stats"
      className="stats-panel-container"
      actions={
        canStart && (
          <button type="button" onClick={applyStart} title="Fill in the race's starting stats (p. 107)">
            Set starting stats
          </button>
        )
      }
    >
      {ASPECTS.map((aspect) => (
        <div key={aspect.key} className="stats-panel-aspect" style={{ '--aspect-color': aspect.color } as CSSProperties}>
          <h3>{aspect.label}</h3>
          <div className="stats-panel-row">
            {[aspect.primary, ...aspect.secondary].map((key) => (
              <div
                key={key}
                className={derived.overMax.includes(key) ? 'stats-panel-stat stats-panel-over' : 'stats-panel-stat'}
              >
                <NumberField path={`stats.${key}.value`} label={STAT_LABELS[key]} size="lg" />
                {raceRules ? (
                  <NumberField value={derived.statMax(key)} label="Max" size="sm" className="stats-panel-max" />
                ) : (
                  <NumberField path={`stats.${key}.max`} label="Max" size="sm" className="stats-panel-max" />
                )}
                {key === 'spd' && armorChangesSpeed && (
                  <NumberField value={derived.speed} label="In armor" size="sm" className="stats-panel-max" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      {derived.overMax.length > 0 && (
        <p className="ik-warning" role="status">
          Above the maximum: {derived.overMax.map((key) => STAT_LABELS[key]).join(', ')}.
        </p>
      )}
      <div className="stats-panel-willpower">
        <NumberField value={derived.willpower} label="Willpower (PHY + INT)" size="lg" />
        <p className="ik-note">
          {raceRules
            ? 'Max comes from the race and level. Start with the starting stats, then spend 3 advancement points (p. 107).'
            : 'ARC is only used by characters with the Gifted archetype.'}
          {armorChangesSpeed && ' SPD in armor is for movement; DEF and Initiative use the SPD stat (p. 106).'}
        </p>
      </div>
    </Panel>
  )
}
