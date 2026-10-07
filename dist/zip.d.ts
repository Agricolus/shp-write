import { GeoJSONFeatureCollection, ShpWriteOptions } from './types';
export declare function zip(gj: GeoJSONFeatureCollection, options?: ShpWriteOptions): Promise<Blob | Buffer>;
