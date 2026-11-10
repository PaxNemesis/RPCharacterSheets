import { describe, expect, it } from 'vitest'
import { getPath, joinPath, setPath } from '../utils/path'

const data = { identity: { name: 'Ana' }, skills: [{ name: 'Pistol', level: 1 }], other: { kept: true } }

describe('getPath', () => {
  it('reads nested objects and list entries', () => {
    expect(getPath(data, 'identity.name')).toBe('Ana')
    expect(getPath(data, 'skills.0.level')).toBe(1)
    expect(getPath(data, '')).toBe(data)
  })

  it('is undefined for a path that doesn’t exist, rather than throwing', () => {
    expect(getPath(data, 'skills.4.level')).toBeUndefined()
    expect(getPath(data, 'identity.name.first')).toBeUndefined()
    expect(getPath(null, 'identity')).toBeUndefined()
  })
})

describe('setPath', () => {
  it('copies only the objects along the path', () => {
    const next = setPath(data, 'skills.0.level', 2) as typeof data
    expect(next.skills[0]).toEqual({ name: 'Pistol', level: 2 })
    expect(data.skills[0].level).toBe(1)
    expect(next).not.toBe(data)
    expect(next.skills).not.toBe(data.skills)
    expect(next.other).toBe(data.other)
    expect(Array.isArray(next.skills)).toBe(true)
  })

  it('creates objects that are missing along the path', () => {
    expect(setPath({}, 'identity.careerVariants.Sorcerer', 'Ice')).toEqual({ identity: { careerVariants: { Sorcerer: 'Ice' } } })
  })

  it('replaces the whole value for an empty path', () => {
    expect(setPath(data, '', 5)).toBe(5)
  })
})

describe('joinPath', () => {
  it('joins the parts and skips empty ones', () => {
    expect(joinPath('skills.3', 'name')).toBe('skills.3.name')
    expect(joinPath('', 'name')).toBe('name')
    expect(joinPath('skills.3', '')).toBe('skills.3')
  })
})
