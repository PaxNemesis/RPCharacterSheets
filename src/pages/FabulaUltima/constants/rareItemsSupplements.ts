import { accessories, armor, shields } from './rareItemRows'

// Rare armor, shields and accessories from the Atlases; conditional bonuses are left out.
export const SUPPLEMENT_RARE_ITEMS = [
  ...armor('high', [
    ['Dancing Dress', 80, false, null, 0, 2, -1],
    ['Elemental Robe', 80, false, null, 1, 2, -2],
    ['Orichalcum', 80, true, 12, 0, 0, -4],
  ]),
  ...shields('high', [
    ['Bag Shield', 80, false, 2, 0],
    ['Drumshield', 80, false, 2, 0],
    ['Argus', 80, true, 2, 2],
    ['Shield of Blades', 80, true, 2, 2],
    ['Parry Shield', 80, true, 2, 2],
  ]),
  ...accessories('high', [
    ['Ring of Denial', 81],
    ['Ring of the Occultist', 81],
    ['Ivory Ring', 81],
    ['Magic Palette', 81],
    ["Tactician's Diadem", 81],
    ["Alchemist's Bag", 81],
    ["Sorcerer's Pendant", 81],
    ['Dancing Ribbon', 81],
  ]),
  ...armor('natural', [
    ['Woolly Cuirass', 86, true, 11, 0, 0, -3],
    ['Engineer Jacket', 86, false, null, 1, 1, -1],
    ['Noble Dress', 86, false, null, 1, 1, 0],
    ['Apothecary Robes', 86, false, null, 1, 2, -2],
    ['Fairy Tunic', 86, false, null, 1, 2, -2],
  ]),
  ...shields('natural', [
    ['Plate Manica', 86, false, 2, 0],
    ['Lid Shield', 86, true, 2, 2],
    ['Lily Vambrace', 86, true, 2, 2],
  ]),
  ...accessories('natural', [
    ['Watering Can', 87],
    ['Spicy Powder', 87],
    ['Dandelion Obi', 87],
    ['Clockwork Heart', 87],
    ['Needlefrog Mantle', 87],
    ['Handmade Scarf', 87],
    ['Fallen Leaf Amulet', 87],
    ["Eccentric's Cookbook", 87],
  ]),
  ...armor('techno', [
    ['Misdirector', 84, false, null, 1, 1, -1],
    ['Lab Coat', 84, false, null, 1, 2, -2],
    ['Biocloak', 84, false, null, 1, 1, 0],
    ['Psyskeleton', 84, true, 11, 0, 1, -3],
  ]),
  ...shields('techno', [
    ['Icebreaker', 84, true, 2, 2],
    ['Ballistic Shield', 84, false, 2, 0],
    ['Windshield', 84, true, 2, 2],
    ['Hekat Shield', 84, true, 2, 2],
  ]),
  ...accessories('techno', [
    ['Spare Magazine', 85],
    ['Flashbang Grenades', 85],
    ['Gas Mask', 85],
    ['Maverick Helmet', 85],
    ['Ego Mask', 85],
    ['Medikit', 85],
    ['Portable Assembler', 85],
    ['Omnidex', 85],
  ]),
]
