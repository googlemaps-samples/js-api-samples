/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_place_search_text] */
/* [START maps_ui_kit_place_search_text_query_selectors] */
const mapContainer = document.getElementById('map-container') as any;
const placeSearch = document.querySelector('gmp-place-search') as any;
const placeSearchQuery =
    document.querySelector('gmp-place-text-search-request') as any;
const queryInput = document.querySelector('.query-input') as any;
const searchButton = document.querySelector('.search-button') as any;
const detailsContainer = document.getElementById('details-container') as any;
const placeDetails = document.querySelector('gmp-place-details-compact') as any;
const placeRequest =
    document.querySelector('gmp-place-details-place-request') as any;
/* [END maps_ui_kit_place_search_text_query_selectors] */

let markers = {};
let previousSearchQuery = '';
let gMap;
let placeDetailsPopup;

let AdvancedMarkerElement;
let LatLngBounds;
let LatLng;

/* [START maps_ui_kit_place_search_text_init_map] */
async function initMap() {
  //@ts-ignore
  const {Map} = await google.maps.importLibrary('maps');
  //@ts-ignore
  await google.maps.importLibrary('places');
  //@ts-ignore
  ({AdvancedMarkerElement} = await google.maps.importLibrary('marker'));
  //@ts-ignore
  ({LatLngBounds, LatLng} = await google.maps.importLibrary('core'));

  let mapOptions = {
    center: {lat: 37.422, lng: -122.085},
    zoom: 2,
    mapTypeControl: false,
    clickableIcons: false,
    mapId: 'DEMO_MAP_ID'
  };

  gMap = new Map(mapContainer, mapOptions);

  placeDetailsPopup = new AdvancedMarkerElement(
      {map: null, content: placeDetails, zIndex: 100});

  findCurrentLocation();

  /* [START maps_ui_kit_place_search_text_event_handlers] */

  gMap.addListener('click', (e) => {
    hidePlaceDetailsPopup();
  });

  searchButton.addEventListener('click', searchPlaces);
  queryInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter') {
      event.preventDefault();
      searchPlaces();
    }
  });

  placeSearch.addEventListener('gmp-select', ({place}) => {
    if (markers[place.id]) {
      markers[place.id].click();
    }
  });
  /* [END maps_ui_kit_place_search_text_event_handlers] */
}
/* [END maps_ui_kit_place_search_text_init_map] */

/* [START maps_ui_kit_place_search_text_query] */
function searchPlaces() {
  if (queryInput.value.trim() === previousSearchQuery) {
    return;
  }
  previousSearchQuery = queryInput.value.trim();
  placeDetailsPopup.map = null;

  for (const markerId in markers) {
    if (Object.prototype.hasOwnProperty.call(markers, markerId)) {
      markers[markerId].map = null;
    }
  }
  markers = {};
  if (queryInput.value) {
    // mapContainer.style.height = '75vh';
    placeSearch.style.display = 'block';
    placeSearchQuery.textQuery = queryInput.value;
    placeSearchQuery.locationBias = gMap.getBounds();
    placeSearch.addEventListener('gmp-load', addMarkers, {once: true});
  }
}
/* [END maps_ui_kit_place_search_text_query] */

/* [START maps_ui_kit_place_search_text_add_markers] */
async function addMarkers() {
  const bounds = new LatLngBounds();

  if (placeSearch.places.length > 0) {
    placeSearch.places.forEach((place) => {
      let marker =
          new AdvancedMarkerElement({map: gMap, position: place.location});

      marker.metadata = {id: place.id};
      markers[place.id] = marker;
      bounds.extend(place.location);

      /* [START maps_ui_kit_place_search_text_click_event] */

      marker.addListener('click', (event) => {
        placeRequest.place = place;
        placeDetails.style.display = 'block';


        placeDetailsPopup.position = place.location;
        placeDetailsPopup.map = gMap;

        gMap.fitBounds(place.viewport, {top: 200, right: 450});
      });
      /* [END maps_ui_kit_place_search_text_click_event] */

      gMap.setCenter(bounds.getCenter());
      gMap.fitBounds(bounds);
    });
  }
}
/* [END maps_ui_kit_place_search_text_add_markers] */

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

initMap();
/* [END maps_ui_kit_place_search_text] */
