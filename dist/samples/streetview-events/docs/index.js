'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_streetview_events]
async function init() {
    // Request needed libraries.
    const { StreetViewPanorama } =
        await google.maps.importLibrary('streetView');

    const panoElement = document.getElementById('pano');
    const panoCell = document.getElementById('pano-cell');
    const linksTable = document.getElementById('links_table');
    const positionCell = document.getElementById('position-cell');
    const headingCell = document.getElementById('heading-cell');
    const pitchCell = document.getElementById('pitch-cell');

    const panorama = new StreetViewPanorama(panoElement, {
        position: { lat: 37.869, lng: -122.255 },
        pov: {
            heading: 165,
            pitch: 0,
        },
        visible: true,
    });

    panorama.addListener('pano_changed', () => {
        panoCell.textContent = panorama.getPano();
    });

    panorama.addListener('links_changed', () => {
        linksTable.replaceChildren();

        const links = panorama.getLinks();
        if (!links) {
            return;
        }

        links.forEach((link, index) => {
            if (!link) {
                return;
            }

            const row = document.createElement('tr');

            const labelCell = document.createElement('td');
            const labelStrong = document.createElement('b');
            labelStrong.textContent = `Link: ${String(index)}`;
            labelCell.appendChild(labelStrong);

            const valueCell = document.createElement('td');
            valueCell.textContent = link.description ?? '';

            row.appendChild(labelCell);
            row.appendChild(valueCell);
            linksTable.appendChild(row);
        });
    });

    panorama.addListener('position_changed', () => {
        const position = panorama.getPosition();
        positionCell.textContent = position ? position.toString() : '';
    });

    panorama.addListener('pov_changed', () => {
        const pov = panorama.getPov();
        headingCell.textContent = String(pov.heading);
        pitchCell.textContent = String(pov.pitch);
    });
}

void init();
// [END maps_streetview_events]
