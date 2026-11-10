import { Panel } from '@/components/Panel';
import type { FuCharacter } from '../../../types';
import { symbolistSkills } from '../../../utils/symbolist';

type SymbolSkillsPanelProps = {
  character: FuCharacter;
};

/** The numbers for the Skills that use symbols, from their Skill Levels (HF p. 147). */
export function SymbolSkillsPanel({ character }: SymbolSkillsPanelProps) {
  const sl = symbolistSkills(character);
  const rows = [
    sl.magicSymbols > 0 && [
      'Magic Symbols',
      `A bearer can cast one of your spells of up to ${sl.magicSymbols * 10} MP in total, destroying the symbol.`,
    ],
    sl.personalTouch > 0 && [
      'Personal Touch',
      `+${sl.personalTouch} damage, or HP and MP recovery, for a bearer you can see.`,
    ],
    sl.symbolicConnection > 0 && [
      'Symbolic Connection',
      'You know the direction of every bearer within 2 travel days.',
    ],
  ].filter((row): row is [string, string] => Boolean(row));

  if (rows.length === 0) return null;
  return (
    <Panel title="Symbol Skills">
      <dl className="symbols-section-skills">
        {rows.map(([name, text]) => (
          <div key={name}>
            <dt>{name}</dt>
            <dd>{text}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
