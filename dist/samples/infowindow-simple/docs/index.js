"use strict";
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_infowindow_simple]
// This example displays a marker at the center of Australia.
// When the user clicks the marker, an info window opens.
async function initMap() {
    await google.maps.importLibrary("maps");
    await google.maps.importLibrary("marker");
    const uluru = { lat: -25.363, lng: 131.044 };
    const mapElement = document.querySelector('gmp-map');
    const innerMap = mapElement.innerMap;
    const heading = document.createElement("h1");
    heading.textContent = "Uluru (Ayers Rock)";
    const content = document.createElement("div");
    const p1 = document.createElement("p");
    p1.textContent = "Uluru, also referred to as Ayers Rock, is a large sandstone rock formation in the southern part of the Northern Territory, central Australia. It lies 335 km (208 mi) south west of the nearest large town, Alice Springs; 450 km (280 mi) by road. Kata Tjuta and Uluru are the two major features of the Uluru - Kata Tjuta National Park. Uluru is sacred to the Pitjantjatjara and Yankunytjatjara, the Aboriginal people of the area. It has many springs, waterholes, rock caves and ancient paintings. Uluru is listed as a World Heritage Site.";
    content.appendChild(p1);
    const a = document.createElement("a");
    a.href = "https://en.wikipedia.org/w/index.php?title=Uluru";
    a.textContent = "https://en.wikipedia.org/w/index.php?title=Uluru";
    a.target = "_blank";
    content.appendChild(a);
    const infowindow = new google.maps.InfoWindow({
        headerContent: heading,
        content: content,
        ariaLabel: "Uluru",
        maxWidth: 500, // Set max width (optional).
    });
    const marker = new google.maps.marker.AdvancedMarkerElement({
        position: uluru,
        map: innerMap,
        title: "Uluru (Ayers Rock)",
        gmpClickable: true,
    });
    marker.addEventListener("gmp-click", () => {
        infowindow.open({
            anchor: marker,
            map: innerMap,
        });
    });
}
initMap();
// [END maps_infowindow_simple]
