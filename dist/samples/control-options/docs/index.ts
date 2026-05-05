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
    const { MapTypeControlStyle, MapTypeId } =
        await google.maps.importLibrary('maps');
    const { ControlPosition } = await google.maps.importLibrary('core');

    const mapElement = document.querySelector('gmp-map')!;

    const innerMap = mapElement.innerMap;

    // [START maps_control_options_change_default]
    innerMap.setOptions({
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: [MapTypeId.ROADMAP, MapTypeId.TERRAIN],
            position: ControlPosition.TOP_CENTER,
        },
    });
    // [END maps_control_options_change_default]
}

initMap();
// [END maps_control_options]
