import { describe, it, expect } from 'vitest';
import { write } from '../src/write';
import type { DBFRow, GeometryType, ShpWriteResult } from '../src/types';

function writeAsync(
  rows: DBFRow[],
  type: GeometryType,
  geometries: any[]
): Promise<ShpWriteResult> {
  return new Promise((resolve, reject) => {
    write(rows, type, geometries, (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
}

describe('write', () => {
  it('writes point geometries', async () => {
    const files = await writeAsync([{ foo: 'bar' }], 'POINT', [[0, 0]]);
    expect(files.shp.getInt32(0)).toBe(9994);
    expect(files.shp.byteLength).toBeGreaterThan(100);
    expect(files.shx.byteLength).toBeGreaterThan(100);
    expect(files.dbf.byteLength).toBeGreaterThan(0);
    expect(typeof files.prj).toBe('string');
  });

  it('writes polygon geometries', async () => {
    const files = await writeAsync(
      [{ id: 0 }],
      'POLYGON',
      [[[[0, 0], [10, 0], [10, 10], [0, 0]]]]
    );
    expect(files.shp.getInt32(0)).toBe(9994);
    expect(files.shp.byteLength).toBeGreaterThan(100);
  });
});
