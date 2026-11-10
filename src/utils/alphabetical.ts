/** Compares names A–Z, ignoring case and punctuation so "’Jack Marshal" sorts under J. */
export const compareNames = (a: string, b: string) =>
  a.localeCompare(b, 'en', { sensitivity: 'base', ignorePunctuation: true });

export const alphabetical = (names: string[]) => [...names].sort(compareNames);
