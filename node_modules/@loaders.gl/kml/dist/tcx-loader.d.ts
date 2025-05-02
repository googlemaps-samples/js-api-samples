import type { LoaderWithParser, LoaderOptions } from '@loaders.gl/loader-utils';
import type { GeoJSONRowTable, FeatureCollection, ObjectRowTable } from '@loaders.gl/schema';
export type TCXLoaderOptions = LoaderOptions & {
    tcx?: {
        shape?: 'object-row-table' | 'geojson-row-table' | 'geojson' | 'binary' | 'raw';
        /** @deprecated. Use options.tcx.shape */
        type?: 'object-row-table' | 'geojson-row-table' | 'geojson' | 'binary' | 'raw';
    };
    gis?: {
        /** @deprecated. Use options.tcx.shape */
        format?: 'object-row-table' | 'geojson-row-table' | 'geojson' | 'binary' | 'raw';
    };
};
/**
 * Loader for TCX (Training Center XML) - Garmin GPS track format
 */
export declare const TCXLoader: {
    name: string;
    id: string;
    module: string;
    version: any;
    extensions: string[];
    mimeTypes: string[];
    text: boolean;
    tests: string[];
    parse: (arrayBuffer: any, options?: TCXLoaderOptions) => Promise<Document | FeatureCollection<import("geojson").Geometry, import("geojson").GeoJsonProperties> | ObjectRowTable | GeoJSONRowTable | import("@loaders.gl/schema").BinaryFeatures>;
    parseTextSync: typeof parseTextSync;
    options: {
        tcx: {};
        gis: {};
    };
};
declare function parseTextSync(text: string, options?: TCXLoaderOptions): Document | FeatureCollection<import("geojson").Geometry, import("geojson").GeoJsonProperties> | ObjectRowTable | GeoJSONRowTable | import("@loaders.gl/schema").BinaryFeatures;
export declare const _typecheckTCXLoader: LoaderWithParser;
export {};
//# sourceMappingURL=tcx-loader.d.ts.map