import { useState } from 'react';
import { useSheet } from '@/components/SheetProvider';
import { bookRef } from '../../constants/books';
import { DANCES, DURATION_LABELS } from '../../constants/dancer';
import { useFuCharacter } from '../../hooks/useFuCharacter';
import { canDance, danceAmount, danceCost, dancerSkills, isDiscounted } from '../../utils/dancer';
import { LearnedList } from '../LearnedList';
import { DanceTurnPanel } from './components';
import './DancesSection.styles.css';

/** The Dancer's dances, and performing them during a conflict (HF pp. 142–145). */
export function DancesSection() {
  const { character, derived } = useFuCharacter();
  const { set } = useSheet();
  // Whether the next dance is shared with Follow My Lead; it only lasts for one dance.
  const [shared, setShared] = useState(false);
  const { dancer } = character;
  const { dance } = dancerSkills(character);
  // A blank current MP counts as full.
  const mp = character.mp.current ?? derived.maxMp;

  const perform = (name: string) => {
    set('dancer.current', name);
    set('mp.current', mp - danceCost(dancer, name, shared));
    setShared(false);
  };
  const entries = DANCES.map((entry) => ({
    name: entry.name,
    ref: bookRef('high', entry.page),
    detail: [DURATION_LABELS[entry.duration], entry.element, danceAmount(entry.name, derived)]
      .filter(Boolean)
      .join(' · '),
  }));

  return (
    <div className="fu-section dances-section-container">
      <DanceTurnPanel character={character} derived={derived} shared={shared} onShare={setShared} />
      <LearnedList
        title="Dances"
        noun="dance"
        entries={entries}
        path="dancer.learned"
        notesPath="dancer.notes"
        limit={dance}
        limitNote="you learn a dance each time you take the Dance Skill (HF p. 143)."
        highlight={dancer.current}
        renderActions={(name) => {
          const cost = danceCost(dancer, name, shared);
          const discounted = isDiscounted(dancer, name);
          const title = dancer.current
            ? 'Only one dance per turn'
            : discounted
              ? `Cheaper: a different dance from last turn's ${dancer.previous}`
              : name === dancer.previous
                ? 'Full cost: the same dance as last turn'
                : undefined;
          return (
            <button
              type="button"
              className={discounted ? 'dances-section-discount' : undefined}
              onClick={() => perform(name)}
              disabled={!canDance(character) || dancer.current !== '' || mp < cost}
              title={title}
            >
              Perform (−{cost} MP)
            </button>
          );
        }}
      />
    </div>
  );
}
