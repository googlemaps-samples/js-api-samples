// If you are using modules, you can export an empty object to make this a module.
import React from 'react';
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      VITE_API_KEY: string;
    }
  }

  namespace google.maps.maps3d {
    interface Marker3DElementOptions {
      position: google.maps.LatLngAltitudeLiteral;
      altitudeMode?: google.maps.maps3d.AltitudeMode;
      extruded?: boolean;
      label?: string;
    }

    class Marker3DElement extends HTMLElement implements Marker3DElementOptions {
      position: google.maps.LatLngAltitudeLiteral;
      altitudeMode?: google.maps.maps3d.AltitudeMode;
      extruded?: boolean;
      label?: string;
    }

    interface PinElementOptions {
      background?: string;
      borderColor?: string;
      glyphColor?: string;
      glyphText?: string;
    }

    class PinElement extends HTMLElement implements PinElementOptions {
      background?: string;
      borderColor?: string;
      glyphColor?: string;
      glyphText?: string;
    }
  }

  namespace JSX {
    interface IntrinsicElements {
      'gmp-marker-3d': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
        google.maps.maps3d.Marker3DElementOptions;
      'gmp-pin': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
        google.maps.maps3d.PinElementOptions;
    }
  }
}