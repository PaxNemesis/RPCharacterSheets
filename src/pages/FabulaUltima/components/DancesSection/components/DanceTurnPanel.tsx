import { Panel } from '@/components/Panel';
import { useSheet } from '@/components/SheetProvider';
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
  const { set } = useSheet();
  const { current, previous } = character.dancer;
  const sl = dancerSkills(character);
  const lasting = findDance(current)?.duration === 'turn';

  const nextTurn = () => {
    set('dancer.previous', current);
    set('dancer.current', '');
  };
  const endConflict = () => {
    set('dancer.previous', '');
    set('dancer.current', '');
  };
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
    <Panel
      title="This turn"
      actions={
        <>
          <button type="button" onClick={nextTurn} title="Your dance from this turn becomes last turn's">
            Next turn
          </button>
          <button type="button" onClick={endConflict}>
            End conflict
          </button>
        </>
      }
    >
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
        MP {character.mp.current ?? derived.maxMp} of {derived.maxMp}
      </p>
    </Panel>
  );
}
