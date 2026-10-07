import { FeatureCollection } from 'geojson';
/** A single [x, y] coordinate position. */
export type Position = number[];
/** A bounding box with extreme coordinates. */
export interface Extent {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
}
/** OGC shapefile geometry type names. */
export type GeometryType = 'NULL' | 'POINT' | 'POLYLINE' | 'POLYGON' | 'MULTIPOINT' | 'POINTZ' | 'POLYLINEZ' | 'POLYGONZ' | 'MULTIPOINTZ' | 'POINTM' | 'POLYLINEM' | 'POLYGONM' | 'MULTIPOINTM' | 'MULTIPATCH';
/** A row of attribute data written to the DBF file. */
export type DBFRow = Record<string, unknown>;
/** A single DBF field descriptor. */
export interface DBFField {
    name: string;
    type: string;
    size: number;
}
/** A layer produced by splitting a GeoJSON collection by geometry type. */
export interface Layer {
    geometries: any[];
    properties: DBFRow[];
    type: GeometryType;
}
/** Naming options for generated files. */
export interface ShpWriteOptions {
    /** Name of the zipped folder (default: `layers`). */
    folder?: string;
    /** Base file name of the downloaded `.zip` (default: `shapes`). */
    file?: string;
    /** Per-geometry-type file name overrides. Keys: `point`, `polyline`, `polygon`. */
    types?: {
        point?: string;
        polyline?: string;
        polygon?: string;
        [key: string]: string | undefined;
    };
}
/** Result of the low-level `write` call. */
export interface ShpWriteResult {
    shp: DataView;
    shx: DataView;
    dbf: DataView;
    prj: string;
}
/** Callback used by the low-level `write` API. */
export type WriteCallback = (err: Error | null, result: ShpWriteResult) => void;
/** A module that writes a specific geometry type to shp/shx buffers. */
export interface GeometryWriter {
    parts(geometries: any[], type: number): number;
    shpLength(geometries: any[]): number;
    shxLength(geometries: any[]): number;
    extent(geometries: any[]): Extent;
    write(geometries: any[], extent: Extent, shpView: DataView, shxView: DataView, type?: number): void;
}
/** A GeoJSON FeatureCollection accepted by `zip` and `download`. */
export type GeoJSONFeatureCollection = FeatureCollection;
