/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_control_options]
// You can set control options to change the default position or style of many
// of the map controls.

async function initMap() {
    //  Request the needed libraries.
    await google.maps.importLibrary('maps');

    const mapElement = document.querySelector(
        'gmp-map'
    ) as google.maps.MapElement;

    const innerMap = mapElement.innerMap;

    // [START maps_control_options_change_default]
    innerMap.setOptions({
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: [
                google.maps.MapTypeId.ROADMAP,
                google.maps.MapTypeId.TERRAIN,
            ],
            position: google.maps.ControlPosition.TOP_CENTER,
        },
    });
    // [END maps_control_options_change_default]
}

initMap();
// [END maps_control_options]
