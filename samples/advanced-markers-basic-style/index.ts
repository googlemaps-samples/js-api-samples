/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_advanced_markers_basic_style]
const parser = new DOMParser();
const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;

async function initMap() {
    // Request needed libraries.
    const { Map } = (await google.maps.importLibrary(
        'maps'
    )) as google.maps.MapsLibrary;
    const { AdvancedMarkerElement, PinElement } =
        (await google.maps.importLibrary(
            'marker'
        )) as google.maps.MarkerLibrary;

    // Each PinElement is paired with a marker to demonstrate setting each parameter.

    // [START maps_advanced_markers_basic_style_title]
    // Default marker with title text (no PinElement).
    const markerWithText = new AdvancedMarkerElement({
        position: { lat: 37.419, lng: -122.03 },
        title: 'Title text for the marker at lat: 37.419, lng: -122.03',
    });
    mapElement.append(markerWithText);
    // [END maps_advanced_markers_basic_style_title]

    // [START maps_advanced_markers_basic_style_scale]
    // Adjust the scale.
    const pinScaled = new PinElement({
        scale: 1.5,
    });
    const markerScaled = new AdvancedMarkerElement({
        position: { lat: 37.419, lng: -122.02 },
    });
    markerScaled.append(pinScaled);
    mapElement.append(markerScaled);
    // [END maps_advanced_markers_basic_style_scale]

    // [START maps_advanced_markers_basic_style_background]
    // Change the background color.
    const pinBackground = new PinElement({
        background: '#FBBC04',
    });
    const markerBackground = new AdvancedMarkerElement({
        position: { lat: 37.419, lng: -122.01 },
    });
    markerBackground.append(pinBackground);
    mapElement.append(markerBackground);
    // [END maps_advanced_markers_basic_style_background]

    // [START maps_advanced_markers_basic_style_border]
    // Change the border color.
    const pinBorder = new PinElement({
        borderColor: '#137333',
    });
    const markerBorder = new AdvancedMarkerElement({
        position: { lat: 37.415, lng: -122.035 },
    });
    markerBorder.append(pinBorder);
    mapElement.append(markerBorder);
    // [END maps_advanced_markers_basic_style_border]

    // [START maps_advanced_markers_basic_style_glyph]
    // Change the glyph color.
    const pinGlyph = new PinElement({
        glyphColor: 'white',
    });
    const markerGlyph = new AdvancedMarkerElement({
        position: { lat: 37.415, lng: -122.025 },
    });
    markerGlyph.append(pinGlyph);
    mapElement.append(markerGlyph);
    // [END maps_advanced_markers_basic_style_glyph]

    // [START maps_advanced_markers_basic_style_text_glyph]
    const pinTextGlyph = new PinElement({
        //@ts-ignore
        glyphText: 'T',
        glyphColor: 'white',
    });
    const markerGlyphText = new AdvancedMarkerElement({
        position: { lat: 37.415, lng: -122.015 },
    });
    markerGlyphText.append(pinTextGlyph);
    mapElement.append(markerGlyphText);
    // [END maps_advanced_markers_basic_style_text_glyph]

    // [START maps_advanced_markers_basic_style_hide_glyph]
    // Hide the glyph.
    const pinNoGlyph = new PinElement({
        //@ts-ignore
        glyphText: '',
    });
    const markerNoGlyph = new AdvancedMarkerElement({
        position: { lat: 37.415, lng: -122.005 },
    });
    markerNoGlyph.append(pinNoGlyph);
    mapElement.append(markerNoGlyph);
    // [END maps_advanced_markers_basic_style_hide_glyph]
}

initMap();
// [END maps_advanced_markers_basic_style]
