import { Panel } from '@/components/Panel';
import { DANCE_MP, DANCE_MP_AFTER_OTHER, FOLLOW_MY_LEAD_MP } from '../../../constants/dancer';
import type { FuCharacter, FuDerived } from '../../../types';
import { canDance, dancerSkills, findDance } from '../../../utils/dancer';
import { hasWeaponCategory } from '../../../utils/equip';

type DanceTurnPanelProps = {
  character: FuCharacter;
  derived: FuDerived;
  /** Whether the next dance is shared with an ally through Follow My Lead. */
  shared: boolean;
  onShare: (shared: boolean) => void;
};

/** The dance performed this turn and last turn, and what the Dancer's Skills add to it (HF p. 143). */
export function DanceTurnPanel({ character, derived, shared, onShare }: DanceTurnPanelProps) {
  const { current, previous } = character.dancer;
  const sl = dancerSkills(character);
  const lasting = findDance(current)?.duration === 'turn';

  const bonuses = [
    sl.wardancer > 0 &&
      `Wardancer: +${sl.wardancer} damage with brawling, dagger, flail and thrown weapons` +
        (hasWeaponCategory(character, 'arcane') ? ', and with offensive spells' : ''),
    sl.freneticFootwork > 0 &&
      lasting &&
      `Frenetic Footwork: +${sl.freneticFootwork * 2} to Opposed Checks of acrobatics, coordination or speed`,
    sl.quickChange > 0 && 'Quick-Change: a free Equipment action',
  ].filter((bonus): bonus is string => Boolean(bonus));

  return (
    <Panel title="This turn">
      {!canDance(character) && <p className="fu-warning">You can&apos;t perform dances with martial armor equipped.</p>}
      <p>
        {current ? (
          <>
            Performed <strong>{current}</strong>
            {lasting && ', lasting until the start of your next turn'}.
          </>
        ) : (
          'No dance yet this turn. You can perform one, before or after your action.'
        )}
      </p>
      {previous && (
        <p className="fu-note">
          Last turn: {previous}. A different dance costs {DANCE_MP_AFTER_OTHER} MP; {previous} again costs {DANCE_MP}{' '}
          MP.
        </p>
      )}
      {sl.followMyLead > 0 && (
        <label className="dances-section-share">
          <input type="checkbox" checked={shared} onChange={(event) => onShare(event.target.checked)} />
          Share the next dance with an ally (Follow My Lead, +{FOLLOW_MY_LEAD_MP} MP for dances lasting until your next
          turn)
        </label>
      )}
      {current && bonuses.length > 0 && (
        <ul className="dances-section-bonuses">
          {bonuses.map((bonus) => (
            <li key={bonus}>{bonus}</li>
          ))}
        </ul>
      )}
      <p className="fu-note">
        MP {character.mp.current ?? derived.maxMp} of {derived.maxMp}. End your turn in the bar at the bottom: this
        turn&apos;s dance then becomes last turn&apos;s.
      </p>
    </Panel>
  );
}
