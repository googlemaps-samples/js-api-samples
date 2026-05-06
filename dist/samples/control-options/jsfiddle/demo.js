'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// You can set control options to change the default position or style of many
// of the map controls.

async function initMap() {
    //  Request the needed libraries.
    const [{ MapTypeControlStyle, MapTypeId }, { ControlPosition }] =
        await Promise.all([
            google.maps.importLibrary('maps'),
            google.maps.importLibrary('core'),
        ]);

    const mapElement = document.querySelector('gmp-map');

    const innerMap = mapElement.innerMap;

    innerMap.setOptions({
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: [MapTypeId.ROADMAP, MapTypeId.TERRAIN],
            position: ControlPosition.TOP_CENTER,
        },
    });
}

void initMap();
