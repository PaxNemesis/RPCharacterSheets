import type { ReactNode } from 'react';
import { Panel } from '@/components/Panel';
import { useSheet } from '@/components/SheetProvider';
import { HUNTER_MP, UNERRING_FOCUS_MP } from '../../../constants/hunter';
import type { FuCharacter, FuDerived, FuEffect } from '../../../types';
import { hunterSkills } from '../../../utils/hunter';

type HunterSkillsPanelProps = {
  character: FuCharacter;
  derived: FuDerived;
};

type Row = { name: string; text: string; actions: ReactNode };

/** The numbers for Lock-On, Track, Vital Strike and Wild Reflexes, with buttons to use them (LF pp. 89, 93). */
export function HunterSkillsPanel({ character, derived }: HunterSkillsPanelProps) {
  const { set } = useSheet();
  const sl = hunterSkills(character);
  // A blank current MP counts as full.
  const mp = character.mp.current ?? derived.maxMp;
  const dex = derived.current('dex');

  // Spends the MP, and adds what the Skill leaves running to the conflict drawer's effects.
  const use = (cost: number, effect?: FuEffect) => {
    if (cost > 0) set('mp.current', mp - cost);
    if (effect) set('effects', [...character.effects, effect]);
  };
  const button = (label: string, cost: number, effect?: FuEffect) => (
    <button
      key={label}
      type="button"
      onClick={() => use(cost, effect)}
      disabled={mp < cost}
      title={mp < cost ? `Needs ${cost} MP` : effect ? 'Adds it to the effects in the conflict drawer' : undefined}
    >
      {label}
      {cost > 0 && ` (−${cost} MP)`}
    </button>
  );
  const lockOn = (bonus: number): FuEffect => ({
    name: 'Lock-On',
    lasts: 'nextTurn',
    notes: `+${bonus} to allies' Checks against the target; weak if all succeed`,
  });
  const defense = sl.wildReflexes + (sl.predatorsReflexes ? 1 : 0);

  const rows: (Row | false)[] = [
    sl.lockOn > 0 && {
      name: 'Lock-On',
      text: `Allies get +2${sl.unerringFocus ? ` (+4 for ${UNERRING_FOCUS_MP} MP)` : ''} to Checks against the target during the next turn; it suffers weak if every one succeeds.`,
      actions: [
        button('Lock on', HUNTER_MP, lockOn(2)),
        sl.unerringFocus && button('Lock on, focused', UNERRING_FOCUS_MP, lockOn(4)),
      ],
    },
    sl.track > 0 && {
      name: 'Track',
      text: `+${sl.track + (sl.relentlessPursuit ? 2 : 0)} to the Opposed Check. In the conflict, your first Accuracy Check against the prey gets +${sl.track} and HR + 15 extra damage.`,
      actions: button('Track', HUNTER_MP, { name: 'Tracking', lasts: 'removed', notes: 'Your prey' }),
    },
    sl.vitalStrike > 0 && {
      name: 'Vital Strike',
      text: sl.fatalPrecision
        ? `After a hit: +${dex + 5} damage and weak; +10 more, and shaken, if the target is or goes into Crisis.`
        : `After a hit: +${dex} damage, and +5 more if the target is or goes into Crisis.`,
      actions: button('Vital Strike', HUNTER_MP),
    },
    sl.wildReflexes > 0 && {
      name: 'Wild Reflexes',
      text: `Guard without covering anyone: +${defense} Defense until your next turn, and a free attack on each enemy that misses you (${sl.predatorsReflexes ? 'with your HR' : 'HR 0 for damage'}).`,
      actions: button('Guard', 0, { name: 'Wild Reflexes', lasts: 'nextTurn', notes: `+${defense} Defense` }),
    },
  ];
  const shown = rows.filter((row): row is Row => Boolean(row));

  if (shown.length === 0) return null;
  return (
    <Panel title="Hunter Skills">
      <dl className="hunter-section-skills">
        {shown.map((row) => (
          <div key={row.name}>
            <dt>{row.name}</dt>
            <dd>{row.text}</dd>
            <dd className="hunter-section-buttons">{row.actions}</dd>
          </div>
        ))}
      </dl>
      <p className="fu-note">
        MP {mp} of {derived.maxMp}. Skills: LF p. 89; Heroic Skills: LF pp. 92–93.
      </p>
    </Panel>
  );
}
