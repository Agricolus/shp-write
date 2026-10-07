import { Extent } from './types';
export declare function write(geometries: any[], extent: Extent, shpView: DataView, shxView: DataView, TYPE: number): void;
export declare function shpLength(geometries: any[]): number;
export declare function shxLength(geometries: any[]): number;
export declare function extent(coordinates: any[]): Extent;
export declare function parts(geometries: any[], TYPE: number): number;
