/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_web_components_events]
// This example adds a map using web components.
async function initMap(): Promise<void> {
  await google.maps.importLibrary("maps");
  await google.maps.importLibrary("marker");

  console.log('Maps JavaScript API loaded.');

  const advancedMarkers = document.querySelectorAll("#marker-click-event-example gmp-advanced-marker");
  
  for (const markerElement of advancedMarkers) {
    const advancedMarker = markerElement as google.maps.marker.AdvancedMarkerElement;

    customElements.whenDefined(advancedMarker.localName).then(async () => {
      advancedMarker.addEventListener('gmp-click', () => {
        const infoWindow = new google.maps.InfoWindow({
          content: advancedMarker.title,
        });

        infoWindow.open({
          anchor: advancedMarker,
        });
      });
    });
  }
}

initMap();
// [END maps_web_components_events]
