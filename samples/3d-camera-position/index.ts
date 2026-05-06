/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_3d_camera_position]
async function initMap(): Promise<void> {
    // Declare the needed libraries.
    await google.maps.importLibrary('maps3d');

    const map3DElement = document.querySelector('gmp-map-3d')!;

    // Elements from HTML
    const headingSlider = document.getElementById(
        'heading'
    ) as HTMLInputElement;
    const tiltSlider = document.getElementById('tilt') as HTMLInputElement;
    const rangeSlider = document.getElementById('range') as HTMLInputElement;
    const latSlider = document.getElementById('lat') as HTMLInputElement;
    const lngSlider = document.getElementById('lng') as HTMLInputElement;
    const fovSlider = document.getElementById('fov') as HTMLInputElement;
    const rollSlider = document.getElementById('roll') as HTMLInputElement;

    const headingVal = document.getElementById('heading-val') as HTMLElement;
    const tiltVal = document.getElementById('tilt-val') as HTMLElement;
    const rangeVal = document.getElementById('range-val') as HTMLElement;
    const altitudeVal = document.getElementById('altitude-val') as HTMLElement;
    const fovVal = document.getElementById('fov-val') as HTMLElement;
    const rollVal = document.getElementById('roll-val') as HTMLElement;
    const codeElem = document.getElementById('generated-code') as HTMLElement;
    const copyBtn = document.getElementById('copy-btn') as HTMLButtonElement;

    let currentAltitude = 30;
    let isUserInteracting = false;

    // Update values on UI when the map changes.
    const updateUI = () => {
        const heading = map3DElement.heading?.toFixed(0) ?? '0';
        const tilt = map3DElement.tilt?.toFixed(0) ?? '0';
        const range = map3DElement.range?.toFixed(0) ?? '0';
        const rawFov = map3DElement.fov?.toFixed(0) ?? 45;
        const fovClamped = Math.min(80, Math.max(5, rawFov));
        const fov = fovClamped.toString();
        const roll = map3DElement.roll?.toFixed(0) ?? '0';
        const center = map3DElement.center;
        const mode = map3DElement.mode;

        headingVal.textContent = heading;
        tiltVal.textContent = tilt;
        rangeVal.textContent = range;
        fovVal.textContent = fov;
        rollVal.textContent = roll;

        if (!isUserInteracting) {
            fovSlider.value = fov;
            headingSlider.value = heading;
            tiltSlider.value = tilt;
            rangeSlider.value = Math.min(10000, parseFloat(range)).toString();
            rollSlider.value = roll;
        }

        if (center) {
            const lat = center.lat.toFixed(4);
            const lng = center.lng.toFixed(4);
            const alt = currentAltitude.toFixed(0);

            latSlider.value = lat;
            lngSlider.value = lng;
            altitudeVal.textContent = alt;

            codeElem.textContent = `<gmp-map-3d center="${lat},${lng},${alt}" mode="${mode}" tilt="${tilt}" range="${range}" heading="${heading}" fov="${fov}" roll="${roll}"></gmp-map-3d>`;
        }
    };

    // Copy generated HTML to clipboard.
    copyBtn.addEventListener('click', () => {
        void navigator.clipboard.writeText(codeElem.textContent || '');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy HTML';
        }, 2000);
    });

    // Listen to slider changes using event delegation.
    const panel = document.querySelector('.panel') as HTMLElement;

    panel.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        if (target.tagName !== 'INPUT') return;

        isUserInteracting = true;
        const prop = target.name;
        const val = parseFloat(target.value);

        if (prop === 'lat') {
            const currentCenter = map3DElement.center;
            map3DElement.center = {
                lat: val,
                lng: currentCenter.lng,
                altitude: currentCenter.altitude,
            };
        } else if (prop === 'lng') {
            const currentCenter = map3DElement.center;
            map3DElement.center = {
                lat: currentCenter.lat,
                lng: val,
                altitude: currentCenter.altitude,
            };
        } else if (prop === 'altitude') {
            currentAltitude = val;
            const currentCenter = map3DElement.center;
            map3DElement.center = {
                lat: currentCenter.lat,
                lng: currentCenter.lng,
                altitude: val,
            };
        } else {
            map3DElement[prop] = val;
        }
        updateUI();
    });

    panel.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        if (target.tagName === 'INPUT') {
            isUserInteracting = false;
        }
    });

    // Update UI on camera change events.
    map3DElement.addEventListener('gmp-headingchange', updateUI);
    map3DElement.addEventListener('gmp-tiltchange', updateUI);
    map3DElement.addEventListener('gmp-rangechange', updateUI);
    map3DElement.addEventListener('gmp-fovchange', updateUI);

    // Initial UI sync
    setTimeout(updateUI, 500);
}

void initMap();
// [END maps_3d_camera_position]
