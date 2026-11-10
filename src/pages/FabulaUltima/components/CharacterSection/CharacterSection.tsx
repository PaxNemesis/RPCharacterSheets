import { ImageField } from '@/components/ImageField';
import { Panel } from '@/components/Panel';
import { useFuCharacter } from '../../hooks/useFuCharacter';
import { AttributesPanel, BondsPanel, DefensePanel, IdentityPanel, PointsPanel, QuirkPanel } from './components';

export function CharacterSection() {
  const { character, derived } = useFuCharacter();

  return (
    <div className="fu-section">
      <IdentityPanel character={character} derived={derived} />
      {/* Portrait and Quirk beside a stack of the stat panels, so a tall image doesn't leave a gap. */}
      <div className="fu-portrait-layout">
        <div className="fu-stack">
          <Panel title="Portrait">
            <ImageField path="portrait" label="Character portrait" />
          </Panel>
          {character.settings.quirks && <QuirkPanel character={character} />}
        </div>
        <div className="fu-stack">
          <AttributesPanel derived={derived} />
          <PointsPanel character={character} derived={derived} />
          <DefensePanel derived={derived} />
        </div>
      </div>
      <BondsPanel count={character.bonds.length} />
    </div>
  );
}
