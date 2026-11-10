import { PDFDict, PDFDocument, PDFName, PDFStream } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { exportPdf } from '../utils/pdf/exportPdf';
import { character, statsWith } from './character';

const sheet = character({
  identity: { name: 'Dagny', race: 'Dwarf', height: '4′6″' },
  stats: statsWith({ phy: 6, spd: 4, str: 5, agl: 3, prw: 4, poi: 3, int: 3, per: 3 }),
  meleeWeapons: [{ name: 'Axe', skill: 2, attackMod: 0, pow: 3, notes: '' }],
  damage: { marked: [2, 0, 0, 0, 0, 0], notes: '' },
  notes: { general: 'Line one\nLine two', injuries: '', languages: '', religion: '' },
});

// A 2×2 grey JPEG, as a portrait.
const JPEG =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wgARCAACAAIDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAAT/P/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABBQJ//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPwF//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAGPwJ//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPyF//9oADAMBAAIAAwAAABAf/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPxB//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPxB//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxB//9k=';

/** Whether the first page draws an image (an XObject of subtype Image). */
const hasImage = async (data: typeof sheet) => {
  const doc = await PDFDocument.load(await exportPdf(data));
  const objects = doc.getPage(0).node.Resources()?.lookup(PDFName.of('XObject'), PDFDict);
  return (objects?.values() ?? []).some(
    (ref) => doc.context.lookup(ref, PDFStream).dict.get(PDFName.of('Subtype')) === PDFName.of('Image'),
  );
};

const load = async (data = sheet) => (await PDFDocument.load(await exportPdf(data))).getForm();
const text = (form: Awaited<ReturnType<typeof load>>, name: string) => form.getTextField(name).getText() ?? '';

describe('exportPdf', () => {
  it('fills in fields named after the data they hold', async () => {
    const form = await load();
    expect(text(form, 'identity.name')).toBe('Dagny');
    expect(text(form, 'stats.phy.value')).toBe('6');
    expect(text(form, 'meleeWeapons.0.name')).toBe('Axe');
    expect(text(form, 'notes.general')).toBe('Line one\nLine two');
  });

  it('writes in worked-out values under calculated names, as editable fields', async () => {
    const form = await load();
    // MAT = PRW 4 + skill 2; P+S = POW 3 + STR 5.
    expect(text(form, 'calculated.meleeWeapons.0.mat')).toBe('6');
    expect(text(form, 'calculated.meleeWeapons.0.ps')).toBe('8');
    expect(form.getTextField('calculated.defense').isReadOnly()).toBe(false);
  });

  it('ticks a box per damage point, and leaves spare rows to write in more', async () => {
    const form = await load();
    expect(form.getCheckBox('damage.marked.0.1').isChecked()).toBe(true);
    expect(form.getCheckBox('damage.marked.0.2').isChecked()).toBe(true);
    expect(form.getCheckBox('damage.marked.0.3').isChecked()).toBe(false);
    expect(text(form, 'meleeWeapons.1.name')).toBe('');
  });

  it('replaces characters the PDF font can’t show, and leaves out spells without magic', async () => {
    expect(text(await load(), 'identity.height')).toBe(`4'6"`);
    const withoutMagic = await load({ ...sheet, settings: { ...sheet.settings, magic: false } });
    expect(withoutMagic.getFields().some((field) => field.getName().startsWith('spells'))).toBe(false);
  });

  it('shows the portrait, and leaves out one that isn’t a picture it can read', async () => {
    expect(await hasImage({ ...sheet, portrait: JPEG })).toBe(true);
    expect(await hasImage(sheet)).toBe(false);
    expect(await hasImage({ ...sheet, portrait: 'data:image/jpeg;base64,AAAA' })).toBe(false);
    expect(await hasImage({ ...sheet, portrait: 'https://example.com/me.jpg' })).toBe(false);
  });
});
