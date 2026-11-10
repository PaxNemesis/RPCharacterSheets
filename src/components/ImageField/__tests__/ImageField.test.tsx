import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SheetProvider } from '@/components/SheetProvider';
import { ImageField } from '../ImageField';

// A 1×1 transparent PNG.
const PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const field = (image: string) =>
  render(
    <SheetProvider data={{ image }} onChange={() => {}}>
      <ImageField path="image" label="Steamjack image" placeholder={<span>Silhouette</span>} />
    </SheetProvider>,
  );

describe('ImageField', () => {
  it('shows the placeholder and hint while there is no image', () => {
    field('');
    expect(screen.getByText('Silhouette')).toBeInTheDocument();
    expect(screen.getByText('Click or drop an image here')).toBeInTheDocument();
  });

  it('shows the image instead once there is one', () => {
    field(PNG);
    expect(screen.getByRole('img', { name: 'Steamjack image' })).toBeInTheDocument();
    expect(screen.queryByText('Silhouette')).not.toBeInTheDocument();
  });
});
