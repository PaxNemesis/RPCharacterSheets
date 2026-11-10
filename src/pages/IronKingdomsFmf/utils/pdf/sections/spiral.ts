import { ASPECTS } from '../../../constants/stats';
import type { IkCharacter, IkDerived } from '../../../types';
import { branchLayout, SHEET_SLOTS, SPIRAL_SIZE } from '../../spiralLayout';
import { hex, rgb } from '../pdfColor';
import { INK, WHITE } from '../sheetLayout';
import type { SheetWriter } from '../sheetWriter';

/**
 * The life spiral, laid out as on the web sheet: a round checkbox per vitality point, ticked for
 * damage taken, and unused circles blacked out (p. 215).
 */
export function writeSpiral(w: SheetWriter, character: IkCharacter, derived: IkDerived) {
  w.section('Damage capacity', 200);
  w.note(`Vitality ${derived.vitality}. Fill a circle per damage point, from the branch's badge inwards.`);
  const { width } = w.inner;
  const size = Math.min(width, 210);
  w.block(size + 6, (left, top) => {
    const scale = size / SPIRAL_SIZE;
    const x0 = left + (width - size) / 2;
    const at = (point: { x: number; y: number }) => ({ x: x0 + point.x * scale, y: top - point.y * scale });
    w.canvas.drawCircle({
      ...at({ x: SPIRAL_SIZE / 2, y: SPIRAL_SIZE / 2 }),
      size: size / 2,
      color: rgb([0.9, 0.86, 0.78]),
    });

    SHEET_SLOTS.forEach((slots, branch) => {
      const aspect = ASPECTS[Math.floor(branch / 2)];
      const color = rgb(hex(aspect.color));
      const points = derived.branchSizes[branch] ?? 0;
      const marked = Math.min(character.damage.marked[branch] ?? 0, points);
      const { badge, circles } = branchLayout(Math.floor(branch / 2), branch % 2 === 1, Math.max(slots, points));
      [badge, ...circles].slice(1).forEach((circle, index) => {
        const from = at([badge, ...circles][index]);
        w.canvas.drawLine({ start: from, end: at(circle), thickness: 1.2, color });
      });
      circles.forEach((circle, index) => {
        const { x, y } = at(circle);
        const r = circle.r * scale;
        if (index < points)
          w.checkbox(`damage.marked.${branch}.${index + 1}`, x - r, y - r, 2 * r, index < marked, color);
        else w.canvas.drawCircle({ x, y, size: r, color: INK });
      });
      const centre = at(badge);
      w.canvas.drawCircle({ ...centre, size: badge.r * scale, color, borderColor: WHITE, borderWidth: 1 });
      w.text(String(branch + 1), centre.x - 2.6, centre.y - 3.2, 9, true, WHITE);
    });
  });
  w.note('1–2 Physique · 3–4 Agility · 5–6 Intellect. Blacked-out circles are unused.');
  w.end();
}
