import { ImageField } from '@/components/ImageField'
import { Panel } from '@/components/Panel'
import { useIkCharacter } from '../../hooks/useIkCharacter'
import { DerivedPanel, IdentityPanel, StatsPanel } from './components'

export function CharacterSection() {
  const { derived } = useIkCharacter()

  return (
    <div className="ik-section">
      <IdentityPanel />
      <div className="ik-columns">
        <Panel title="Portrait">
          <ImageField path="portrait" label="Character portrait" />
        </Panel>
        <StatsPanel willpower={derived.willpower} />
      </div>
      <DerivedPanel derived={derived} />
    </div>
  )
}
