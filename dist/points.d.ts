import { Extent, Position } from './types';
export declare function write(coordinates: Position[], extent: Extent, shpView: DataView, shxView: DataView): void;
export declare function extent(coordinates: Position[]): Extent;
export declare function parts(geometries: Position[], type: number): number;
export declare function shxLength(coordinates: Position[]): number;
export declare function shpLength(coordinates: Position[]): number;
