import type { ComponentType } from 'react';
import type { SheetProps } from '@/components/CharacterWorkspace';
import { Tabs } from '@/components/Tabs';
import { useFuCharacter } from '../hooks/useFuCharacter';
import type { FuCharacter } from '../types';
import { hasRulebookClass } from '../utils/rules';
import { CharacterSection } from './CharacterSection';
import { ClassesSection } from './ClassesSection';
import { ConflictBar } from './ConflictBar';
import { CookbookSection } from './CookbookSection';
import { DancesSection } from './DancesSection';
import { EquipmentSection } from './EquipmentSection';
import { GardenSection } from './GardenSection';
import { HunterSection } from './HunterSection';
import { MagicSection } from './MagicSection';
import { NotesSection } from './NotesSection';
import { SettingsSection } from './SettingsSection';
import { SoulBeadsSection } from './SoulBeadsSection';
import { SymbolsSection } from './SymbolsSection';
import { VersesSection } from './VersesSection';

type Section = {
  id: string;
  label: string;
  Component: ComponentType;
  /** Class-specific tabs only show for characters with that class. */
  isVisible?: (character: FuCharacter) => boolean;
};

const SECTIONS: Section[] = [
  { id: 'character', label: 'Character', Component: CharacterSection },
  { id: 'classes', label: 'Classes & skills', Component: ClassesSection },
  { id: 'equipment', label: 'Equipment', Component: EquipmentSection },
  { id: 'magic', label: 'Spells & rituals', Component: MagicSection },
  { id: 'cookbook', label: 'Cookbook', Component: CookbookSection, isVisible: (c) => hasRulebookClass(c, 'Gourmet') },
  { id: 'dances', label: 'Dances', Component: DancesSection, isVisible: (c) => hasRulebookClass(c, 'Dancer') },
  { id: 'garden', label: 'Garden', Component: GardenSection, isVisible: (c) => hasRulebookClass(c, 'Floralist') },
  { id: 'hunt', label: 'Hunt', Component: HunterSection, isVisible: (c) => hasRulebookClass(c, 'Hunter') },
  { id: 'soul-beads', label: 'Soul Beads', Component: SoulBeadsSection, isVisible: (c) => hasRulebookClass(c, 'Monk') },
  { id: 'symbols', label: 'Symbols', Component: SymbolsSection, isVisible: (c) => hasRulebookClass(c, 'Symbolist') },
  { id: 'verses', label: 'Verses', Component: VersesSection, isVisible: (c) => hasRulebookClass(c, 'Chanter') },
  { id: 'notes', label: 'Notes', Component: NotesSection },
  { id: 'settings', label: 'Settings', Component: SettingsSection },
];

export function FuSheet({ panel, onPanelChange }: SheetProps) {
  const { character } = useFuCharacter();
  const sections = SECTIONS.filter((section) => section.isVisible?.(character) ?? true);
  // An unknown panel, or one this character doesn't have, shows the first.
  const active = sections.find((section) => section.id === panel) ?? sections[0];

  return (
    <div className="fu-sheet">
      <Tabs label="Sheet sections" variant="secondary" items={sections} activeId={active.id} onSelect={onPanelChange} />
      <div className="fu-sheet-body">
        <active.Component />
      </div>
      <ConflictBar onPanelChange={onPanelChange} />
    </div>
  );
}
