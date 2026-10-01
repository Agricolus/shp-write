import { describe, it, expect } from 'vitest';
import { structure } from '../src/dbf';

function fieldType(view: DataView, i: number): string {
  return String.fromCharCode(view.getInt8(32 + i * 32 + 11));
}

describe('dbf structure', () => {
  it('builds a DBF structure from rows', () => {
    const view = structure([{ foo: 'bar', count: 10 }]);
    expect(view).toBeInstanceOf(DataView);
    expect(view.byteLength).toBeGreaterThan(0);
    expect(view.getUint8(0)).toBe(0x03); // dBase III version
    expect(view.getUint32(4, true)).toBe(1); // one record
  });

  it('infers numeric and string field types', () => {
    const view = structure([{ name: 'Foo', count: 3, ok: true }]);
    expect(fieldType(view, 0)).toBe('C'); // string
    expect(fieldType(view, 1)).toBe('N'); // number
    expect(fieldType(view, 2)).toBe('L'); // boolean
  });

  it('supports multiple records', () => {
    const view = structure([{ a: 1 }, { a: 2 }]);
    expect(view.getUint32(4, true)).toBe(2);
  });
});
