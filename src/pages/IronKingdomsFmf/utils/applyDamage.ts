/**
 * Marks `amount` damage on the life spiral, starting in `branch` (0–5) and continuing in the
 * next branch clockwise that has room once a branch is full (p. 215).
 */
export function applyDamage(marked: number[], sizes: number[], branch: number, amount: number) {
  const next = sizes.map((size, i) => Math.min(marked[i] ?? 0, size))
  let remaining = amount
  let current = branch

  for (let steps = 0; remaining > 0 && steps < sizes.length; steps++) {
    const used = Math.min(sizes[current] - next[current], remaining)
    next[current] += used
    remaining -= used
    current = (current + 1) % sizes.length
  }
  return next
}
