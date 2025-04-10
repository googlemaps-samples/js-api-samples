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
const marker = document.querySelector('gmp-advanced-marker') as any;
/* [END maps_ui_kit_place_details_query_selector] */

let center = { lat: 47.759737, lng: -122.250632 };

async function initMap(): Promise<void> {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
  const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;

  // Hide the map type control.
  map.innerMap.setOptions({mapTypeControl: false});

  // Set the default selection.
  const place = new Place({
    id: "ChIJC8HakaIRkFQRiOgkgdHmqkk",
    requestedLanguage: "en", // optional
  });
  await placeDetails.configureFromPlace(place);
  let adjustedCenter = offsetLatLngRight(placeDetails.place.location, -0.005);
  map.innerMap.panTo(adjustedCenter);
  map.innerMap.setZoom(16);
  marker.position = placeDetails.place.location;
  marker.style.display = 'block';
  marker.collisionBehavior = google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL;

  /* [START maps_ui_kit_place_details_event] */
  // Add an event listener to handle map clicks.
  map.innerMap.addListener('click', async (event) => {
    marker.position = null;
    event.stop();
    if (event.placeId) {
      // Fire when the user clicks a POI.
      await placeDetails.configureFromPlace({id: event.placeId});
    } else {
      // Fire when the user clicks the map (not on a POI).
      await placeDetails.configureFromLocation(event.latLng);
    }
    // Get the offset center.
    let adjustedCenter = offsetLatLngRight(placeDetails.place.location, -0.005);

    // Show the marker at the selected place.
    marker.position = placeDetails.place.location;
    marker.style.display = 'block';
    map.innerMap.panTo(adjustedCenter);
  });
}
/* [END maps_ui_kit_place_details_event] */

// Helper function to offset the map center.
function offsetLatLngRight(latLng, longitudeOffset) {
  const newLng = latLng.lng() + longitudeOffset;
  return new google.maps.LatLng(latLng.lat(), newLng);
}

initMap();
/* [END maps_ui_kit_place_details] */
