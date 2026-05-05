/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// TMP EMPTY LINE
// [START maps_3d_marker_customization]
async function init() {
    const { Map3DElement, Marker3DElement } =
        await google.maps.importLibrary('maps3d');
    const { PinElement } = await google.maps.importLibrary('marker');
    // TMP EMPTY LINE
    const map = new Map3DElement({
        center: { lat: 37.4176, lng: -122.02, altitude: 0 },
        tilt: 67.5,
        range: 7000,
        mode: 'HYBRID',
        gestureHandling: 'COOPERATIVE',
    });
    // TMP EMPTY LINE
    map.mode = 'SATELLITE';
    // TMP EMPTY LINE
    // Change the border color.
    const pinBorder = new PinElement({
        borderColor: '#FFFFFF',
    });
    const markerWithBorder = new Marker3DElement({
        position: { lat: 37.415, lng: -122.035 },
    });
    markerWithBorder.append(pinBorder);
    // TMP EMPTY LINE
    // Add a label.
    const markerWithLabel = new Marker3DElement({
        position: { lat: 37.419, lng: -122.03 },
        label: 'Simple label',
    });
    // TMP EMPTY LINE
    // Adjust the scale.
    const pinScaled = new PinElement({
        scale: 1.5,
    });
    const markerWithScale = new Marker3DElement({
        position: { lat: 37.419, lng: -122.02 },
    });
    markerWithScale.append(pinScaled);
    // TMP EMPTY LINE
    // Change the glyph color.
    const pinGlyph = new PinElement({
        glyphColor: 'white',
    });
    const markerWithGlyphColor = new Marker3DElement({
        position: { lat: 37.415, lng: -122.025 },
    });
    markerWithGlyphColor.append(pinGlyph);
    // TMP EMPTY LINE
    // Change many elements together and extrude marker.
    const pinTextGlyph = new PinElement({
        background: '#F0F6FC',
        glyphText: 'E',
        glyphColor: 'red',
        borderColor: '#0000FF',
    });
    const markerWithGlyphText = new Marker3DElement({
        position: { lat: 37.415, lng: -122.015, altitude: 50 },
        extruded: true,
        altitudeMode: 'RELATIVE_TO_GROUND',
    });
    markerWithGlyphText.append(pinTextGlyph);
    // TMP EMPTY LINE
    // Hide the glyph.
    const pinNoGlyph = new PinElement({
        glyphText: '',
    });
    const markerWithNoGlyph = new Marker3DElement({
        position: { lat: 37.415, lng: -122.005 },
    });
    markerWithNoGlyph.append(pinNoGlyph);
    // TMP EMPTY LINE
    // Change the background color.
    const pinBackground = new PinElement({
        background: '#FBBC04',
    });
    // TMP EMPTY LINE
    const markerWithBackground = new Marker3DElement({
        position: { lat: 37.419, lng: -122.01 },
    });
    markerWithBackground.append(pinBackground);
    // TMP EMPTY LINE
    map.append(markerWithLabel);
    map.append(markerWithScale);
    map.append(markerWithBackground);
    map.append(markerWithBorder);
    map.append(markerWithGlyphColor);
    map.append(markerWithGlyphText);
    map.append(markerWithNoGlyph);
    // TMP EMPTY LINE
    document.body.append(map);
}
// TMP EMPTY LINE
init();
// [END maps_3d_marker_customization]
