import { describe, expect, it } from 'vitest';
import { isImageData } from '../utils/isImageData';

describe('isImageData', () => {
  it('accepts raster images stored in the file', () => {
    expect(isImageData('data:image/jpeg;base64,/9j/4AAQSkZJRg==')).toBe(true);
    expect(isImageData('data:image/png;base64,iVBORw0KGgo=')).toBe(true);
  });

  it('rejects links, SVG and anything that is not an image', () => {
    expect(isImageData('https://example.com/pixel.png')).toBe(false);
    expect(isImageData('data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=')).toBe(false);
    expect(isImageData('data:text/html;base64,PHNjcmlwdD4=')).toBe(false);
    expect(isImageData('data:image/png;base64,abc" onerror="alert(1)')).toBe(false);
    expect(isImageData(42)).toBe(false);
  });
});
