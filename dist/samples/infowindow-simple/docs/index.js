'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_infowindow_simple]
// This example displays a marker at the center of Australia.
// When the user clicks the marker, an info window opens.

async function init() {
    // Import the needed libraries.
    const [{ InfoWindow }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('marker'),
    ]);

    // Get the map element and the inner map from it.
    const mapElement = document.querySelector('gmp-map');
    const innerMap = mapElement.innerMap;

    // Get the center of the map.
    const center = mapElement.center;

    // Create the info window content.
    const heading = document.createElement('h1');
    heading.textContent = 'Uluru (Ayers Rock)';

    const content = document.createElement('div');

    const infoParagraph = document.createElement('p');
    infoParagraph.textContent = `Uluru, also referred to as Ayers Rock, is a large sandstone rock formation 
  in the southern part of the Northern Territory, central Australia. It lies
  335 km (208 mi) south west of the nearest large town, Alice Springs; 450 km 
  (280 mi) by road. Kata Tjuta and Uluru are the two major features of the 
  Uluru - Kata Tjuta National Park. Uluru is sacred to the Pitjantjatjara and 
  Yankunytjatjara, the Aboriginal people of the area. It has many springs, 
  waterholes, rock caves and ancient paintings. Uluru is listed as a World 
  Heritage Site.`;

    content.appendChild(infoParagraph);

    const link = document.createElement('a');
    link.href = 'https://en.wikipedia.org/w/index.php?title=Uluru';
    link.textContent = 'https://en.wikipedia.org/w/index.php?title=Uluru';
    link.target = '_blank';
    content.appendChild(link);

    // Create the info window.
    const infoWindow = new InfoWindow({
        headerContent: heading,
        content,
        ariaLabel: 'Uluru',
        maxWidth: 500, // Set max width (optional).
    });

    // Create the marker.
    const marker = new AdvancedMarkerElement({
        position: center,
        map: innerMap,
        title: 'Uluru (Ayers Rock)',
        gmpClickable: true,
    });

    // Open the info window when the map loads.
    infoWindow.open({
        anchor: marker,
        map: innerMap,
    });

    // Open the info window when the marker is clicked.
    marker.addEventListener('gmp-click', () => {
        infoWindow.open({
            anchor: marker,
            map: innerMap,
        });
    });
}

void init();
// [END maps_infowindow_simple]
