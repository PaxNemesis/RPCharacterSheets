import { hex, rgb } from '../pdfColor';
import { ASPECTS, STAT_LABELS } from '../../../constants/stats';
import type { IkCharacter, IkDerived } from '../../../types';
import type { SheetWriter } from '../sheetWriter';
import { writeFormula } from './formula';

/**
 * The stats by aspect, each with its maximum, and willpower. Maximums worked out from the race, and
 * willpower, are named `calculated.…`: the sheet works them out again.
 */
export function writeStats(w: SheetWriter, character: IkCharacter, derived: IkDerived) {
  const raceMax = character.settings.raceRules;
  w.section('Stats', 60);
  for (const aspect of ASPECTS) {
    w.block(50, (x, top, width) => {
      w.canvas.drawRectangle({ x, y: top - 46, width: 3, height: 44, color: rgb(hex(aspect.color)) });
      w.label(aspect.label, x + 8, top, 6.5);
      const cell = (width - 8) / 3;
      [aspect.primary, ...aspect.secondary].forEach((key, index) => {
        const left = x + 8 + index * cell;
        const valueWidth = cell * 0.58;
        w.label(STAT_LABELS[key], left, top - 10);
        w.field(`stats.${key}.value`, character.stats[key]?.value, {
          x: left,
          top: top - 17,
          width: valueWidth,
          height: 26,
          size: 14,
          bold: true,
          center: true,
        });
        w.label('Max', left + valueWidth + 4, top - 17, 5);
        const max = raceMax
          ? { name: `calculated.max.${key}`, value: derived.statMax(key) }
          : { name: `stats.${key}.max`, value: character.stats[key]?.max };
        w.field(max.name, max.value, {
          x: left + valueWidth + 4,
          top: top - 23,
          width: cell * 0.3,
          height: 14,
          size: 8,
          center: true,
        });
      });
    });
  }
  writeFormula(
    w,
    'Willpower',
    [
      { label: 'PHY', name: 'calculated.parts.willpower.phy', value: derived.stat('phy') },
      { label: 'INT', name: 'calculated.parts.willpower.int', value: derived.stat('int') },
      { label: 'Other', name: 'modifiers.willpower', value: character.modifiers.willpower },
    ],
    { label: 'Total', name: 'calculated.willpower', value: derived.willpower },
  );
  w.end();
}
