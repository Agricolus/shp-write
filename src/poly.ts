import { enlarge, blank } from './extent';
import { geometries as GEOMETRIES } from './geometries';
import type { Extent } from './types';

export function write(
  geometries: any[],
  extent: Extent,
  shpView: DataView,
  shxView: DataView,
  TYPE: number
): void {
  let shpI = 0;
  let shxI = 0;
  let shxOffset = 100;

  geometries.forEach(writePolyLine);

  function writePolyLine(coordinates: any, i: number) {
    const flattened = justCoords(coordinates);
    const noParts = parts([coordinates], TYPE);
    const contentLength = flattened.length * 16 + 48 + (noParts - 1) * 4;

    const featureExtent = flattened.reduce((e: Extent, c: any) => enlarge(e, c), blank());

    // INDEX
    shxView.setInt32(shxI, shxOffset / 2); // offset
    shxView.setInt32(shxI + 4, contentLength / 2); // offset length

    shxI += 8;
    shxOffset += contentLength + 8;

    shpView.setInt32(shpI, i + 1); // record number
    shpView.setInt32(shpI + 4, contentLength / 2); // length
    shpView.setInt32(shpI + 8, TYPE, true); // POLYLINE=3
    shpView.setFloat64(shpI + 12, featureExtent.xmin, true); // EXTENT
    shpView.setFloat64(shpI + 20, featureExtent.ymin, true);
    shpView.setFloat64(shpI + 28, featureExtent.xmax, true);
    shpView.setFloat64(shpI + 36, featureExtent.ymax, true);
    shpView.setInt32(shpI + 44, noParts, true);
    shpView.setInt32(shpI + 48, flattened.length, true); // POINTS
    shpView.setInt32(shpI + 52, 0, true); // The first part - index zero

    const onlyParts = coordinates.reduce((arr: any[], coords: any) => {
      if (Array.isArray(coords[0][0])) {
        arr = arr.concat(coords);
      } else {
        arr.push(coords);
      }
      return arr;
    }, []);

    for (let p = 1; p < noParts; p++) {
      shpView.setInt32(
        // set part index
        shpI + 52 + p * 4,
        onlyParts.reduce((a: number, b: any, idx: number) => (idx < p ? a + b.length : a), 0),
        true
      );
    }

    flattened.forEach((coords: any, j: number) => {
      shpView.setFloat64(shpI + 56 + j * 16 + (noParts - 1) * 4, coords[0], true); // X
      shpView.setFloat64(shpI + 56 + j * 16 + (noParts - 1) * 4 + 8, coords[1], true); // Y
    });

    shpI += contentLength + 8;
  }
}

export function shpLength(geometries: any[]): number {
  return geometries.length * 56 + justCoords(geometries).length * 16;
}

export function shxLength(geometries: any[]): number {
  return geometries.length * 8;
}

export function extent(coordinates: any[]): Extent {
  return justCoords(coordinates).reduce((e: Extent, c: any) => enlarge(e, c), blank());
}

export function parts(geometries: any[], TYPE: number): number {
  let no = 1;
  if (TYPE === GEOMETRIES.POLYGON || TYPE === GEOMETRIES.POLYLINE) {
    no = geometries.reduce((no: number, coords: any) => {
      no += coords.length;
      if (Array.isArray(coords[0][0][0])) {
        // multi
        no += coords.reduce((no: number, rings: any) => no + rings.length - 1, 0);
      }
      return no;
    }, 0);
  }
  return no;
}

function justCoords(coords: any, l?: any[]): any[] {
  if (l === undefined) l = [];
  if (typeof coords[0][0] === 'object') {
    return coords.reduce((memo: any[], c: any) => memo.concat(justCoords(c)), l);
  } else {
    return coords;
  }
}
