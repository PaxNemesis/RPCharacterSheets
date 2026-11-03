import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useRowIds } from '../hooks/useRowIds'

describe('useRowIds', () => {
  it('gives each row a unique id', () => {
    const { result } = renderHook(() => useRowIds(3))
    expect(new Set(result.current.ids).size).toBe(3)
  })

  it('keeps existing ids when rows are added or dropped at the end', () => {
    const { result, rerender } = renderHook(({ count }) => useRowIds(count), { initialProps: { count: 2 } })
    const [first, second] = result.current.ids
    rerender({ count: 3 })
    expect(result.current.ids.slice(0, 2)).toEqual([first, second])
    rerender({ count: 1 })
    expect(result.current.ids).toEqual([first])
  })

  it('moves and removes ids with their rows', () => {
    const { result } = renderHook(() => useRowIds(3))
    const [a, b, c] = result.current.ids
    act(() => result.current.move(0, 2))
    expect(result.current.ids).toEqual([b, c, a])
    act(() => result.current.remove(1))
    // The table has one row fewer by now; the hook only drops the removed id.
    expect(result.current.ids.slice(0, 2)).toEqual([b, a])
  })
})
