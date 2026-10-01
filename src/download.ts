import { zip } from './zip';
import type { GeoJSONFeatureCollection, ShpWriteOptions } from './types';

export function download(gj: GeoJSONFeatureCollection, options: ShpWriteOptions = {}): void {
  zip(gj, options).then((blob) => {
    saveBlob(blob as Blob, (options.file ?? 'shapes') + '.zip');
  });
}

function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
