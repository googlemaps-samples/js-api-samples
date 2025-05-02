import type { LoaderWithParser, LoaderOptions } from '@loaders.gl/loader-utils';
import { GeoJSONRowTable, FeatureCollection, ObjectRowTable } from '@loaders.gl/schema';
export type KMLLoaderOptions = LoaderOptions & {
    kml?: {
        shape?: 'object-row-table' | 'geojson-row-table' | 'geojson' | 'binary' | 'raw';
        /** @deprecated. Use options.kml.shape */
        type?: 'object-row-table' | 'geojson-row-table' | 'geojson' | 'binary' | 'raw';
    };
    gis?: {
        /** @deprecated. Use options.kml.shape */
        format?: 'object-row-table' | 'geojson-row-table' | 'geojson' | 'binary' | 'raw';
    };
};
/**
 * Loader for KML (Keyhole Markup Language)
 */
export declare const KMLLoader: {
    name: string;
    id: string;
    module: string;
    version: any;
    extensions: string[];
    mimeTypes: string[];
    text: boolean;
    tests: string[];
    parse: (arrayBuffer: any, options?: KMLLoaderOptions) => Promise<Document | FeatureCollection<import("geojson").Geometry, import("geojson").GeoJsonProperties> | ObjectRowTable | GeoJSONRowTable | import("@loaders.gl/schema").BinaryFeatures>;
    parseTextSync: typeof parseTextSync;
    options: {
        kml: {};
        gis: {};
    };
};
declare function parseTextSync(text: string, options?: KMLLoaderOptions): Document | FeatureCollection<import("geojson").Geometry, import("geojson").GeoJsonProperties> | ObjectRowTable | GeoJSONRowTable | import("@loaders.gl/schema").BinaryFeatures;
export declare const _typecheckKMLLoader: LoaderWithParser;
export {};
//# sourceMappingURL=kml-loader.d.ts.map