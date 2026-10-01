import { enlarge, blank } from './extent';
import type { Extent, Position } from './types';

export function write(
  coordinates: Position[],
  extent: Extent,
  shpView: DataView,
  shxView: DataView
): void {
  const contentLength = 28; // 8 header, 20 content
  let fileLength = 100;
  let shpI = 0;
  let shxI = 0;

  coordinates.forEach((coords, i) => {
    // HEADER
    // 4 record number
    // 4 content length in 16-bit words (20/2)
    shpView.setInt32(shpI, i);
    shpView.setInt32(shpI + 4, 10);

    // record
    // (8 + 8) + 4 = 20 content length
    shpView.setInt32(shpI + 8, 1, true); // POINT=1
    shpView.setFloat64(shpI + 12, coords[0], true); // X
    shpView.setFloat64(shpI + 20, coords[1], true); // Y

    // index
    shxView.setInt32(shxI, fileLength / 2); // length in 16-bit words
    shxView.setInt32(shxI + 4, 10);

    shxI += 8;
    shpI += contentLength;
    fileLength += contentLength;
  });
}

export function extent(coordinates: Position[]): Extent {
  return coordinates.reduce((e, coords) => enlarge(e, coords), blank());
}

export function parts(geometries: Position[], type: number): number {
  return geometries.length;
}

export function shxLength(coordinates: Position[]): number {
  return coordinates.length * 8;
}

export function shpLength(coordinates: Position[]): number {
  return coordinates.length * 28;
}
