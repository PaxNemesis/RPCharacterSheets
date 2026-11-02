import { useFuCharacter } from '../../hooks/useFuCharacter'
import { skillLevel } from '../../utils/rules'
import { CombinationsPanel, IngredientsPanel } from './components'
import './CookbookSection.styles.css'

/** The Gourmet's ingredients and cookbook of taste combinations (NF pp. 149–153). */
export function CookbookSection() {
  const { character } = useFuCharacter()
  const cooking = skillLevel(character, 'Gourmet', 'Cooking')

  return (
    <div className="fu-section cookbook-section-container">
      <IngredientsPanel gourmet={character.gourmet} cooking={cooking} />
      <CombinationsPanel gourmet={character.gourmet} />
    </div>
  )
}
