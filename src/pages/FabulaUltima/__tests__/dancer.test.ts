import { describe, expect, it } from 'vitest'
import { calculate } from '../utils/calculate'
import { createItem } from '../utils/createCharacter'
import { canDance, danceAmount, danceCost } from '../utils/dancer'
import { character, classWith } from './character'

const dancer = (previous: string) => ({ learned: [], notes: {}, current: '', previous })

describe('dancer', () => {
  it('costs 10 MP, or 5 after a different dance on the previous turn', () => {
    expect(danceCost(dancer(''), 'Lion Dance')).toBe(10)
    expect(danceCost(dancer('Lion Dance'), 'Lion Dance')).toBe(10)
    expect(danceCost(dancer('Bat Dance'), 'Lion Dance')).toBe(5)
  })

  it('adds 10 MP to share a dance with Follow My Lead, only for dances lasting until the next turn', () => {
    expect(danceCost(dancer(''), 'Bat Dance', true)).toBe(20)
    expect(danceCost(dancer('Lion Dance'), 'Bat Dance', true)).toBe(15)
    expect(danceCost(dancer(''), 'Lion Dance', true)).toBe(10)
  })

  it("can't dance in martial armor", () => {
    const sheet = character()
    expect(canDance(sheet)).toBe(true)
    const armored = { ...sheet, equipment: { ...sheet.equipment, armor: { ...createItem('armor'), martial: true } } }
    expect(canDance(armored)).toBe(false)
  })

  it('works out Maenad and Unicorn amounts from the current Dexterity die and level', () => {
    const at = (level: number) =>
      calculate(character({ attributes: { dex: '10', ins: '8', mig: '8', wlp: '8' }, classes: [classWith('Dancer', ['Dance', level])] }))
    expect(danceAmount('Maenad Dance', at(5))).toBe('10 MP loss')
    expect([at(5), at(20), at(40)].map((derived) => danceAmount('Unicorn Dance', derived))).toEqual(['10 HP each', '15 HP each', '20 HP each'])
    expect(danceAmount('Lion Dance', at(5))).toBeUndefined()
  })
})
