import type { IkCharacter } from '../../../types';
import type { SheetWriter } from '../sheetWriter';

/** Notes, injuries, languages and beliefs. */
export function writeNotes(w: SheetWriter, { notes, damage }: IkCharacter) {
  w.section('Permanent injuries', 40);
  w.fields([{ label: 'Injuries', name: 'notes.injuries', value: notes.injuries, lines: 3 }]);
  w.fields([{ label: 'Damage & condition notes', name: 'damage.notes', value: damage.notes, lines: 3 }]);
  w.end();
  w.section('Languages & beliefs', 60);
  w.fields([{ label: 'Spoken languages', name: 'notes.languages', value: notes.languages, lines: 3 }]);
  w.fields([{ label: 'Religious beliefs', name: 'notes.religion', value: notes.religion, lines: 3 }]);
  w.end();
  w.section('Notes', 120);
  w.fields([{ label: 'Notes & background', name: 'notes.general', value: notes.general, lines: 16 }]);
  w.end();
}
