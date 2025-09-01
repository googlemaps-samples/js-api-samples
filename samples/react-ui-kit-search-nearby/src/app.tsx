import React, {useState, useEffect, useRef, RefObject} from 'react';
import {createRoot} from 'react-dom/client';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';

import './styles.css';

const API_KEY =
  (globalThis as any).GOOGLE_MAPS_API_KEY ?? import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (!API_KEY) {
  console.error('Missing Google Maps API key');
}

const App = () => (
  <APIProvider apiKey={API_KEY} libraries={['maps', 'places', 'marker', 'geometry', 'core']}>
    <PlacesSearchLayout />
  </APIProvider>
);

const PlacesSearchLayout = () => {
  const [selectedType, setSelectedType] = useState('');
  const [places, setPlaces] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);

  const placeSearchRef = useRef<HTMLDivElement>(null);

  return (
    <div className="places-ui-kit">
      <div className="place-list-wrapper" ref={placeSearchRef}></div>
      <div className="map-container">
        <Map
          defaultCenter={{lat: 48.8566, lng: 2.3522}}
          defaultZoom={16}
          mapId="DEMO_MAP_ID"
          clickableIcons={false}
          onClick={() => setSelectedPlace(null)}
        >
          <PlaceSearchController
            placeSearchRef={placeSearchRef}
            selectedType={selectedType}
            setPlaces={setPlaces}
            setSelectedPlace={setSelectedPlace}
            selectedPlace={selectedPlace}
          />
          {places.map(place => (
            place.location && (
              <AdvancedMarker
                key={place.id}
                position={place.location}
                onClick={() => {
                  console.log('Marker clicked:', place);
                  setSelectedPlace(place);
                }}
              />
            )
          ))}
        </Map>
      </div>
      <div className="controls">
          <select name="types" className="type-select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="">Select a place type</option>
            <option value="cafe">Cafe</option>
            <option value="restaurant">Restaurant</option>
            <option value="electric_vehicle_charging_station">EV charging station</option>
          </select>
      </div>
    </div>
  );
};

interface PlaceSearchControllerProps {
    placeSearchRef: RefObject<HTMLDivElement>;
    selectedType: string;
    setPlaces: (places: any[]) => void;
    setSelectedPlace: (place: any | null) => void;
    selectedPlace: any | null;
}

const PlaceSearchController = ({
    placeSearchRef,
    selectedType,
    setPlaces,
    setSelectedPlace,
    selectedPlace
}: PlaceSearchControllerProps) => {
  const map = useMap();
  const coreLib = useMapsLibrary('core');
  const markerLib = useMapsLibrary('marker');
  const geometryLib = useMapsLibrary('geometry');

  const placeRequestRef = useRef<any>(null);
  const popupMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const placeDetailsRef = useRef<HTMLElement | null>(null);

  // Initialize the popup marker and place details element once
  useEffect(() => {
    if (!markerLib || !map) return;

    const placeDetails = document.createElement('gmp-place-details-compact');
    placeDetails.setAttribute('orientation', 'horizontal');
    placeDetailsRef.current = placeDetails;

    const placeRequest = document.createElement('gmp-place-details-place-request');
    placeRequestRef.current = placeRequest;

    const allContent = document.createElement('gmp-place-all-content');
    placeDetails.appendChild(placeRequest);
    placeDetails.appendChild(allContent);

    popupMarkerRef.current = new markerLib.AdvancedMarkerElement({
        map: null,
        content: placeDetails,
        zIndex: 100
    });
  }, [markerLib, map]);

  // Handle place search logic
  useEffect(() => {
    if (!map || !coreLib || !geometryLib || !placeSearchRef.current) return;

    if (!selectedType) {
      setPlaces([]);
      placeSearchRef.current.innerHTML = '';
      return;
    }

    const placeSearch = document.createElement('gmp-place-search');
    placeSearch.setAttribute('selectable', '');
    const allContent = document.createElement('gmp-place-all-content');
    const nearbyRequest = document.createElement('gmp-place-nearby-search-request');
    placeSearch.appendChild(allContent);
    placeSearch.appendChild(nearbyRequest);
    placeSearchRef.current.innerHTML = '';
    placeSearchRef.current.appendChild(placeSearch);

    const bounds = map.getBounds();
    const center = map.getCenter();
    if (!bounds || !center) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const diameter = geometryLib.spherical.computeDistanceBetween(ne, sw);
    const radius = Math.min((diameter / 2), 50000);

    (nearbyRequest as any).maxResultCount = 10;
    (nearbyRequest as any).locationRestriction = { center, radius };
    (nearbyRequest as any).includedTypes = [selectedType];

    const handleLoad = () => {
      const newPlaces = (placeSearch as any).places || [];
      setPlaces(newPlaces);
      if (newPlaces.length > 0) {
        const newBounds = new coreLib.LatLngBounds();
        newPlaces.forEach((p: any) => p.location && newBounds.extend(p.location));
        if (!newBounds.isEmpty()) map.fitBounds(newBounds);
      }
    };

    const handleSelect = (event: any) => setSelectedPlace(event.place);

    placeSearch.addEventListener('gmp-load', handleLoad);
    placeSearch.addEventListener('gmp-select', handleSelect);

    return () => {
      placeSearch.removeEventListener('gmp-load', handleLoad);
      placeSearch.removeEventListener('gmp-select', handleSelect);
    };
  }, [map, coreLib, geometryLib, selectedType, placeSearchRef, setPlaces, setSelectedPlace]);

  // Handle popup display logic, mirroring the vanilla JS example
  useEffect(() => {
    if (!map || !popupMarkerRef.current || !placeRequestRef.current || !placeDetailsRef.current) return;

    if (selectedPlace && selectedPlace.location) {
        (placeRequestRef.current as any).place = selectedPlace;
        if (placeDetailsRef.current) placeDetailsRef.current.style.display = 'block';

        popupMarkerRef.current.position = selectedPlace.location;
        popupMarkerRef.current.map = map;

        if (selectedPlace.viewport) {
            map.fitBounds(selectedPlace.viewport, {top: 0, left: 400});
            
            placeDetailsRef.current.addEventListener('gmp-load',() => {
                if (selectedPlace.viewport) {
                    map.fitBounds(selectedPlace.viewport, {top: 0, right: 450});
                }
            }, { once: true });
        }
    } else {
        popupMarkerRef.current.map = null;
        if (placeDetailsRef.current) placeDetailsRef.current.style.display = 'none';
    }
  }, [selectedPlace, map]);

  return null;
};

const root = createRoot(document.getElementById('app') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);