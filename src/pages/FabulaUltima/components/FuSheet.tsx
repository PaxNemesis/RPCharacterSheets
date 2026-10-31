import { useState, type ComponentType } from 'react'
import { Tabs } from '@/components/Tabs'
import { CharacterSection } from './CharacterSection'
import { ClassesSection } from './ClassesSection'
import { EquipmentSection } from './EquipmentSection'
import { MagicSection } from './MagicSection'
import { NotesSection } from './NotesSection'
import { SettingsSection } from './SettingsSection'

const SECTIONS: { id: string; label: string; Component: ComponentType }[] = [
  { id: 'character', label: 'Character', Component: CharacterSection },
  { id: 'classes', label: 'Classes & skills', Component: ClassesSection },
  { id: 'equipment', label: 'Equipment', Component: EquipmentSection },
  { id: 'magic', label: 'Spells & rituals', Component: MagicSection },
  { id: 'notes', label: 'Notes', Component: NotesSection },
  { id: 'settings', label: 'Settings', Component: SettingsSection },
]

export function FuSheet() {
  const [sectionId, setSectionId] = useState(SECTIONS[0].id)
  const active = SECTIONS.find((section) => section.id === sectionId) ?? SECTIONS[0]

  return (
    <div className="fu-sheet">
      <Tabs label="Sheet sections" variant="secondary" items={SECTIONS} activeId={active.id} onSelect={setSectionId} />
      <active.Component />
    </div>
  )
}
