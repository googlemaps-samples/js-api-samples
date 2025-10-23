"use strict";
/*
* @license
* Copyright 2025 Google LLC. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
//@ts-nocheck
// [START maps_3d_places]
let map3DElement = null;
async function init() {
    const { Map3DElement } = await google.maps.importLibrary("maps3d");
    { }
    map3DElement = new Map3DElement({
        center: { lat: 51.532, lng: -0.124, altitude: 30 },
        range: 1400,
        tilt: 64,
        heading: -5,
        mode: 'HYBRID',
        gestureHandling: "COOPERATIVE"
    });
    document.body.append(map3DElement);
    map3DElement.addEventListener('gmp-click', async (event) => {
        event.preventDefault();
        if (event.placeId) {
            const place = await event.fetchPlace();
            await place.fetchFields({ fields: ['*'] });
            // Display place details.
            document.getElementById("placeName").innerHTML = "<b>Name :</b><br>&nbsp;" + place.displayName;
            document.getElementById("placeId").innerHTML = "<b>Id :</b><br>&nbsp;" + place.id;
            document.getElementById("placeType").innerHTML = "<b>Types :<b/>";
            for (const type of place.types) {
                document.getElementById("placeType").innerHTML += "<br>&nbsp;" + type;
            }
            document.getElementById("details").style.display = "block";
        }
    });
}
init();
// [END maps_3d_places]
