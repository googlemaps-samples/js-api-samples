/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_3d_marker_customization]
async function init() {
    const [{ Map3DElement, Marker3DElement }, { PinElement }] =
        await Promise.all([
            google.maps.importLibrary('maps3d'),
            google.maps.importLibrary('marker'),
        ]);

    const map = new Map3DElement({
        center: { lat: 37.4176, lng: -122.02, altitude: 0 },
        tilt: 67.5,
        range: 7000,
        mode: 'HYBRID',
        gestureHandling: 'COOPERATIVE',
    });

    map.mode = 'SATELLITE';

    // [START maps_3d_marker_customization_pin_border]
    // Change the border color.
    const pinBorder = new PinElement({
        borderColor: '#FFFFFF',
    });
    const markerWithBorder = new Marker3DElement({
        position: { lat: 37.415, lng: -122.035 },
    });
    markerWithBorder.append(pinBorder);
    // [END maps_3d_marker_customization_pin_border]

    // Add a label.
    const markerWithLabel = new Marker3DElement({
        position: { lat: 37.419, lng: -122.03 },
        label: 'Simple label',
    });

    // [START maps_3d_marker_customization_scale]
    // Adjust the scale.
    const pinScaled = new PinElement({
        scale: 1.5,
    });
    const markerWithScale = new Marker3DElement({
        position: { lat: 37.419, lng: -122.02 },
    });
    markerWithScale.append(pinScaled);
    // [END maps_3d_marker_customization_scale]

    // [START maps_3d_marker_customization_glyph_color]
    // Change the glyph color.
    const pinGlyph = new PinElement({
        glyphColor: 'white',
    });
    const markerWithGlyphColor = new Marker3DElement({
        position: { lat: 37.415, lng: -122.025 },
    });
    markerWithGlyphColor.append(pinGlyph);
    // [END maps_3d_marker_customization_glyph_color]

    // [START maps_3d_marker_customization_glyph_text]
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
    // [END maps_3d_marker_customization_glyph_text]

    // [START maps_3d_marker_customization_extruded]
    // Change a marker's altitude and add an extrusion.
    const extrudedMarker = new Marker3DElement({
        position: { lat: 37.4239163, lng: -122.0947209, altitude: 100 },
        altitudeMode: 'RELATIVE_TO_GROUND',
        extruded: true,
    });
    // [END maps_3d_marker_customization_extruded]

    // Hide the glyph.
    const pinNoGlyph = new PinElement({
        glyphText: '',
    });
    const markerWithNoGlyph = new Marker3DElement({
        position: { lat: 37.415, lng: -122.005 },
    });
    markerWithNoGlyph.append(pinNoGlyph);
    // [START maps_3d_marker_customization_background]
    // Change the background color.
    const pinBackground = new PinElement({
        background: '#FBBC04',
    });

    const markerWithBackground = new Marker3DElement({
        position: { lat: 37.419, lng: -122.01 },
    });
    markerWithBackground.append(pinBackground);
    // [END maps_3d_marker_customization_background]

    map.append(markerWithLabel);
    map.append(markerWithScale);
    map.append(markerWithBackground);
    map.append(markerWithBorder);
    map.append(markerWithGlyphColor);
    map.append(markerWithGlyphText);
    map.append(markerWithNoGlyph);
    map.append(extrudedMarker);

    document.body.append(map);
}

void init();
// [END maps_3d_marker_customization]
