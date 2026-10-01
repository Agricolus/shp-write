import { describe, it, expect } from 'vitest';
import { zip } from '../src/zip';

describe('zip', () => {
  it('builds a zip from a FeatureCollection', async () => {
    const buf = await zip({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [0, 0] },
          properties: { name: 'Foo' },
        },
      ],
    });
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect((buf as Buffer).length).toBeGreaterThan(0);
  });
});
