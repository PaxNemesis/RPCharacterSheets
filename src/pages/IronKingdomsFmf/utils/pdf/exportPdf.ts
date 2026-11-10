import type { IkCharacter } from '../../types';
import { calculate } from '../calculate';
import { writeIdentity } from './sections/identity';
import { writeEntries, writeGear, writeSkills, writeSpells } from './sections/lists';
import { writeNotes } from './sections/notes';
import { writeCombat } from './sections/combat';
import { writeSpiral } from './sections/spiral';
import { writeStats } from './sections/stats';
import { writeWeapons } from './sections/weapons';
import { SheetWriter } from './sheetWriter';

const GAME = 'Iron Kingdoms: Full Metal Fantasy';

/**
 * The character as a fillable PDF. Every field can be edited; worked-out values (DEF, RAT, P+S and so
 * on) are filled in as they are at export and named `calculated.…`. Other fields are named after the
 * data they hold, such as `stats.phy.value`, so an edited PDF can be read back in.
 */
export async function exportPdf(character: IkCharacter): Promise<Uint8Array> {
  const derived = calculate(character);
  // Drawn text can't be edited, so the band and footers name the game, not the character.
  const w = await SheetWriter.create();
  const name = character.identity.name.trim() || 'Unnamed character';
  w.doc.setTitle(`${name} – Iron Kingdoms character`);
  w.doc.setCreator('RPCharacterSheets');

  // Page one: who they are and their stats; combat and damage, which are always the same size; then
  // weapons and skills, whose lists can run on into page two.
  writeIdentity(w, character, await w.embedImage(character.portrait));
  writeStats(w, character, derived);
  w.nextColumn();
  writeCombat(w, character, derived);
  writeSpiral(w, character, derived);
  w.nextColumn();
  writeWeapons(w, character, derived);
  writeSkills(w, character, derived);
  w.nextColumn();
  // Then everything else, flowing over as many columns and pages as it needs.
  writeEntries(w, 'Abilities', 'abilities', character.abilities);
  writeEntries(w, 'Archetype benefits', 'archetypeBenefits', character.archetypeBenefits);
  writeEntries(w, 'Connections', 'connections', character.connections);
  writeGear(w, character);
  if (character.settings.magic) writeSpells(w, character);
  writeNotes(w, character);
  return w.save(GAME, `Character sheet · exported ${new Date().toLocaleDateString()}`);
}
