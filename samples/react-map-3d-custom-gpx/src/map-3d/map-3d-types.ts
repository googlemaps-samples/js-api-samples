/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-explicit-any */

import {DOMAttributes, RefAttributes} from 'react';

// add an overload signature for the useMapsLibrary hook, so typescript
// knows what the 'maps3d' library is.
declare module '@vis.gl/react-google-maps' {
  export function useMapsLibrary(
    name: 'maps3d'
  ): typeof google.maps.maps3d | null;
}

// temporary fix until @types/google.maps is updated with the latest changes
declare global {
  namespace google.maps.maps3d {
    interface CameraOptions {
      center?: google.maps.LatLngAltitude | google.maps.LatLngAltitudeLiteral;
      heading?: number;
      range?: number;
      roll?: number;
      tilt?: number;
    }

    interface FlyAroundAnimationOptions {
      camera: CameraOptions;
      durationMillis?: number;
      repeatCount?: number;
    }

    interface LocationClickEvent extends Event {
      position: google.maps.LatLngAltitude | null;
    }

    interface Map3DElement extends HTMLElement {
      mode?: 'HYBRID' | 'SATELLITE';
      mapId?: string;
      flyCameraAround(options: FlyAroundAnimationOptions): void;
    }
  }
}

// add the <gmp-map-3d> custom-element to the JSX.IntrinsicElements
// interface, so it can be used in jsx
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ['gmp-map-3d']: CustomElement<
        google.maps.maps3d.Map3DElement,
        google.maps.maps3d.Map3DElement
      >;
      ['gmp-polyline-3d']: CustomElement<
        google.maps.maps3d.Polyline3DElement,
        google.maps.maps3d.Polyline3DElementOptions
      >;
    }
  }
}

// a helper type for CustomElement definitions
type CustomElement<TElem, TAttr> = Partial<
  TAttr &
    DOMAttributes<TElem> &
    RefAttributes<TElem> & {
      // for whatever reason, anything else doesn't work as children
      // of a custom element, so we allow `any` here
      children: any;
    }
>;
