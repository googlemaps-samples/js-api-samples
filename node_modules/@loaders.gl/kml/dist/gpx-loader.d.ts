import type { LoaderOptions, LoaderWithParser } from '@loaders.gl/loader-utils';
import type { GeoJSONRowTable, FeatureCollection, ObjectRowTable } from '@loaders.gl/schema';
export type GPXLoaderOptions = LoaderOptions & {
    gpx?: {
        shape?: 'object-row-table' | 'geojson-row-table' | 'geojson' | 'binary' | 'raw';
        /** @deprecated. Use options.gpx.shape */
        type?: 'object-row-table' | 'geojson-row-table' | 'geojson' | 'binary' | 'raw';
    };
    gis?: {
        /** @deprecated. Use options.gpx.shape */
        format?: 'object-row-table' | 'geojson-row-table' | 'geojson' | 'binary' | 'raw';
    };
};
/**
 * Loader for GPX (GPS exchange format)
 */
export declare const GPXLoader: {
    name: string;
    id: string;
    module: string;
    version: any;
    extensions: string[];
    mimeTypes: string[];
    text: boolean;
    tests: string[];
    parse: (arrayBuffer: any, options?: GPXLoaderOptions) => Promise<Document | FeatureCollection<import("geojson").Geometry, import("geojson").GeoJsonProperties> | ObjectRowTable | GeoJSONRowTable | import("@loaders.gl/schema").BinaryFeatures>;
    parseTextSync: typeof parseTextSync;
    options: {
        gpx: {};
        gis: {};
    };
};
declare function parseTextSync(text: string, options?: GPXLoaderOptions): Document | FeatureCollection<import("geojson").Geometry, import("geojson").GeoJsonProperties> | ObjectRowTable | GeoJSONRowTable | import("@loaders.gl/schema").BinaryFeatures;
export declare const _typecheckGPXLoader: LoaderWithParser;
export {};
//# sourceMappingURL=gpx-loader.d.ts.map