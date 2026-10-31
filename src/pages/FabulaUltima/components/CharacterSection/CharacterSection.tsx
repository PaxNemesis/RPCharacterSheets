import { ImageField } from '@/components/ImageField'
import { Panel } from '@/components/Panel'
import { useFuCharacter } from '../../hooks/useFuCharacter'
import { AttributesPanel, BondsPanel, DefensePanel, IdentityPanel, PointsPanel } from './components'

export function CharacterSection() {
  const { character, derived } = useFuCharacter()

  return (
    <div className="fu-section">
      <IdentityPanel character={character} derived={derived} />
      <div className="fu-columns">
        <Panel title="Portrait">
          <ImageField path="portrait" label="Character portrait" />
        </Panel>
        <AttributesPanel derived={derived} />
      </div>
      <div className="fu-columns">
        <PointsPanel character={character} derived={derived} />
        <DefensePanel derived={derived} />
      </div>
      <BondsPanel count={character.bonds.length} />
    </div>
  )
}
