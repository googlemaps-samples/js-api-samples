"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

const parser = new DOMParser();
const mapElement = document.querySelector('gmp-map');
async function initMap() {
    // Request needed libraries.
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    // Each PinElement is paired with a marker to demonstrate setting each parameter.
    
    // Default marker with title text (no PinElement).
    const markerWithText = new AdvancedMarkerElement({
        position: { lat: 37.419, lng: -122.03 },
        title: 'Title text for the marker at lat: 37.419, lng: -122.03',
    });
    mapElement.append(markerWithText);
    
    
    // Adjust the scale.
    const pinScaled = new PinElement({
        scale: 1.5,
    });
    const markerScaled = new AdvancedMarkerElement({
        position: { lat: 37.419, lng: -122.02 },
    });
    markerScaled.append(pinScaled);
    mapElement.append(markerScaled);
    
    
    // Change the background color.
    const pinBackground = new PinElement({
        background: '#FBBC04',
    });
    const markerBackground = new AdvancedMarkerElement({
        position: { lat: 37.419, lng: -122.01 },
    });
    markerBackground.append(pinBackground);
    mapElement.append(markerBackground);
    
    
    // Change the border color.
    const pinBorder = new PinElement({
        borderColor: '#137333',
    });
    const markerBorder = new AdvancedMarkerElement({
        position: { lat: 37.415, lng: -122.035 },
    });
    markerBorder.append(pinBorder);
    mapElement.append(markerBorder);
    
    
    // Change the glyph color.
    const pinGlyph = new PinElement({
        glyphColor: 'white',
    });
    const markerGlyph = new AdvancedMarkerElement({
        position: { lat: 37.415, lng: -122.025 },
    });
    markerGlyph.append(pinGlyph);
    mapElement.append(markerGlyph);
    
    
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
    
}
initMap();

