import type { Feature } from 'geojson';
import type { DBFRow, GeoJSONFeatureCollection, GeometryType, Layer } from './types';

export function point(gj: GeoJSONFeatureCollection): Layer {
  return justType('Point', 'POINT')(gj);
}

export function line(gj: GeoJSONFeatureCollection): Layer {
  return justType('LineString', 'POLYLINE')(gj);
}

export function polygon(gj: GeoJSONFeatureCollection): Layer {
  return justType('Polygon', 'POLYGON')(gj);
}

function justType(type: string, TYPE: GeometryType) {
  return function (gj: GeoJSONFeatureCollection): Layer {
    const oftype = gj.features.filter(isType(type));
    return {
      geometries:
        TYPE === 'POLYGON' || TYPE === 'POLYLINE'
          ? [oftype.map(justCoords)]
          : oftype.map(justCoords),
      properties: oftype.map(justProps),
      type: TYPE,
    };
  };
}

function justCoords(t: Feature): any {
  const c = (t.geometry as any)?.coordinates ?? [];
  if (c[0] !== undefined && c[0][0] !== undefined && c[0][0][0] !== undefined) {
    if (c[0].length > 1) {
      return c;
    } else {
      return c[0];
    }
  } else {
    return c;
  }
}

function justProps(t: Feature): DBFRow {
  return (t.properties ?? {}) as DBFRow;
}

function isType(t: string) {
  return function (f: Feature): boolean {
    return f.geometry?.type === t;
  };
}
