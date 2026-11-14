import { useState } from 'react';
import type { OpenCharacter, SheetSystem } from '../CharacterWorkspace.types';
import { downloadCharacterPdf } from '../utils/characterFile';

/** Downloads the character as a PDF, tracking whether one is being made and whether the last one failed. */
export function usePdfExport<T>(system: SheetSystem<T>, character: OpenCharacter<T>) {
  const [exporting, setExporting] = useState(false);
  const [exportFailed, setExportFailed] = useState(false);

  const exportPdf = async () => {
    setExporting(true);
    try {
      await downloadCharacterPdf(system, character);
      setExportFailed(false);
    } catch {
      setExportFailed(true);
    } finally {
      setExporting(false);
    }
  };

  return { exportPdf, exporting, exportFailed };
}
