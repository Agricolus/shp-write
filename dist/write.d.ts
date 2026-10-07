import { DBFRow, GeometryType, WriteCallback } from './types';
export declare function write(rows: DBFRow[], geometry_type: GeometryType, geometries: any[], callback: WriteCallback): void;
