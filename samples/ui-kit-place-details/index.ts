/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_place_details] */
// Use querySelector to select elements for interaction.
const map = document.querySelector('gmp-map') as any;
const placeDetails = document.querySelector('gmp-place-details') as any;
const marker = document.querySelector('gmp-advanced-marker') as any;

async function initMap(): Promise<void> {
    // Request needed libraries.
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;

  // Calls the geolocation helper function to center the map on the current
  // device location.
  findCurrentLocation();

  // Hide the map type control.
  map.innerMap.setOptions({mapTypeControl: false});

  // Add an event listener to handle map clicks.
  map.innerMap.addListener('click', async (event) => {
    marker.position = null;
    event.stop();
    placeDetails.style.visibility = 'visible';
    if (event.placeId) {
      // Fire when the user clicks a POI.
      await placeDetails.configureFromPlace({id: event.placeId});
    } else {
      // Fire when the user clicks the map (not on a POI).
      await placeDetails.configureFromLocation(event.latLng);
    }
    // Show the marker at the selected place.
    marker.position = placeDetails.place.location;
    marker.style.display = 'block';
  });
}

// Helper function for geolocation.
async function findCurrentLocation() {
  const { LatLng } = await google.maps.importLibrary('core') as google.maps.CoreLibrary;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos =
              new LatLng(position.coords.latitude, position.coords.longitude);
          map.innerMap.panTo(pos);
          map.innerMap.setZoom(16);
        },
        () => {
          console.log('The Geolocation service failed.');
          map.innerMap.setZoom(16);
        },
    );
  } else {
    console.log('Your browser doesn\'t support geolocation');
    map.innerMap.setZoom(16);
  }
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
/* [END maps_ui_kit_place_details] */
export {};