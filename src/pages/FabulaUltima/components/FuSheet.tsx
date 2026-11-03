import { useState, type ComponentType } from 'react'
import { Tabs } from '@/components/Tabs'
import { useFuCharacter } from '../hooks/useFuCharacter'
import type { FuCharacter } from '../types'
import { hasRulebookClass } from '../utils/rules'
import { CharacterSection } from './CharacterSection'
import { ClassesSection } from './ClassesSection'
import { CookbookSection } from './CookbookSection'
import { EquipmentSection } from './EquipmentSection'
import { GardenSection } from './GardenSection'
import { MagicSection } from './MagicSection'
import { NotesSection } from './NotesSection'
import { SettingsSection } from './SettingsSection'
import { SoulBeadsSection } from './SoulBeadsSection'

type Section = {
  id: string
  label: string
  Component: ComponentType
  /** Class-specific tabs only show for characters with that class. */
  isVisible?: (character: FuCharacter) => boolean
}

const SECTIONS: Section[] = [
  { id: 'character', label: 'Character', Component: CharacterSection },
  { id: 'classes', label: 'Classes & skills', Component: ClassesSection },
  { id: 'equipment', label: 'Equipment', Component: EquipmentSection },
  { id: 'magic', label: 'Spells & rituals', Component: MagicSection },
  { id: 'garden', label: 'Garden', Component: GardenSection, isVisible: (c) => hasRulebookClass(c, 'Floralist') },
  { id: 'cookbook', label: 'Cookbook', Component: CookbookSection, isVisible: (c) => hasRulebookClass(c, 'Gourmet') },
  { id: 'soul-beads', label: 'Soul Beads', Component: SoulBeadsSection, isVisible: (c) => hasRulebookClass(c, 'Monk') },
  { id: 'notes', label: 'Notes', Component: NotesSection },
  { id: 'settings', label: 'Settings', Component: SettingsSection },
]

export function FuSheet() {
  const { character } = useFuCharacter()
  const [sectionId, setSectionId] = useState(SECTIONS[0].id)
  const sections = SECTIONS.filter((section) => section.isVisible?.(character) ?? true)
  const active = sections.find((section) => section.id === sectionId) ?? sections[0]

  return (
    <div className="fu-sheet">
      <Tabs label="Sheet sections" variant="secondary" items={sections} activeId={active.id} onSelect={setSectionId} />
      <active.Component />
    </div>
  )
}
