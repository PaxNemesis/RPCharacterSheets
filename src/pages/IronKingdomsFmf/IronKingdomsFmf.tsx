import { CharacterWorkspace } from '@/components/CharacterWorkspace'
import { ironKingdomsFmf } from './utils/ironKingdomsFmf'
import './IronKingdomsFmf.styles.css'

export function IronKingdomsFmf() {
  return (
    <div className="iron-kingdoms-fmf-page">
      <CharacterWorkspace system={ironKingdomsFmf} />
    </div>
  )
}
