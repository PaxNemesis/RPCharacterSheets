const RANGE = 2 ** 32;

/**
 * Rolls a die with this many sides, from 1 to `sides`, using the browser's cryptographically secure
 * random numbers. Values from the top of the range that would make some faces come up more often
 * than others are drawn again, so every face is exactly as likely.
 */
export function rollDie(sides: number): number {
  if (!Number.isInteger(sides) || sides < 1 || sides > RANGE) throw new RangeError(`A die can't have ${sides} sides`);
  // The largest multiple of `sides` that fits; anything from here up is drawn again.
  const limit = RANGE - (RANGE % sides);
  const value = new Uint32Array(1);
  do crypto.getRandomValues(value);
  while (value[0] >= limit);
  return (value[0] % sides) + 1;
}
