/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// @ts-nocheck
// [START maps_3d_marker_customization]
async function init() {
    const { Map3DElement, Marker3DElement } =
        await google.maps.importLibrary('maps3d')
    const { PinElement } = await google.maps.importLibrary('marker')

    const map = new Map3DElement({
        center: { lat: 37.4176, lng: -122.02, altitude: 0 },
        tilt: 67.5,
        range: 7000,
        mode: 'HYBRID',
    })

    map.mode = 'SATELLITE'

    // Change the border color.
    const pinBorder = new PinElement({
        borderColor: '#FFFFFF',
    })
    const markerWithBorder = new Marker3DElement({
        position: { lat: 37.415, lng: -122.035 },
    })
    markerWithBorder.append(pinBorder)

    // Add a label.
    const markerWithLabel = new Marker3DElement({
        position: { lat: 37.419, lng: -122.03 },
        label: 'Simple label',
    })

    // Adjust the scale.
    const pinScaled = new PinElement({
        scale: 1.5,
    })
    const markerWithScale = new Marker3DElement({
        position: { lat: 37.419, lng: -122.02 },
    })
    markerWithScale.append(pinScaled)

    // Change the glyph color.
    const pinGlyph = new PinElement({
        glyphColor: 'white',
    })
    const markerWithGlyphColor = new Marker3DElement({
        position: { lat: 37.415, lng: -122.025 },
    })
    markerWithGlyphColor.append(pinGlyph)

    // Change many elements together and extrude marker.
    const pinTextGlyph = new PinElement({
        background: '#F0F6FC',
        glyph: 'E',
        glyphColor: 'red',
        borderColor: '#0000FF',
    })
    const markerWithGlyphText = new Marker3DElement({
        position: { lat: 37.415, lng: -122.015, altitude: 50 },
        extruded: true,
        altitudeMode: 'RELATIVE_TO_GROUND',
    })
    markerWithGlyphText.append(pinTextGlyph)

    // Hide the glyph.
    const pinNoGlyph = new PinElement({
        glyph: '',
    })
    const markerWithNoGlyph = new Marker3DElement({
        position: { lat: 37.415, lng: -122.005 },
    })
    markerWithNoGlyph.append(pinNoGlyph)

    // Change the background color.
    const pinBackground = new PinElement({
        background: '#FBBC04',
    })

    const markerWithBackground = new Marker3DElement({
        position: { lat: 37.419, lng: -122.01 },
    })
    markerWithBackground.append(pinBackground)

    map.append(markerWithLabel)
    map.append(markerWithScale)
    map.append(markerWithBackground)
    map.append(markerWithBorder)
    map.append(markerWithGlyphColor)
    map.append(markerWithGlyphText)
    map.append(markerWithNoGlyph)

    document.body.append(map)
}

init()
// [END maps_3d_marker_customization]
