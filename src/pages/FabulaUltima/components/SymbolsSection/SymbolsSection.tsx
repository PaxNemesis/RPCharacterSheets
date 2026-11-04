import { bookRef } from '../../constants/books'
import { SYMBOL_CHOICES, SYMBOLS } from '../../constants/symbolist'
import { useFuCharacter } from '../../hooks/useFuCharacter'
import { forbiddanceLoss, symbolLimits } from '../../utils/symbolist'
import { LearnedList } from '../LearnedList'
import { ActiveSymbolsPanel, SymbolSkillsPanel } from './components'
import './SymbolsSection.styles.css'

/** The Symbolist's symbols, and those active on creatures right now (HF pp. 146–151). */
export function SymbolsSection() {
  const { character, derived } = useFuCharacter()
  const entries = SYMBOLS.map((symbol) => ({
    name: symbol.name,
    ref: bookRef('high', symbol.page),
    detail: [
      symbol.choice && `Choose a ${SYMBOL_CHOICES[symbol.choice].label}`,
      symbol.name === 'Symbol of Forbiddance' && `${forbiddanceLoss(derived.level)} HP and MP`,
    ]
      .filter(Boolean)
      .join(' · '),
  }))

  return (
    <div className="fu-section symbols-section-container">
      <ActiveSymbolsPanel character={character} derived={derived} />
      <SymbolSkillsPanel character={character} />
      <LearnedList
        title="Symbols"
        noun="symbol"
        entries={entries}
        path="symbolist.learned"
        notesPath="symbolist.notes"
        limit={symbolLimits(character).learned}
        limitNote="you learn two symbols each time you take the Symbolism Skill (HF p. 147)."
      />
    </div>
  )
}
