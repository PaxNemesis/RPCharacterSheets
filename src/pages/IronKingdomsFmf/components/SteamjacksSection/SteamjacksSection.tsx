import { useState } from 'react'
import { SheetProvider, useSheetField } from '@/components/SheetProvider'
import { Tabs } from '@/components/Tabs'
import type { IkSteamjack } from '../../types'
import { createSteamjack } from '../../utils/createCharacter'
import { SteamjackSheet } from './components'

export function SteamjacksSection() {
  const [steamjacks, setSteamjacks] = useSheetField<IkSteamjack[]>('steamjacks')
  const [selected, setSelected] = useState(0)
  const list = steamjacks ?? []
  const index = Math.min(selected, list.length - 1)
  const nameOf = (jack: IkSteamjack, i: number) => jack.name.trim() || `Steamjack ${i + 1}`

  const add = () => {
    setSteamjacks([...list, createSteamjack()])
    setSelected(list.length)
  }

  const remove = (id: string) => {
    const i = Number(id)
    if (!window.confirm(`Remove ${nameOf(list[i], i)} and everything recorded for it?`)) return
    setSteamjacks(list.filter((_, other) => other !== i))
    setSelected(Math.max(0, i - 1))
  }

  if (list.length === 0) {
    return (
      <div className="ik-section">
        <p className="ik-note">No steamjacks yet.</p>
        <button type="button" onClick={add} className="ik-start">
          + Add steamjack
        </button>
      </div>
    )
  }

  return (
    <div className="ik-section">
      <Tabs
        label="Steamjacks"
        variant="secondary"
        items={list.map((jack, i) => ({ id: String(i), label: nameOf(jack, i) }))}
        activeId={String(index)}
        onSelect={(id) => setSelected(Number(id))}
        onClose={remove}
        trailing={
          <button type="button" onClick={add}>
            + Add steamjack
          </button>
        }
      />
      <SheetProvider key={index} path={`steamjacks.${index}`}>
        <SteamjackSheet />
      </SheetProvider>
    </div>
  )
}
