import { geometries as GEOMETRIES } from './geometries';
import { structure as dbfStructure } from './dbf';
import prj from './prj';
import * as pointWriter from './points';
import * as polyWriter from './poly';
import type {
  DBFRow,
  Extent,
  GeometryType,
  GeometryWriter,
  ShpWriteResult,
  WriteCallback,
} from './types';

const writers: { [key: number]: GeometryWriter } = {
  1: pointWriter,
  5: polyWriter,
  3: polyWriter,
};

// Low-level writing interface
export function write(
  rows: DBFRow[],
  geometry_type: GeometryType,
  geometries: any[],
  callback: WriteCallback
): void {
  const TYPE = GEOMETRIES[geometry_type];
  const writer = writers[TYPE];
  if (!writer) {
    throw new Error(`Unsupported geometry type: ${geometry_type}`);
  }

  const parts = writer.parts(geometries, TYPE);
  const shpLength = 100 + (parts - geometries.length) * 4 + writer.shpLength(geometries);
  const shxLength = 100 + writer.shxLength(geometries);
  const shpBuffer = new ArrayBuffer(shpLength);
  const shpView = new DataView(shpBuffer);
  const shxBuffer = new ArrayBuffer(shxLength);
  const shxView = new DataView(shxBuffer);
  const extent = writer.extent(geometries);

  writeHeader(shpView, TYPE);
  writeHeader(shxView, TYPE);
  writeExtent(extent, shpView);
  writeExtent(extent, shxView);

  writer.write(geometries, extent, new DataView(shpBuffer, 100), new DataView(shxBuffer, 100), TYPE);

  shpView.setInt32(24, shpLength / 2);
  shxView.setInt32(24, 50 + geometries.length * 4);

  const dbfBuf = dbfStructure(rows);

  callback(null, {
    shp: shpView,
    shx: shxView,
    dbf: dbfBuf,
    prj: prj,
  });
}

function writeHeader(view: DataView, TYPE: number): void {
  view.setInt32(0, 9994);
  view.setInt32(28, 1000, true);
  view.setInt32(32, TYPE, true);
}

function writeExtent(extent: Extent, view: DataView): void {
  view.setFloat64(36, extent.xmin, true);
  view.setFloat64(44, extent.ymin, true);
  view.setFloat64(52, extent.xmax, true);
  view.setFloat64(60, extent.ymax, true);
}
