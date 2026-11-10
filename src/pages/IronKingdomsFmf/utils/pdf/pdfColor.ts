import { rgb as pdfRgb } from 'pdf-lib';

/** "#2f5e8c" as red, green and blue from 0 to 1. */
export const hex = (color: string): [number, number, number] => {
  const value = Number.parseInt(color.replace('#', ''), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
};

/** pdf-lib's colour from red, green and blue from 0 to 1. */
export const rgb = ([r, g, b]: [number, number, number]) => pdfRgb(r, g, b);
