/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_place_search_nearby] */

/* [START maps_ui_kit_place_search_nearby_query_selectors] */
const map = document.querySelector('gmp-map') as google.maps.MapElement;
const placeSearch = document.querySelector('gmp-place-search') as HTMLElement;
const placeSearchQuery = document.querySelector(
  'gmp-place-nearby-search-request',
) as HTMLElement;
const placeDetails = document.querySelector(
  'gmp-place-details-compact',
) as HTMLElement;
const placeRequest = document.querySelector(
  'gmp-place-details-place-request',
) as HTMLElement;
const typeSelect = document.querySelector('.type-select') as HTMLSelectElement;
/* [END maps_ui_kit_place_search_nearby_query_selectors] */

let markers = {};
let gMap;
let placeDetailsPopup;
let spherical;
let AdvancedMarkerElement;
let LatLngBounds;

async function init(): Promise<void> {
  const geometry = (await google.maps.importLibrary(
    'geometry',
  )) as google.maps.GeometryLibrary;
  await google.maps.importLibrary('maps');
  await google.maps.importLibrary('places');
  const marker = (await google.maps.importLibrary(
    'marker',
  )) as google.maps.MarkerLibrary;
  const core = (await google.maps.importLibrary(
    'core',
  )) as google.maps.CoreLibrary;

  spherical = geometry.spherical;
  AdvancedMarkerElement = marker.AdvancedMarkerElement;
  LatLngBounds = core.LatLngBounds;

  gMap = map.innerMap;

  placeDetailsPopup = new AdvancedMarkerElement({
    map: null,
    content: placeDetails,
    zIndex: 100,
  });

  findCurrentLocation();

  gMap.addListener('click', () => {
    hidePlaceDetailsPopup();
  });
  /* [START maps_ui_kit_place_search_nearby_event] */
  typeSelect.addEventListener('change', (event) => {
    event.preventDefault();
    searchPlaces();
  });

  (placeSearch as any).addEventListener('gmp-select', ({place}) => {
    if (markers[place.id]) {
      (markers[place.id] as any).click();
    }
  });
}
/* [END maps_ui_kit_place_search_nearby_event] */
function searchPlaces() {
  const bounds = gMap.getBounds();
  const cent = gMap.getCenter();
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  const diameter = spherical.computeDistanceBetween(ne, sw);
  const cappedRadius = Math.min(diameter / 2, 50000); // Radius cannot be more than 50000.

  placeDetailsPopup.map = null;

  for (const markerId in markers) {
    if (Object.prototype.hasOwnProperty.call(markers, markerId)) {
      markers[markerId].map = null;
    }
  }
  markers = {};
  if (typeSelect.value) {
    map.style.height = '75vh';
    placeSearch.style.visibility = 'visible';
    placeSearch.style.opacity = '1';
    (placeSearchQuery as any).maxResultCount = 10;
    (placeSearchQuery as any).locationRestriction = {
      center: {lat: cent.lat(), lng: cent.lng()},
      radius: cappedRadius,
    };
    (placeSearchQuery as any).includedTypes = [typeSelect.value];
    placeSearch.addEventListener('gmp-load', addMarkers, {once: true});
  }
}

async function addMarkers() {
  const bounds = new LatLngBounds();
  placeSearch.style.visibility = 'visible';
  placeSearch.style.opacity = '1';

  if ((placeSearch as any).places.length > 0) {
    (placeSearch as any).places.forEach((place) => {
      const marker = new AdvancedMarkerElement({
        map: gMap,
        position: place.location,
        collisionBehavior:
          google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL,
      });

      (marker as any).metadata = {id: place.id};
      markers[place.id] = marker;
      bounds.extend(place.location);

      /* [START maps_ui_kit_place_search_nearby_click_event] */
      marker.addListener('click', () => {
        (placeRequest as any).place = place;
        placeDetails.style.visibility = 'visible';
        placeDetails.style.opacity = '1';

        placeDetailsPopup.position = place.location;
        placeDetailsPopup.map = gMap;

        gMap.fitBounds(place.viewport, {top: 0, left: 400});
      });
      gMap.setCenter(bounds.getCenter());
      gMap.fitBounds(bounds);
      /* [END maps_ui_kit_place_search_nearby_click_event] */
    });
  }
}

async function findCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        gMap.panTo(pos);
        gMap.setZoom(16);
      },
      () => {
        console.log('The Geolocation service failed.');
        gMap.setZoom(16);
      },
    );
  } else {
    console.log("Your browser doesn't support geolocation");
    gMap.setZoom(16);
  }
}

function hidePlaceDetailsPopup() {
  if (placeDetailsPopup.map) {
    placeDetailsPopup.map = null;
    placeDetails.style.visibility = 'hidden';
    placeDetails.style.opacity = '0';
  }
}

init();
/* [END maps_ui_kit_place_search_nearby] */
