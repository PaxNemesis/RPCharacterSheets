import { useId, useMemo, type KeyboardEvent } from 'react'
import { ASPECTS } from '../../../../constants/stats'
import { branchLayout, labelPath, SPIRAL_SIZE } from './utils/spiralLayout'
import './LifeSpiral.styles.css'

// Circles per branch on the official sheet: 5 for Physique, 4 for Agility and Intellect.
const SHEET_SLOTS = [5, 5, 4, 4, 4, 4]

type LifeSpiralProps = {
  /** Vitality points per branch. */
  sizes: number[]
  /** Marked vitality points per branch. */
  marked: number[]
  onMark: (branch: number, count: number) => void
}

const cogPath = (() => {
  const teeth = 14
  const points = Array.from({ length: teeth * 4 }, (_, i) => {
    const angle = (i / (teeth * 4)) * Math.PI * 2
    const radius = i % 4 < 2 ? 292 : 262
    return `${SPIRAL_SIZE / 2 + radius * Math.cos(angle)},${SPIRAL_SIZE / 2 + radius * Math.sin(angle)}`
  })
  return `M ${points.join(' L ')} Z`
})()

export function LifeSpiral({ sizes, marked, onMark }: LifeSpiralProps) {
  const id = useId()
  const branches = useMemo(
    () =>
      SHEET_SLOTS.map((slots, branch) => {
        const aspectIndex = Math.floor(branch / 2)
        return branchLayout(aspectIndex, branch % 2 === 1, Math.max(slots, sizes[branch]))
      }),
    [sizes],
  )

  const toggle = (branch: number, point: number) => {
    const count = Math.min(marked[branch] ?? 0, sizes[branch])
    onMark(branch, point + 1 === count ? point : point + 1)
  }

  const onKey = (event: KeyboardEvent, branch: number, point: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle(branch, point)
    }
  }

  return (
    <svg className="life-spiral-container" viewBox={`0 0 ${SPIRAL_SIZE} ${SPIRAL_SIZE}`} role="group" aria-label="Life spiral">
      <path d={cogPath} className="life-spiral-cog" />
      {branches.map(({ badge, circles }, branch) => {
        const aspect = ASPECTS[Math.floor(branch / 2)]
        const unused = circles.length - sizes[branch]
        const count = Math.min(marked[branch] ?? 0, sizes[branch])
        const line = [badge, ...circles].map((c) => `${c.x},${c.y}`).join(' ')
        return (
          <g key={branch} style={{ color: aspect.color }}>
            {branch % 2 === 0 && (
              <>
                <path id={`${id}-label-${branch}`} d={labelPath(branch / 2)} fill="none" />
                <text className="life-spiral-aspect">
                  <textPath href={`#${id}-label-${branch}`} startOffset="50%" textAnchor="middle">
                    {aspect.label.toUpperCase()}
                  </textPath>
                </text>
              </>
            )}
            <polyline points={line} className="life-spiral-line" />
            {circles.map((c, index) => {
              if (index < unused) {
                return <circle key={index} cx={c.x} cy={c.y} r={c.r} className="life-spiral-unused" />
              }
              const point = index - unused
              const isMarked = point < count
              return (
                <g
                  key={index}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isMarked}
                  aria-label={`Branch ${branch + 1} (${aspect.label}) box ${point + 1}`}
                  className={isMarked ? 'life-spiral-point life-spiral-marked' : 'life-spiral-point'}
                  onClick={() => toggle(branch, point)}
                  onKeyDown={(event) => onKey(event, branch, point)}
                >
                  <circle cx={c.x} cy={c.y} r={c.r} />
                  {isMarked && (
                    <path
                      d={`M ${c.x - c.r * 0.5} ${c.y - c.r * 0.5} L ${c.x + c.r * 0.5} ${c.y + c.r * 0.5} M ${c.x + c.r * 0.5} ${c.y - c.r * 0.5} L ${c.x - c.r * 0.5} ${c.y + c.r * 0.5}`}
                    />
                  )}
                </g>
              )
            })}
            <circle cx={badge.x} cy={badge.y} r={badge.r} className="life-spiral-badge" />
            <text x={badge.x} y={badge.y} className="life-spiral-number">
              {branch + 1}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
