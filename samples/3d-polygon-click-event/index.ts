/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// @ts-nocheck
// [START maps_3d_polygon_click_event]
async function init() {
    const { Map3DElement, MapMode, Polygon3DInteractiveElement } =
        await google.maps.importLibrary('maps3d')

    const map = new Map3DElement({
        center: { lat: 40.6842, lng: -74.0019, altitude: 1000 },
        heading: 340,
        tilt: 70,
        mode: MapMode.HYBRID,
        gestureHandling: 'COOPERATIVE',
    })

    document.body.append(map)

    const polygonOptions = {
        strokeColor: '#0000ff80',
        strokeWidth: 8,
        fillColor: '#ff000080',
        drawsOccludedSegments: false,
    }

    const examplePolygon = new google.maps.maps3d.Polygon3DInteractiveElement(
        polygonOptions
    )

    examplePolygon.path = [
        { lat: 40.7144, lng: -74.0208 },
        { lat: 40.6993, lng: -74.019 },
        { lat: 40.7035, lng: -74.0004 },
        { lat: 40.7144, lng: -74.0208 },
    ]

    examplePolygon.addEventListener('gmp-click', (event) => {
        // change the color of the polygon stroke and fill colors to a random alternatives!
        event.target.fillColor = randomizeHexColor(event.target.fillColor)
        event.target.strokeColor = randomizeHexColor(event.target.fillColor)
        console.log(event)
    })

    map.append(examplePolygon)
}

function randomizeHexColor(originalHexColor) {
    console.log(originalHexColor)
    let alpha = ''
    alpha = originalHexColor.substring(7)

    // Generate random values for Red, Green, Blue (0-255)
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)

    console.log(r + ' ' + g + ' ' + b)

    // Convert decimal to 2-digit hex, padding with '0' if needed
    const rHex = ('0' + r.toString(16)).slice(-2)
    const gHex = ('0' + g.toString(16)).slice(-2)
    const bHex = ('0' + b.toString(16)).slice(-2)

    // Combine parts: '#' + random RGB + original Alpha (if any)
    return `#${rHex}${gHex}${bHex}${alpha}`
}

init()
// [END maps_3d_polygon_click_event]
