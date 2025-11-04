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
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    // Each PinElement is paired with a MarkerView to demonstrate setting each parameter.

    // [START maps_advanced_markers_basic_style_title]
    // Default marker with title text (no PinElement).
    const markerViewWithText = new AdvancedMarkerElement({
        position: { lat: 37.419, lng: -122.03 },
        title: 'Title text for the marker at lat: 37.419, lng: -122.03',
    });
    mapElement.append(markerViewWithText);
    // [END maps_advanced_markers_basic_style_title]

    // [START maps_advanced_markers_basic_style_scale]
    // Adjust the scale.
    const pinScaled = new PinElement({
        scale: 1.5,
    });
    const markerViewScaled = new AdvancedMarkerElement({
        position: { lat: 37.419, lng: -122.02 },
        content: pinScaled.element,
    });
    mapElement.append(markerViewScaled);
    // [END maps_advanced_markers_basic_style_scale]

    // [START maps_advanced_markers_basic_style_background]
    // Change the background color.
    const pinBackground = new PinElement({
        background: '#FBBC04',
    });
    const markerViewBackground = new AdvancedMarkerElement({
        position: { lat: 37.419, lng: -122.01 },
        content: pinBackground.element,
    });
    mapElement.append(markerViewBackground);
    // [END maps_advanced_markers_basic_style_background]

    // [START maps_advanced_markers_basic_style_border]
    // Change the border color.
    const pinBorder = new PinElement({
        borderColor: '#137333',
    });
    const markerViewBorder = new AdvancedMarkerElement({
        position: { lat: 37.415, lng: -122.035 },
        content: pinBorder.element,
    });
    mapElement.append(markerViewBorder);
    // [END maps_advanced_markers_basic_style_border]

    // [START maps_advanced_markers_basic_style_glyph]
    // Change the glyph color.
    const pinGlyph = new PinElement({
        glyphColor: 'white',
    });
    const markerViewGlyph = new AdvancedMarkerElement({
        position: { lat: 37.415, lng: -122.025 },
        content: pinGlyph.element,
    });
    mapElement.append(markerViewGlyph);
    // [END maps_advanced_markers_basic_style_glyph]

    // [START maps_advanced_markers_basic_style_text_glyph]
    const pinTextGlyph = new PinElement({
        //@ts-ignore
        glyphText: 'T',
        glyphColor: 'white',
    });
    const markerViewGlyphText = new AdvancedMarkerElement({
        position: { lat: 37.415, lng: -122.015 },
        content: pinTextGlyph.element,
    });
    mapElement.append(markerViewGlyphText);
    // [END maps_advanced_markers_basic_style_text_glyph]

    // [START maps_advanced_markers_basic_style_hide_glyph]
    // Hide the glyph.
    const pinNoGlyph = new PinElement({
        //@ts-ignore
        glyphText: '',
    });
    const markerViewNoGlyph = new AdvancedMarkerElement({
        position: { lat: 37.415, lng: -122.005 },
        content: pinNoGlyph.element,
    });
    mapElement.append(markerViewNoGlyph);
    // [END maps_advanced_markers_basic_style_hide_glyph]

}

initMap();
// [END maps_advanced_markers_basic_style]
