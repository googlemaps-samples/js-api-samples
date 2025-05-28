/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_place_details] */
// Use querySelector to select elements for interaction.
/* [START maps_ui_kit_place_details_query_selector] */
const map = document.querySelector('gmp-map') as any;
const placeDetails = document.querySelector('gmp-place-details') as any;
const placeDetailsRequest = document.querySelector('gmp-place-details-place-request') as any;
const marker = document.querySelector('gmp-advanced-marker') as any;
/* [END maps_ui_kit_place_details_query_selector] */

let center = { lat: 47.759737, lng: -122.250632 };

async function initMap(): Promise<void> {
  // Request needed libraries.
  await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
  await google.maps.importLibrary("places") as google.maps.PlacesLibrary;

  // Hide the map type control.
  map.innerMap.setOptions({mapTypeControl: false});

  // Function to update map and marker based on place details
  const updateMapAndMarker = () => {
    if (placeDetails.place && placeDetails.place.location) {
      let adjustedCenter = offsetLatLngRight(placeDetails.place.location, -0.005);
      map.innerMap.panTo(adjustedCenter);
      map.innerMap.setZoom(16); // Set zoom after panning if needed
      marker.position = placeDetails.place.location;
      marker.collisionBehavior = google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL;
      marker.style.display = 'block';
    }
  };

  // Set up map once widget is loaded.
  placeDetails.addEventListener('gmp-load', (event) => {
    updateMapAndMarker();
  });

  /* [START maps_ui_kit_place_details_event] */
  // Add an event listener to handle clicks.
  map.innerMap.addListener('click', async (event) => {
    marker.position = null;
    event.stop();
    if (event.placeId) {
      // Fire when the user clicks a POI.
      placeDetailsRequest.place = event.placeId;
      updateMapAndMarker();
    } else {
      // Fire when the user clicks the map (not on a POI).
      console.log('No place was selected.');
      marker.style.display = 'none';
    }
  });
}
/* [END maps_ui_kit_place_details_event] */

// Helper function to offset marker placement for better visual appearance.
function offsetLatLngRight(latLng, longitudeOffset) {
  const newLng = latLng.lng() + longitudeOffset;
  return new google.maps.LatLng(latLng.lat(), newLng);
}

initMap();
/* [END maps_ui_kit_place_details] */
