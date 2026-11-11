import { useState } from 'react';
import { CheckTrack } from '@/components/CheckTrack';
import { Field } from '@/components/Field';
import { Panel } from '@/components/Panel';
import { useSheet } from '@/components/SheetProvider';
import { MP_PER_BEAD } from '../../../constants/monk';
import type { FuCharacter, FuDerived } from '../../../types';
import { soulBeadLimit } from '../../../utils/monk';

type BeadTrackerProps = {
  character: FuCharacter;
  derived: FuDerived;
};

type Pool = 'core' | 'resolve';

/** Core and Resolve Soul Beads during a conflict, and releasing them for 2 MP each (LF p. 101). */
export function BeadTracker({ character, derived }: BeadTrackerProps) {
  const { set } = useSheet();
  const [count, setCount] = useState(1);
  const limit = soulBeadLimit(derived);
  const { core, resolve } = character.monk;
  // A blank current MP counts as full.
  const mp = character.mp.current ?? derived.maxMp;
  const cost = count * MP_PER_BEAD;

  const release = (pool: Pool) => {
    set(`monk.${pool}`, character.monk[pool] - count);
    set('mp.current', mp - cost);
  };
  const releaseButton = (pool: Pool, label: string) => (
    <button type="button" onClick={() => release(pool)} disabled={character.monk[pool] < count || mp < cost}>
      Release {label}
    </button>
  );

  return (
    <Panel title="Soul Beads">
      <p className="fu-note">
        Limit {limit}: half your current Willpower die (d{derived.current('wlp')}), from 3 to 6 (LF p. 101).
      </p>
      <div className="soul-beads-section-pools">
        <span className="soul-beads-section-label">Core Beads</span>
        <CheckTrack path="monk.core" size={limit} label="Core Beads" mark="fill" />
        <span />
        <span className="soul-beads-section-label">Resolve Beads</span>
        <CheckTrack path="monk.resolve" size={limit} label="Resolve Beads" mark="fill" />
        <span />
      </div>
      {(core > limit || resolve > limit) && (
        <p className="fu-warning">You have more beads than your limit of {limit}.</p>
      )}
      <div className="soul-beads-section-release">
        <Field label="Beads to release">
          {(id) => (
            <select id={id} value={count} onChange={(event) => setCount(Number(event.target.value))}>
              {Array.from({ length: limit }, (_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1} (−{(index + 1) * MP_PER_BEAD} MP)
                </option>
              ))}
            </select>
          )}
        </Field>
        {releaseButton('core', 'Core')}
        {releaseButton('resolve', 'Resolve')}
        <span className={mp < cost ? 'fu-warning' : 'fu-note'}>
          MP {mp} of {derived.maxMp}
        </span>
      </div>
      <p className="fu-note">
        Starting a conflict in the bar at the bottom gives you full Core Beads. The book doesn&apos;t say when Resolve
        Beads come, so starting each of your turns turns one Core Bead into 2 Resolve Beads, unless they are full. Only
        Resolve Beads count for Clarity. Every bead a Skill releases costs {MP_PER_BEAD} MP.
      </p>
    </Panel>
  );
}
