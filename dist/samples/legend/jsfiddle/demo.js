'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function init() {
    const [{ AdvancedMarkerElement, PinElement }, { event }] =
        await Promise.all([
            google.maps.importLibrary('marker'),
            google.maps.importLibrary('core'),
            google.maps.importLibrary('maps'),
        ]);

    const mapElement = document.querySelector('gmp-map');
    const innerMap = mapElement.innerMap;

    // Wait for the map to load before building the legend.
    event.addListenerOnce(innerMap, 'idle', () => {
        makeLegend(PinElement);
    });

    const parkingSvg = `<svg fill="white" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z"/></svg>`;
    const librarySvg = `<svg fill="white" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.19 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"/></svg>`;
    const infoSvg = `<svg fill="white" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`;

    const icons = {
        parking: {
            name: 'Parking',
            icon: parkingSvg,
            color: '#1E88E5', // Blue
        },
        library: {
            name: 'Library',
            icon: librarySvg,
            color: '#43A047', // Green
        },
        info: {
            name: 'Info',
            icon: infoSvg,
            color: '#E53935', // Red
        },
    };

    const features = [
        {
            position: { lat: -33.91721, lng: 151.2263 },
            type: 'info',
        },
        {
            position: { lat: -33.91539, lng: 151.2282 },
            type: 'info',
        },
        {
            position: { lat: -33.91747, lng: 151.22912 },
            type: 'info',
        },
        {
            position: { lat: -33.9191, lng: 151.22907 },
            type: 'info',
        },
        {
            position: { lat: -33.91725, lng: 151.23011 },
            type: 'info',
        },
        {
            position: { lat: -33.91872, lng: 151.23089 },
            type: 'info',
        },
        {
            position: { lat: -33.91784, lng: 151.23094 },
            type: 'info',
        },
        {
            position: { lat: -33.91682, lng: 151.23149 },
            type: 'info',
        },
        {
            position: { lat: -33.9179, lng: 151.23463 },
            type: 'info',
        },
        {
            position: { lat: -33.91666, lng: 151.23468 },
            type: 'info',
        },
        {
            position: { lat: -33.916988, lng: 151.23364 },
            type: 'info',
        },
        {
            position: { lat: -33.91662347903106, lng: 151.22879464019775 },
            type: 'parking',
        },
        {
            position: { lat: -33.916365282092855, lng: 151.22937399734496 },
            type: 'parking',
        },
        {
            position: { lat: -33.91665018901448, lng: 151.2282474695587 },
            type: 'parking',
        },
        {
            position: { lat: -33.919543720969806, lng: 151.23112279762267 },
            type: 'parking',
        },
        {
            position: { lat: -33.91608037421864, lng: 151.23288232673644 },
            type: 'parking',
        },
        {
            position: { lat: -33.91851096391805, lng: 151.2344058214569 },
            type: 'parking',
        },
        {
            position: { lat: -33.91818154739766, lng: 151.2346203981781 },
            type: 'parking',
        },
        {
            position: { lat: -33.91727341958453, lng: 151.23348314155578 },
            type: 'library',
        },
    ];

    for (const feature of features) {
        const iconData = icons[feature.type];

        const pin = new PinElement({
            background: iconData.color,
            borderColor: iconData.color,
            glyphSrc: new URL(
                `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(iconData.icon)}`
            ),
            scale: 1.5,
        });

        const marker = new AdvancedMarkerElement({
            position: feature.position,
            title: iconData.name,
        });

        marker.append(pin);
        mapElement.append(marker);
    }
}

function makeLegend(PinElementClass) {
    const parkingSvg = `<svg fill="white" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z"/></svg>`;
    const librarySvg = `<svg fill="white" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.19 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"/></svg>`;
    const infoSvg = `<svg fill="white" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`;

    const icons = {
        parking: {
            name: 'Parking',
            icon: parkingSvg,
            color: '#1E88E5',
        },
        library: {
            name: 'Library',
            icon: librarySvg,
            color: '#43A047',
        },
        info: {
            name: 'Info',
            icon: infoSvg,
            color: '#E53935',
        },
    };

    const legend = document.getElementById('legend');

    const title = document.createElement('div');
    title.innerText = 'Legend';
    title.classList.add('title');
    legend.appendChild(title);

    for (const key in icons) {
        const type = icons[key];

        const wrapper = document.createElement('div');
        wrapper.classList.add('legend-item');

        const pin = new PinElementClass({
            background: type.color,
            borderColor: type.color,
            glyphSrc: new URL(
                `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(type.icon)}`
            ),
            scale: 1.0,
        });

        // PinElement extends HTMLElement directly, so we can append it directly!
        const pinContainer = document.createElement('div');
        pinContainer.classList.add('legend-icon');
        pinContainer.appendChild(pin);

        const txt = document.createElement('div');
        txt.classList.add('legend-text');
        txt.innerText = type.name;

        wrapper.appendChild(pinContainer);
        wrapper.appendChild(txt);
        legend.appendChild(wrapper);
    }
}

void init();
