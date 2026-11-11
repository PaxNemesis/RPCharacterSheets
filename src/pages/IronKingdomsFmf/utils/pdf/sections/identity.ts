import type { PDFImage } from 'pdf-lib';
import type { IkCharacter } from '../../../types';
import { FIELD, GAP, LABEL, RULE, roundedRect } from '../sheetLayout';
import type { SheetWriter } from '../sheetWriter';

/** With a portrait, the first rows leave this much of the panel for it on the right. */
const BESIDE = 0.64;
const ROWS_BESIDE = 4;

/**
 * Name, player, race and careers, then the rest of the identity, in rows that fit a column. A portrait
 * goes on the right of the first rows, like the official sheet's.
 */
export function writeIdentity(w: SheetWriter, { identity, settings }: IkCharacter, portrait?: PDFImage) {
  const careers = settings.careerRules
    ? { name: 'identity.careerList', value: identity.careerList.filter((career) => career.trim()).join(', ') }
    : { name: 'identity.careers', value: identity.careers };
  w.section('Character', ROWS_BESIDE * (LABEL + FIELD + GAP));
  const share = portrait ? BESIDE : 1;
  if (portrait) {
    w.block(0, (x, top, width) => {
      const left = x + width * BESIDE + GAP;
      const height = ROWS_BESIDE * (LABEL + FIELD + GAP) - GAP;
      w.label('Portrait', left, top);
      w.drawImage(portrait, left + 2, top - LABEL - 2, x + width - left - 4, height - LABEL - 4);
      w.canvas.drawSvgPath(roundedRect(x + width - left, height - LABEL, 4), {
        x: left,
        y: top - LABEL,
        borderColor: RULE,
        borderWidth: 0.5,
      });
    });
  }
  w.fields(
    [
      { label: 'Character name', name: 'identity.name', value: identity.name, weight: 2 },
      { label: 'Player', name: 'identity.player', value: identity.player },
    ],
    share,
  );
  w.fields(
    [
      { label: 'Race', name: 'identity.race', value: identity.race },
      { label: 'Archetype', name: 'identity.archetype', value: identity.archetype },
    ],
    share,
  );
  w.fields(
    [
      { label: 'Careers', ...careers, weight: 3 },
      { label: 'Level', name: 'identity.level', value: identity.level },
    ],
    share,
  );
  w.fields(
    [
      { label: 'XP', name: 'identity.xp', value: identity.xp },
      { label: 'Sex', name: 'identity.sex', value: identity.sex },
      { label: 'Faith', name: 'identity.faith', value: identity.faith, weight: 2 },
    ],
    share,
  );
  w.fields([
    { label: 'Height', name: 'identity.height', value: identity.height },
    { label: 'Weight', name: 'identity.weight', value: identity.weight },
    { label: 'Age', name: 'identity.age', value: identity.age },
    { label: 'Eyes & hair', name: 'identity.eyesHair', value: identity.eyesHair, weight: 1.5 },
  ]);
  w.fields([
    { label: 'Adventuring company', name: 'identity.company', value: identity.company },
    { label: 'Defining characteristics', name: 'identity.defining', value: identity.defining, weight: 2 },
  ]);
  w.end();
}
