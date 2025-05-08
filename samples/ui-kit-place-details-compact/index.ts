/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_place_details_compact] */
// Use querySelector to select elements for interaction.
const map = document.querySelector('gmp-map') as google.maps.MapElement;
//@ts-ignore
const marker = document.querySelector('gmp-advanced-marker') as any;

async function initMap(): Promise<void> {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
  await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
  // Hide the map type control.
  map.innerMap.setOptions({ mapTypeControl: false });
  // Set marker collision behavior.
  marker.collisionBehavior = google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL;
  // Add marker to place location.
  marker.position = { lat: 47.75972, lng: -122.25094 };
}
initMap();
/* [END maps_ui_kit_place_details_compact] */
