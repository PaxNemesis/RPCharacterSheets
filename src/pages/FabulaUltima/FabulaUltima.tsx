import { CharacterWorkspace } from '@/components/CharacterWorkspace'
import { fabulaUltima } from './utils/fabulaUltima'
import './FabulaUltima.styles.css'

export function FabulaUltima() {
  return (
    <div className="fabula-ultima-page">
      <CharacterWorkspace system={fabulaUltima} />
    </div>
  )
}
