import { useFuCharacter } from '../../hooks/useFuCharacter';
import { BeadTracker, ClarityPanel, MonkSkillsPanel } from './components';
import './SoulBeadsSection.styles.css';

/** The Monk's Soul Beads, Clarity benefits and bead Skills (LF pp. 101–103). */
export function SoulBeadsSection() {
  const { character, derived } = useFuCharacter();

  return (
    <div className="fu-section soul-beads-section-container">
      <BeadTracker character={character} derived={derived} />
      <ClarityPanel character={character} />
      <MonkSkillsPanel character={character} derived={derived} />
    </div>
  );
}
