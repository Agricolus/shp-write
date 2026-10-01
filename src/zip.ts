import JSZip from 'jszip';
import { write } from './write';
import * as geojson from './geojson';
import prj from './prj';
import type { GeoJSONFeatureCollection, ShpWriteOptions } from './types';

export function zip(
  gj: GeoJSONFeatureCollection,
  options: ShpWriteOptions = {}
): Promise<Blob | Buffer> {
  const zip = new JSZip();
  const layers = zip.folder(options.folder ? options.folder : 'layers')!;

  [geojson.point(gj), geojson.line(gj), geojson.polygon(gj)].forEach((l) => {
    if (l.geometries.length && l.geometries[0].length) {
      write(
        // field definitions
        l.properties,
        // geometry type
        l.type,
        // geometries
        l.geometries,
        (err, files) => {
          const key = l.type.toLowerCase();
          const fileName = options.types?.[key] ?? l.type;
          layers.file(fileName + '.shp', new Uint8Array(files.shp.buffer), { binary: true });
          layers.file(fileName + '.shx', new Uint8Array(files.shx.buffer), { binary: true });
          layers.file(fileName + '.dbf', new Uint8Array(files.dbf.buffer), { binary: true });
          layers.file(fileName + '.prj', prj);
        }
      );
    }
  });

  const outputType: 'blob' | 'nodebuffer' =
    typeof window !== 'undefined' ? 'blob' : 'nodebuffer';
  return zip.generateAsync({ type: outputType, compression: 'DEFLATE' }) as Promise<Blob | Buffer>;
}
