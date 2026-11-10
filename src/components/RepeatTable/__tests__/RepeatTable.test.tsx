import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { SheetProvider, type SheetUpdater } from '@/components/SheetProvider'
import { RepeatTable } from '../RepeatTable'
import type { RepeatTableRow } from '../RepeatTable.types'

const COLUMNS = [{ key: 'name', label: 'Name' }]

function Sheet({ onAction }: { onAction: (row: RepeatTableRow) => void }) {
  const [data, setData] = useState({ items: [{ name: 'Sword' }, { name: 'Axe' }] })
  return (
    <SheetProvider data={data} onChange={(update: SheetUpdater) => setData((current) => update(current) as typeof data)}>
      <RepeatTable
        path="items"
        columns={COLUMNS}
        createRow={() => ({ name: '' })}
        itemName="weapon"
        rowAction={{ icon: 'archive', label: 'Store', title: 'Store', onClick: onAction }}
      />
    </SheetProvider>
  )
}

describe('RepeatTable', () => {
  // jsdom has no ResizeObserver, which the table uses to switch to stacked rows.
  beforeAll(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    )
  })

  it('takes a row out of the table and hands it to the row action', () => {
    const onAction = vi.fn<(row: RepeatTableRow) => void>()
    render(<Sheet onAction={onAction} />)
    fireEvent.click(screen.getByRole('button', { name: 'Store weapon 1' }))
    expect(onAction).toHaveBeenCalledWith({ name: 'Sword' })
    expect(screen.getAllByRole('textbox').map((input) => (input as HTMLInputElement).value)).toEqual(['Axe'])
  })
})
