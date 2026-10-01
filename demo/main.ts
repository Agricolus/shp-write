import { download } from '../src/index';

document.getElementById('download')!.addEventListener('click', () => {
  download(
    {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [0, 0] },
          properties: { name: 'Foo' },
        },
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [0, 10] },
          properties: { name: 'Bar' },
        },
      ],
    },
    {
      folder: 'myshapes',
      file: 'myshapes',
      types: { point: 'mypoints', polyline: 'mylines', polygon: 'mypolygons' },
    }
  );
});
