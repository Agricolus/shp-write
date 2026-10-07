import { DBFField, DBFRow } from './types';
/** Build a full DBF file structure from an array of row objects. */
export declare function structure(data: DBFRow[], meta?: DBFField[]): DataView;
