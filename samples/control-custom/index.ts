/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_control_custom]

const chicago = { lat: 41.85, lng: -87.65 };

//Get the gmp-map element
const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;

async function initMap() {
    const { Map } = (await google.maps.importLibrary(
        'maps'
    )) as typeof google.maps;
    
  // Get the inner map.
  const innerMap = mapElement.innerMap;

  // Get the button element from the HTML
  const centerButton = document.getElementById('btnCenterMap') as HTMLButtonElement;
  // Move the event listener here
  centerButton.addEventListener('click', () => {
    innerMap.setCenter(chicago);
  });
}

initMap();
//[END maps_control_custom]
