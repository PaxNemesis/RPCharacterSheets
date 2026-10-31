export type SpiralCircle = { x: number; y: number; r: number }

export const SPIRAL_SIZE = 600
const CENTER = SPIRAL_SIZE / 2
const GAP = 12
const SHRINK = 0.62
const BADGE_RADIUS = 24
const OUTER_RADIUS = 252
const INNER_RADIUS = 222

const toRadians = (degrees: number) => (degrees * Math.PI) / 180
// Measured from the official sheet: about 23 units at the outside, 18 near the middle.
const circleRadius = (distance: number) => 14 + 0.042 * distance

/**
 * Lays out one branch of the life spiral as a chain of circles curling inward along a
 * logarithmic spiral, like the official sheet: three aspects 120° apart, each with an
 * outer (odd-numbered) and inner (even-numbered) branch starting at a numbered badge.
 */
export function branchLayout(aspectIndex: number, inner: boolean, count: number) {
  const startAngle = toRadians(-125 + aspectIndex * 120) + (inner ? 0.36 : 0)
  const startRadius = inner ? INNER_RADIUS : OUTER_RADIUS

  const point = (t: number): SpiralCircle => {
    const distance = startRadius * Math.exp(-SHRINK * t)
    const angle = startAngle - t
    return {
      x: CENTER + distance * Math.cos(angle),
      y: CENTER + distance * Math.sin(angle),
      r: circleRadius(distance),
    }
  }

  const badge = { ...point(0), r: BADGE_RADIUS }
  const circles: SpiralCircle[] = []
  let previous = badge
  let t = 0
  for (let i = 0; i < count; i++) {
    let next = point(t)
    // Walk along the spiral until the next circle just clears the previous one.
    while (Math.hypot(next.x - previous.x, next.y - previous.y) < previous.r + next.r + GAP) {
      t += 0.005
      next = point(t)
    }
    circles.push(next)
    previous = next
  }

  return { badge, circles }
}

/**
 * A path for the aspect name, following the outer branch's spiral just outside its circles.
 * It runs left to right (or top to bottom) so the text reads the right way up.
 */
export function labelPath(aspectIndex: number) {
  const startAngle = toRadians(-125 + aspectIndex * 120)
  const points = Array.from({ length: 24 }, (_, i) => {
    const t = 0.25 + (i / 23) * 1.1
    const distance = OUTER_RADIUS * Math.exp(-SHRINK * t)
    const offset = distance + circleRadius(distance) + 20
    const angle = startAngle - t
    return { x: CENTER + offset * Math.cos(angle), y: CENTER + offset * Math.sin(angle) }
  })
  const first = points[0]
  const last = points[points.length - 1]
  const forwards = Math.abs(last.x - first.x) > Math.abs(last.y - first.y) ? last.x > first.x : last.y > first.y
  const ordered = forwards ? points : points.reverse()
  return `M ${ordered.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')}`
}
