/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_place_search_nearby] */

/* [START maps_ui_kit_place_search_nearby_query_selectors] */
const mapContainer = document.getElementById('map-container') as any;
const placeSearch = document.querySelector('gmp-place-search') as any;
const placeSearchQuery =
    document.querySelector('gmp-place-nearby-search-request') as any;
const detailsContainer = document.getElementById('details-container') as any;
const placeDetails = document.querySelector('gmp-place-details-compact') as any;
const placeRequest =
    document.querySelector('gmp-place-details-place-request') as any;
const typeSelect = document.querySelector('.type-select');
/* [END maps_ui_kit_place_search_nearby_query_selectors] */

let markers = {};
let gMap;
let placeDetailsPopup;
let spherical;
let AdvancedMarkerElement;
let LatLngBounds;
let LatLng;

async function init(): Promise<void> {
  //@ts-ignore
  ({spherical} = await google.maps.importLibrary('geometry'));
  //@ts-ignore
  const {Map} = await google.maps.importLibrary('maps');
  await google.maps.importLibrary('places');
  //@ts-ignore
  ({AdvancedMarkerElement} = await google.maps.importLibrary('marker'));
  //@ts-ignore
  ({LatLngBounds, LatLng} = await google.maps.importLibrary('core'));

  let mapOptions = {
    center: {lat: -37.813, lng: 144.963},
    zoom: 16,
    mapTypeControl: false,
    clickableIcons: false,
    mapId: 'DEMO_MAP_ID'
  };

  gMap = new Map(mapContainer, mapOptions);

  placeDetailsPopup = new AdvancedMarkerElement(
      {map: null, content: placeDetails, zIndex: 100});

  findCurrentLocation();

  gMap.addListener('click', (e) => {
    hidePlaceDetailsPopup();
  });
  /* [START maps_ui_kit_place_search_nearby_event] */
  //@ts-ignore
  typeSelect.addEventListener('change', (event) => {
    event.preventDefault();
    searchPlaces();
  });

  placeSearch.addEventListener('gmp-select', ({place}) => {
    if (markers[place.id]) {
      markers[place.id].click();
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
  const cappedRadius =
      Math.min((diameter / 2), 50000);  // Radius cannot be more than 50000.


  placeDetailsPopup.map = null;

  for (const markerId in markers) {
    if (Object.prototype.hasOwnProperty.call(markers, markerId)) {
      markers[markerId].map = null;
    }
  }
  markers = {};
  //@ts-ignore
  if (typeSelect.value) {
    mapContainer.style.height = '75vh';
    placeSearch.style.display = 'block';
    placeSearchQuery.maxResultCount = 10;
    placeSearchQuery.locationRestriction = { center: { lat: cent.lat(), lng: cent.lng() }, radius: cappedRadius };
    //@ts-ignore
    placeSearchQuery.includedTypes = [typeSelect.value];
    placeSearch.addEventListener('gmp-load', addMarkers, {once: true});
  }
}


async function addMarkers() {
  const bounds = new LatLngBounds();
  placeSearch.style.display = 'block';

  if (placeSearch.places.length > 0) {
    placeSearch.places.forEach((place) => {
      let marker =
          new AdvancedMarkerElement({map: gMap, position: place.location});

      marker.metadata = {id: place.id};
      markers[place.id] = marker;
      bounds.extend(place.location);

      /* [START maps_ui_kit_place_search_nearby_click_event] */
      marker.addListener('click', (event) => {
        placeRequest.place = place;
        placeDetails.style.display = 'block';

        placeDetailsPopup.position = place.location;
        placeDetailsPopup.map = gMap;

        gMap.fitBounds(place.viewport, {top: 0, left: 400});

        placeDetails.addEventListener('gmp-load', () => {
          gMap.fitBounds(place.viewport, {top: 0, right: 450});
        }, {once: true});
      });
      gMap.setCenter(bounds.getCenter());
      gMap.fitBounds(bounds);
      /* [END maps_ui_kit_place_search_nearby_click_event] */
    });
  }
}

async function findCurrentLocation() {
  //@ts-ignore
  const {LatLng} = await google.maps.importLibrary('core');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos =
              new LatLng(position.coords.latitude, position.coords.longitude);
          gMap.panTo(pos);
          gMap.setZoom(16);
        },
        () => {
          console.log('The Geolocation service failed.');
          gMap.setZoom(16);
        },
    );
  } else {
    console.log('Your browser doesn\'t support geolocation');
    gMap.setZoom(16);
  }
}

function hidePlaceDetailsPopup() {
  if (placeDetailsPopup.map) {
    placeDetailsPopup.map = null;
    placeDetails.style.display = 'none';
  }
}

init();
/* [END maps_ui_kit_place_search_nearby] */
