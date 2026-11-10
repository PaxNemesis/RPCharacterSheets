import type { QuirkData, SupplementId } from '../types';

const quirks = (book: SupplementId, list: [string, number][]): QuirkData[] =>
  list.map(([name, page]) => ({ name, book, page }));

// Survivor's own bonus; it also offers a choice of martial equipment, a spell or +2 IP.
const SURVIVOR = { hp: 5, mp: 5 };

/** Quirks from the Atlases (HF pp. 114–123, NF pp. 120–129, TF pp. 120–129). */
export const QUIRKS: QuirkData[] = [
  ...quirks('high', [
    ['Arboreal', 115],
    ['Cursed', 115],
    ['Elemental Soul', 116],
    ['Empty Hands', 116],
    ['Fettered Heart', 117],
    ['Flight', 118],
    ['From a Distant World', 118],
    ['Glorious Fate', 119],
    ['Heirloom', 120],
    ['Old Transport', 120],
    ['Revenant', 120],
    ['Rival Prodigies', 121],
    ['Robot', 122],
    ['Ruinbringer', 122],
    ['Souls Entwined', 123],
  ]),
  ...quirks('natural', [
    ['Ancient Weapon', 121],
    ['Arboreal', 121],
    ['Big Bro', 122],
    ['Cursed', 122],
    ['Elemental Soul', 123],
    ['Flight', 123],
    ['Mysterious Grimoire', 124],
    ['Outcast Fairy', 125],
    ['Robot', 125],
    ['Stubborn Scion', 126],
    ['Survivor', 127],
    ['The Beast Who Spoke', 127],
    ['The Long Dream', 128],
    ['Traveling Workshop', 128],
    ['Underchild', 129],
  ]),
  ...quirks('techno', [
    ['Agitator', 121],
    ['Cognitive Ghost', 121],
    ['Diabolist', 122],
    ['Enigmatic Relic', 123],
    ['From a Distant World', 124],
    ['Fugitive Experiment', 124],
    ['Hundred Faces', 124],
    ['Inventor Prodigy', 125],
    ['Neo-Human', 125],
    ['Planet Oracle', 125],
    ['Repentant Enforcer', 126],
    ['Robot', 127],
    ['Stolen Transport', 127],
    ['Survivor', 127],
    ['The Beast Who Spoke', 128],
    ['Xiphosymbiosis', 129],
  ]),
].map((quirk) => (quirk.name === 'Survivor' ? { ...quirk, bonus: SURVIVOR, survivor: true } : quirk));

/** Stored on the character as "book:name", since several books have a Quirk of the same name. */
export const quirkId = (quirk: QuirkData) => `${quirk.book}:${quirk.name}`;

export const findQuirk = (id: string) => QUIRKS.find((quirk) => quirkId(quirk) === id);
