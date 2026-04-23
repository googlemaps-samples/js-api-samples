/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_3d_camera_position]
async function initMap(): Promise<void> {
    // Declare the needed libraries.
    await google.maps.importLibrary('maps3d');

    // prettier-ignore
    // @ts-ignore
    const map3DElement = document.querySelector('gmp-map-3d') as google.maps.Map3DElement;

    // Elements from HTML
    const headingSlider = document.getElementById(
        'heading'
    ) as HTMLInputElement;
    const tiltSlider = document.getElementById('tilt') as HTMLInputElement;
    const rangeSlider = document.getElementById('range') as HTMLInputElement;
    const latSlider = document.getElementById('lat') as HTMLInputElement;
    const lngSlider = document.getElementById('lng') as HTMLInputElement;
    const altitudeSlider = document.getElementById(
        'altitude'
    ) as HTMLInputElement;
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
        const heading = map3DElement.heading.toFixed(0);
        const tilt = map3DElement.tilt.toFixed(0);
        const range = map3DElement.range.toFixed(0);
        const rawFov = parseFloat(map3DElement.fov.toFixed(0));
        const fovClamped = Math.min(80, Math.max(5, rawFov));
        const fov = fovClamped.toString();
        const roll = map3DElement.roll ? map3DElement.roll.toFixed(0) : '0';
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
        navigator.clipboard.writeText(codeElem.textContent || '');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy HTML';
        }, 2000);
    });

    // Listen to slider changes.
    const handleSliderInput = (e: Event, prop: string) => {
        isUserInteracting = true;
        const val = parseFloat((e.target as HTMLInputElement).value);
        map3DElement[prop] = val;
        updateUI();
    };

    const resetInteraction = () => {
        isUserInteracting = false;
    };

    headingSlider.addEventListener('input', (e) =>
        handleSliderInput(e, 'heading')
    );
    headingSlider.addEventListener('change', resetInteraction);

    tiltSlider.addEventListener('input', (e) => handleSliderInput(e, 'tilt'));
    tiltSlider.addEventListener('change', resetInteraction);

    rangeSlider.addEventListener('input', (e) => handleSliderInput(e, 'range'));
    rangeSlider.addEventListener('change', resetInteraction);

    fovSlider.addEventListener('input', (e) => handleSliderInput(e, 'fov'));
    fovSlider.addEventListener('change', resetInteraction);

    rollSlider.addEventListener('input', (e) => handleSliderInput(e, 'roll'));
    rollSlider.addEventListener('change', resetInteraction);

    latSlider.addEventListener('input', (e) => {
        const val = parseFloat((e.target as HTMLInputElement).value);
        const currentCenter = map3DElement.center;
        map3DElement.center = {
            lat: val,
            lng: currentCenter.lng,
            altitude: currentCenter.altitude,
        };
        updateUI();
    });

    lngSlider.addEventListener('input', (e) => {
        const val = parseFloat((e.target as HTMLInputElement).value);
        const currentCenter = map3DElement.center;
        map3DElement.center = {
            lat: currentCenter.lat,
            lng: val,
            altitude: currentCenter.altitude,
        };
        updateUI();
    });

    altitudeSlider.addEventListener('input', (e) => {
        const val = parseFloat((e.target as HTMLInputElement).value);
        currentAltitude = val;
        const currentCenter = map3DElement.center;
        map3DElement.center = {
            lat: currentCenter.lat,
            lng: currentCenter.lng,
            altitude: val,
        };
        updateUI();
    });

    // Update UI on camera change events.
    map3DElement.addEventListener('gmp-animationend', updateUI);
    map3DElement.addEventListener('gmp-click', updateUI);
    map3DElement.addEventListener('gmp-centerchange', updateUI);
    map3DElement.addEventListener('gmp-headingchange', updateUI);
    map3DElement.addEventListener('gmp-tiltchange', updateUI);
    map3DElement.addEventListener('gmp-rangechange', updateUI);
    map3DElement.addEventListener('gmp-fovchange', updateUI);

    // Initial UI sync
    setTimeout(updateUI, 500);
}

initMap();
// [END maps_3d_camera_position]
