import React, {useCallback, useEffect, useRef, useState} from 'react';
import {getFormattedTime} from './utility-hooks';
import {createRoot} from 'react-dom/client';

import {APIProvider, useMapsLibrary} from '@vis.gl/react-google-maps';

import {Map3D, Map3DCameraProps} from './map-3d';
import {Polyline} from './map-3d/Polyline';
import {Marker3D} from './map-3d/Marker3D';
import './styles.css';

const API_KEY = "AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8" as string;

const INITIAL_VIEW_PROPS = {
  center: {lat:45.92325225265732, lng:7.810902484789684, altitude: 5000},
  range: 15000,
  tilt: 45,
  heading: 0,
  roll: 0
};

// [START maps_react_map_3d_custom_gpx_map_component]
const Map3DExample = () => {
  const maps3d = useMapsLibrary('maps3d');
  const [viewProps, setViewProps] = useState(INITIAL_VIEW_PROPS);
  const [path, setPath] = useState<google.maps.LatLngAltitudeLiteral[]>([]);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const mapRef = useRef<google.maps.maps3d.Map3DElement>(null);
  const startMarkerRef = useRef<google.maps.maps3d.Marker3DElement>(null);
  const endMarkerRef = useRef<google.maps.maps3d.Marker3DElement>(null);
  const hasAnimated = useRef(false);

  // [START maps_react_map_3d_custom_gpx_fetch_gpx]
  useEffect(() => {
    const fetchGpx = async () => {
      const response = await fetch('/track.gpx');
      const gpxText = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(gpxText, 'text/xml');
      const trackpoints = xmlDoc.querySelectorAll('trkpt');

      const coordinates = Array.from(trackpoints).map(point => ({
        lat: parseFloat(point.getAttribute('lat')!),
        lng: parseFloat(point.getAttribute('lon')!),
        altitude: 0
      }));

      setPath(coordinates);

      if (trackpoints.length > 0) {
        const firstTrackpoint = trackpoints[0];
        const lastTrackpoint = trackpoints[trackpoints.length - 1];

        setStartTime(getFormattedTime(firstTrackpoint, true));
        setEndTime(getFormattedTime(lastTrackpoint, true));
      }
    };

    fetchGpx();
  }, []);
  // [END maps_react_map_3d_custom_gpx_fetch_gpx]

  useEffect(() => {
    if (!mapRef.current || hasAnimated.current) return;

    mapRef.current.flyCameraAround({
      camera: INITIAL_VIEW_PROPS,
      durationMillis: 100000,
      repeatCount: 1
    });
    hasAnimated.current = true;
  }, [mapRef.current]);

  useEffect(() => {
    if (!mapRef.current) return;

    const mapElement = mapRef.current;
    const stopAnimation = () => {
      (mapElement as any).stopCameraAnimation();
    };

    mapElement.addEventListener("pointerdown", stopAnimation);

    return () => {
      mapElement.removeEventListener("pointerdown", stopAnimation);
    };
  }, [mapRef.current]);

  const handleCameraChange = useCallback((props: Map3DCameraProps) => {
    setViewProps(oldProps => ({...oldProps, ...props}));
  }, []);


  if (!maps3d) return null;

  const startMarkerLabel = startTime ? startTime : '';
  const endMarkerLabel = endTime ? endTime : '';

  return (
    <Map3D
      ref={mapRef}
      {...viewProps}
      onCameraChange={handleCameraChange}>
      {/* [START maps_react_map_3d_custom_gpx_polyline] */}
      <Polyline
        path={path}
        strokeColor={'rgba(0, 149, 255, 1)'}
        outerColor={'rgba(255,255,255,1)'}
        strokeWidth={3.5}
        outerWidth={0.4}
        drawsOccludedSegments={true}
      />
      {/* [END maps_react_map_3d_custom_gpx_polyline] */}
      {path.length > 0 && (
        <>
          {/* [START maps_react_map_3d_custom_gpx_markers] */}
          <Marker3D
            ref={startMarkerRef}
            position={path[0]}
            altitudeMode={maps3d.AltitudeMode.CLAMP_TO_GROUND}
            extruded={true}
            label={startMarkerLabel}
          />
          <Marker3D
            ref={endMarkerRef}
            position={path[path.length - 1]}
            altitudeMode={maps3d.AltitudeMode.CLAMP_TO_GROUND}
            extruded={true}
            label={endMarkerLabel}
          />
          {/* [END maps_react_map_3d_custom_gpx_markers] */}
        </>
      )}
    </Map3D>
  );
};
// [END maps_react_map_3d_custom_gpx_map_component]

// [START maps_react_map_3d_custom_gpx_api_provider]
const App = () => {
  return (
    <APIProvider apiKey={API_KEY} version={'weekly'}>
      <Map3DExample />
    </APIProvider>
  );
};
// [END maps_react_map_3d_custom_gpx_api_provider]

export default App;

// [START maps_react_map_3d_custom_gpx_render_to_dom]
export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
// [END maps_react_map_3d_custom_gpx_render_to_dom]
