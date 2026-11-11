import { useState } from 'react';
import { useSheet } from '@/components/SheetProvider';
import { bookRef } from '../../constants/books';
import { TRAP_SIZES, TRAPS, type TrapSize } from '../../constants/hunter';
import { useFuCharacter } from '../../hooks/useFuCharacter';
import { hunterSkills, trapIp, trapLimit } from '../../utils/hunter';
import { LearnedList } from '../LearnedList';
import { HunterSkillsPanel, TrapSizePicker } from './components';
import './HunterSection.styles.css';

/** The Hunter's Skills, and the traps they learn and set at the start of a conflict (LF pp. 87–93). */
export function HunterSection() {
  const { character, derived } = useFuCharacter();
  const { set } = useSheet();
  const [size, setSize] = useState<TrapSize>('Minor');
  const { traps, trapSet } = character.hunter;
  const { conflict } = character;
  const sl = hunterSkills(character);
  const mpCost = TRAP_SIZES.find((entry) => entry.name === size)?.mp ?? 0;
  // A blank current value counts as full.
  const mp = character.mp.current ?? derived.maxMp;
  const ip = character.ip.current ?? derived.maxIp;
  // Before your first turn of a conflict, or before the conflict as an ambush.
  const blocked = trapSet
    ? 'Only one trap per conflict'
    : conflict.active && (conflict.acting || conflict.turn > 0)
      ? 'Traps are set at the start of a conflict, before your first turn.'
      : undefined;

  // Two traps of each Skill Level up to your Set Trap SL; learned ones stay listed if the SL drops.
  const learnedAt = (level: number) => TRAPS.filter((trap) => trap.sl === level && traps.includes(trap.name)).length;
  const entries = TRAPS.filter(
    (trap) => traps.includes(trap.name) || (trap.sl <= sl.setTrap && learnedAt(trap.sl) < 2),
  ).map((trap) => ({
    name: trap.name,
    ref: bookRef('low', trap.page),
    detail: `SL ${trap.sl} · ${trapIp(trap.sl, sl.masterTrapper)} IP · ${trap.effect}`,
  }));

  const setTrap = (name: string, cost: number) => {
    set('ip.current', ip - cost);
    set('mp.current', mp - mpCost);
    set('hunter.trapSet', name);
  };

  return (
    <div className="fu-section hunter-section-container">
      <HunterSkillsPanel character={character} derived={derived} />
      <LearnedList
        title="Traps"
        noun="trap"
        entries={entries}
        path="hunter.traps"
        notesPath="hunter.notes"
        limit={trapLimit(character)}
        limitNote="two traps of each Skill Level, up to your Set Trap SL (LF p. 89)."
        highlight={trapSet}
        renderActions={(name) => {
          const trap = TRAPS.find((entry) => entry.name === name);
          if (!trap) return null;
          const cost = trapIp(trap.sl, sl.masterTrapper);
          const short = ip < cost ? `Needs ${cost} IP` : mp < mpCost ? `Needs ${mpCost} MP` : undefined;
          return (
            <button
              type="button"
              onClick={() => setTrap(name, cost)}
              disabled={Boolean(blocked ?? short) || trap.sl > sl.setTrap}
              title={blocked ?? short}
            >
              Set {size.toLowerCase()} (−{cost} IP, −{mpCost} MP)
            </button>
          );
        }}
      >
        {sl.setTrap > 0 && traps.length > 0 && (
          <TrapSizePicker size={size} onSize={setSize} trapSet={trapSet} blocked={blocked} />
        )}
      </LearnedList>
    </div>
  );
}
