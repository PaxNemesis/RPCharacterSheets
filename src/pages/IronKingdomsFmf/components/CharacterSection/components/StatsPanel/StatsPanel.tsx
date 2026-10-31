import type { CSSProperties } from 'react'
import { NumberField } from '@/components/NumberField'
import { Panel } from '@/components/Panel'
import { ASPECTS, STAT_LABELS } from '../../../../constants/stats'
import type { Num } from '../../../../IronKingdomsFmf.types'
import './StatsPanel.styles.css'

type StatsPanelProps = {
  willpower: Num
}

export function StatsPanel({ willpower }: StatsPanelProps) {
  return (
    <Panel title="Stats" className="stats-panel-container">
      {ASPECTS.map((aspect) => (
        <div
          key={aspect.key}
          className="stats-panel-aspect"
          style={{ '--aspect-color': aspect.color } as CSSProperties}
        >
          <h3>{aspect.label}</h3>
          <div className="stats-panel-row">
            {[aspect.primary, ...aspect.secondary].map((key) => (
              <div key={key} className="stats-panel-stat">
                <NumberField path={`stats.${key}.value`} label={STAT_LABELS[key]} size="lg" />
                <NumberField path={`stats.${key}.max`} label="Max" size="sm" className="stats-panel-max" />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="stats-panel-willpower">
        <NumberField value={willpower} label="Willpower (PHY + INT)" size="lg" />
        <p className="ik-note">ARC is only used by characters with the Gifted archetype.</p>
      </div>
    </Panel>
  )
}
