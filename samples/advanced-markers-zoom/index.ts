/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_advanced_markers_zoom]
const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;
let innerMap;

async function initMap() {
  // Request needed libraries.
  const { Map } = (await google.maps.importLibrary(
    "maps"
  )) as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = (await google.maps.importLibrary(
    "marker"
  )) as google.maps.MarkerLibrary;

  innerMap = mapElement.innerMap;

  const marker01 = new AdvancedMarkerElement({
    map: innerMap,
    position: { lat: 37.4239163, lng: -122.094 },
    title: "This marker is visible at zoom level 15 and higher.",
  });

  const marker02 = new AdvancedMarkerElement({
    map: innerMap,
    position: { lat: 37.4245, lng: -122.096 },
    title: "This marker is visible at zoom level 16 and higher.",
  });

  const marker03 = new AdvancedMarkerElement({
    map: innerMap,
    position: { lat: 37.4249, lng: -122.095 },
    title: "This marker is visible at zoom level 17 and higher.",
  });

  const marker04 = new AdvancedMarkerElement({
    map: innerMap,
    position: { lat: 37.425, lng: -122.0955 },
    title: "This marker is visible at zoom level 18 and higher.",
  });
  // [START maps_advanced_markers_zoom_listener]
  innerMap.addListener("zoom_changed", () => {
    const zoom = innerMap.getZoom();
    if (zoom) {
      // Only show each marker above a certain zoom level.
      marker01.map = zoom > 14 ? innerMap : null;
      marker02.map = zoom > 15 ? innerMap : null;
      marker03.map = zoom > 16 ? innerMap : null;
      marker04.map = zoom > 17 ? innerMap : null;
    }
  });
  // [END maps_advanced_markers_zoom_listener]
}

initMap();
// [END maps_advanced_markers_zoom]
