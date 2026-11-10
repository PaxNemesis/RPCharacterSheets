import { Field } from '@/components/Field';
import { Panel } from '@/components/Panel';
import { useSheet } from '@/components/SheetProvider';
import { TextField } from '@/components/TextField';
import { CORTEXES, findCortex } from '../../../constants/cortexes';
import type { IkSteamjack } from '../../../types';

type JackCortexPanelProps = {
  jack: IkSteamjack;
};

const signed = (value: number) => (value > 0 ? `+${value}` : String(value));

/** The cortex grade, which sets INT, PER and the MAT/RAT bonus (pp. 303–305), and its imprint and notes. */
export function JackCortexPanel({ jack }: JackCortexPanelProps) {
  const { set } = useSheet();
  const cortex = findCortex(jack.cortex.grade);

  // INT and PER come from the cortex, so choosing one sets them too.
  const choose = (grade: string) => {
    set('cortex.grade', grade);
    const chosen = findCortex(grade);
    if (chosen) {
      set('stats.int', chosen.int);
      set('stats.per', chosen.per);
    }
  };

  return (
    <Panel title="Cortex">
      <Field label="Grade">
        {(id) => (
          <select id={id} value={cortex?.grade ?? ''} onChange={(event) => choose(event.target.value)}>
            <option value="">Choose…</option>
            {CORTEXES.map((option) => (
              <option key={option.grade} value={option.grade}>
                {option.label} (INT {option.int}, PER {option.per}, {signed(option.attackBonus)} MAT/RAT)
              </option>
            ))}
          </select>
        )}
      </Field>
      <TextField path="cortex.imprint" label="Imprint" />
      <TextField path="cortex.fightingBonus" label="Fighting bonus" />
      <TextField path="cortex.language" label="Language" />
      <TextField path="cortex.notes" label="Notes" rows={3} />
    </Panel>
  );
}
