/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_legend]
async function init(): Promise<void> {
    await google.maps.importLibrary('maps');
    const { AdvancedMarkerElement, PinElement } =
        await google.maps.importLibrary('marker');

    const mapElement = document.querySelector('gmp-map')!;
    const innerMap = mapElement.innerMap;

    // Wait for the map to load before building the legend.
    google.maps.event.addListenerOnce(innerMap, 'idle', () => {
        makeLegend();
    });

    const icons: Record<string, { name: string; icon: string; color: string }> =
        {
            parking: {
                name: 'Parking',
                icon: 'local_parking',
                color: '#1E88E5', // Blue
            },
            library: {
                name: 'Library',
                icon: 'local_library',
                color: '#43A047', // Green
            },
            info: {
                name: 'Info',
                icon: 'info',
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

        // Create a span for the Material Icon
        const iconElement = document.createElement('span');
        iconElement.className = 'material-icons';
        iconElement.textContent = iconData.icon;
        iconElement.style.color = 'white';

        const pin = new PinElement({
            background: iconData.color,
            borderColor: iconData.color,
            glyph: iconElement,
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

function makeLegend() {
    const icons: Record<string, { name: string; icon: string; color: string }> =
        {
            parking: {
                name: 'Parking',
                icon: 'local_parking',
                color: '#1E88E5',
            },
            library: {
                name: 'Library',
                icon: 'local_library',
                color: '#43A047',
            },
            info: {
                name: 'Info',
                icon: 'info',
                color: '#E53935',
            },
        };

    const legend = document.getElementById('legend')!;

    const title = document.createElement('div');
    title.innerText = 'Legend';
    title.classList.add('title');
    legend.appendChild(title);

    for (const key in icons) {
        const type = icons[key];

        const wrapper = document.createElement('div');
        wrapper.classList.add('legend-item');

        const iconElement = document.createElement('span');
        iconElement.className = 'material-icons';
        iconElement.textContent = type.icon;
        iconElement.style.color = 'white';
        iconElement.style.fontSize = '18px'; // Slightly smaller to fit the scale 1.0 pin

        const pin = new google.maps.marker.PinElement({
            background: type.color,
            borderColor: type.color,
            glyph: iconElement,
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
// [END maps_legend]
