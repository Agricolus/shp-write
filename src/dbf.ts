import type { DBFField, DBFRow } from './types';

/**
 * DBF (dBase III) writer, vendored from the `dbf` package
 * (BSD-2-Clause, copyright Mapbox). Writes the full file structure into a
 * `DataView`.
 */

const fieldSize: Record<string, number> = {
  C: 254, // string
  L: 1, // boolean
  D: 8, // date
  N: 18, // number
  M: 18,
  F: 18, // number, float
  B: 8,
};

const types: Record<string, string> = {
  string: 'C',
  number: 'N',
  boolean: 'L',
  // type to use if all values of a field are null
  null: 'C',
};

function inherit(a: Record<string, unknown>, b: Record<string, unknown>): Record<string, unknown> {
  for (const i in b) {
    const isDef = typeof b[i] !== 'undefined' && b[i] !== null;
    if (typeof a[i] === 'undefined' || isDef) {
      a[i] = b[i];
    }
  }
  return a;
}

function obj(_: Record<string, unknown>): DBFField[] {
  const fields: Record<string, string> = {};
  const o: DBFField[] = [];
  for (const p in _) fields[p] = _[p] === null ? 'null' : typeof _[p];
  for (const n in fields) {
    const t = types[fields[n]];
    if (t) {
      o.push({ name: n, type: t, size: fieldSize[t] });
    }
  }
  return o;
}

function multi(features: DBFRow[]): DBFField[] {
  const fields: Record<string, unknown> = {};
  features.forEach((f) => inherit(fields, f));
  return obj(fields);
}

function bytesPer(fields: DBFField[]): number {
  // deleted flag
  return fields.reduce((memo, f) => memo + f.size, 1);
}

function lpad(str: string, len: number, char: string): string {
  while (str.length < len) str = char + str;
  return str;
}

function rpad(str: string, len: number, char: string): string {
  while (str.length < len) str = str + char;
  return str;
}

function writeField(view: DataView, fieldLength: number, str: string, offset: number): number {
  for (let i = 0; i < fieldLength; i++) {
    view.setUint8(offset, str.charCodeAt(i));
    offset++;
  }
  return offset;
}

/** Build a full DBF file structure from an array of row objects. */
export function structure(data: DBFRow[], meta?: DBFField[]): DataView {
  const field_meta = meta || multi(data);
  const fieldDescLength = 32 * field_meta.length + 1;
  const bytesPerRecord = bytesPer(field_meta);
  const buffer = new ArrayBuffer(fieldDescLength + 32 + bytesPerRecord * data.length + 1);
  const now = new Date();
  const view = new DataView(buffer);

  // version number - dBase III
  view.setUint8(0, 0x03);
  // date of last update
  view.setUint8(1, now.getFullYear() - 1900);
  view.setUint8(2, now.getMonth());
  view.setUint8(3, now.getDate());
  // number of records
  view.setUint32(4, data.length, true);

  // length of header
  const headerLength = fieldDescLength + 32;
  view.setUint16(8, headerLength, true);
  // length of each record
  view.setUint16(10, bytesPerRecord, true);

  // terminator
  view.setInt8(32 + fieldDescLength - 1, 0x0d);

  field_meta.forEach((f, i) => {
    // field name
    f.name
      .split('')
      .slice(0, 8)
      .forEach((c, x) => {
        view.setInt8(32 + i * 32 + x, c.charCodeAt(0));
      });
    // field type
    view.setInt8(32 + i * 32 + 11, f.type.charCodeAt(0));
    // field length
    view.setInt8(32 + i * 32 + 16, f.size);
    if (f.type === 'N') view.setInt8(32 + i * 32 + 17, 3);
  });

  let offset = fieldDescLength + 32;
  data.forEach((row) => {
    // delete flag: this is not deleted
    view.setUint8(offset, 32);
    offset++;
    field_meta.forEach((f) => {
      let val: unknown = row[f.name];
      if (val === null || typeof val === 'undefined') val = '';

      switch (f.type) {
        // boolean
        case 'L':
          view.setUint8(offset, val ? 84 : 70);
          offset++;
          break;

        // date
        case 'D':
          offset = writeField(view, 8, lpad(String(val), 8, ' '), offset);
          break;

        // number
        case 'N':
          offset = writeField(view, f.size, lpad(String(val), f.size, ' ').slice(0, 18), offset);
          break;

        // string
        case 'C':
          offset = writeField(view, f.size, rpad(String(val), f.size, ' '), offset);
          break;

        default:
          throw new Error('Unknown field type');
      }
    });
  });

  // EOF flag
  view.setUint8(offset, 0x1a);

  return view;
}
