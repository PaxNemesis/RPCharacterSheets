import { useState, type ComponentType } from 'react'
import { Tabs } from '@/components/Tabs'
import { useIkCharacter } from '../hooks/useIkCharacter'
import type { IkSettings } from '../IronKingdomsFmf.types'
import { CharacterSection } from './CharacterSection'
import { CombatSection } from './CombatSection'
import { GearSection } from './GearSection'
import { MagicSection } from './MagicSection'
import { NotesSection } from './NotesSection'
import { SettingsSection } from './SettingsSection'
import { SkillsSection } from './SkillsSection'
import { SteamjacksSection } from './SteamjacksSection'

type Section = {
  id: string
  label: string
  Component: ComponentType
  isVisible?: (settings: IkSettings) => boolean
}

const SECTIONS: Section[] = [
  { id: 'character', label: 'Character', Component: CharacterSection },
  { id: 'combat', label: 'Combat & damage', Component: CombatSection },
  { id: 'skills', label: 'Skills & abilities', Component: SkillsSection },
  { id: 'gear', label: 'Gear & armor', Component: GearSection },
  { id: 'magic', label: 'Magic & mechanika', Component: MagicSection, isVisible: (s) => s.magic || s.mechanika },
  { id: 'steamjacks', label: 'Steamjacks', Component: SteamjacksSection, isVisible: (s) => s.steamjacks },
  { id: 'notes', label: 'Notes', Component: NotesSection },
  { id: 'settings', label: 'Settings', Component: SettingsSection },
]

export function IkSheet() {
  const { character } = useIkCharacter()
  const [sectionId, setSectionId] = useState(SECTIONS[0].id)
  const sections = SECTIONS.filter((section) => section.isVisible?.(character.settings) ?? true)
  const active = sections.find((section) => section.id === sectionId) ?? sections[0]

  return (
    <div className="ik-sheet">
      <Tabs label="Sheet sections" variant="secondary" items={sections} activeId={active.id} onSelect={setSectionId} />
      <active.Component />
    </div>
  )
}
