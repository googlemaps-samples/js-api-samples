import {useMapsLibrary} from '@vis.gl/react-google-maps';
import React, {useEffect, useState} from 'react';
import {useCallbackRef, useDeepCompareEffect} from '../utility-hooks';

export type PolylineProps = google.maps.maps3d.Polyline3DElementOptions & {
  path?: google.maps.LatLngAltitudeLiteral[];
  strokeColor?: string;
  outerColor?: string;
  strokeWidth?: number;
  outerWidth?: number;
  altitudeMode?: google.maps.maps3d.AltitudeMode;
  drawsOccludedSegments?: boolean;
};

export const Polyline = (props: PolylineProps) => {
  const maps3d = useMapsLibrary('maps3d');
  const [polylineElement, polylineRef] =
    useCallbackRef<google.maps.maps3d.Polyline3DElement>();

  useDeepCompareEffect(() => {
    if (!polylineElement) return;

    Object.assign(polylineElement, props);
  }, [polylineElement, props]);

  const [customElementsReady, setCustomElementsReady] = useState(false);
  useEffect(() => {
    customElements.whenDefined('gmp-polyline-3d').then(() => {
      setCustomElementsReady(true);
    });
  }, []);

  if (!customElementsReady || !maps3d) return null;

  return <gmp-polyline-3d ref={polylineRef}></gmp-polyline-3d>;
};