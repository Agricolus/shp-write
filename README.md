# shp-write

Writes shapefiles in pure JavaScript/TypeScript. Generates the `.shp`, `.shx`,
`.dbf` and `.prj` components, and zips them (with
[jszip](https://stuk.github.io/jszip/)) for in-browser downloads.

## Install

```sh
npm install shp-write
```

## Usage

```ts
import { download, zip, write } from 'shp-write';

const collection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [0, 0] },
      properties: { name: 'Foo' },
    },
  ],
};

// trigger a browser download of the zipped shapefile
download(collection, { folder: 'myshapes', file: 'myshapes' });

// build a zip without downloading (Buffer in Node, Blob in the browser)
const buffer = await zip(collection);
```

## API

### `download(geojson, options?)`

Converts a GeoJSON `FeatureCollection` into shapefiles and triggers a browser
download of the resulting `.zip`.

### `write(data, geometrytype, geometries, callback)`

Low-level writer. Given rows of attribute data, an OGC geometry type
(`POINT`, `POLYLINE`, `POLYGON`) and bare coordinate arrays, calls `callback`
with `err` and `{ shp, shx, dbf, prj }` (each of `shp`/`shx`/`dbf` is a
`DataView`, `prj` is a string).

### `zip(geojson, options?)`

Returns a `Promise` of a `Buffer` (Node) or `Blob` (browser) of a zipped
shapefile.

### Options

```ts
{
  folder: 'layers',   // folder name inside the zip
  file: 'shapes',     // downloaded file name (without extension)
  types: {            // per-geometry-type file names
    point: 'mypoints',
    polyline: 'mylines', // note: the key is `polyline`, not `line`
    polygon: 'mypolygons',
  },
}
```

## Caveats

- Requires `TypedArray` support.
- Geometries: Point, LineString, Polygon, MultiLineString, MultiPolygon.
- Tabular properties are exported with the shapefile field-name length limit.

## Development

```sh
npm install
npm run typecheck   # tsc --noEmit
npm test            # vitest
npm run build       # vite build -> dist/ (ESM + type declarations)
npm run dev         # vite dev server with the demo page
```

## License

BSD-2-Clause
