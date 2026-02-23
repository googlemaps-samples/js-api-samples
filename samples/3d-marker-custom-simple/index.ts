/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// @ts-nocheck
// [START maps_3d_marker_custom_simple]
async function init() {
  const { Map3DElement, MarkerElement, altitudeMode } = await google.maps.importLibrary('maps3d');
  const { PinElement, } = await google.maps.importLibrary('marker');

  const map = new Map3DElement({
    center: { lat: 37.417, lng: -122.023, altitude: 0 },
    tilt: 67.5,
    range: 4000,
    mode: 'SATELLITE',
  });

  document.body.append(map);

  // 1. Scale the marker
  const pinScaled = new PinElement({
    scale: 1.5,
  });
  const markerScaled = new MarkerElement({
    position: { lat: 37.419, lng: -122.02 },
    title: 'Scaled Marker',
  });
  markerScaled.append(pinScaled);
  map.append(markerScaled);

  // 2. Change the background color
  const pinBackground = new PinElement({
    background: '#FBBC04',
  });
  const markerBackground = new MarkerElement({
    position: { lat: 37.419, lng: -122.01 },
    title: 'Yellow Background',
  });
  markerBackground.append(pinBackground);
  map.append(markerBackground);

  // 3. Change the border color
  const pinBorder = new PinElement({
    borderColor: 'black',
  });
  const markerBorder = new MarkerElement({
    position: { lat: 37.415, lng: -122.035 },
    title: 'Black Border',
  });
  markerBorder.append(pinBorder);
  map.append(markerBorder);

  // 4. Change the glyph color
  const pinGlyph = new PinElement({
    glyphColor: 'white',
  });
  const markerGlyph = new MarkerElement({
    position: { lat: 37.415, lng: -122.025 },
    title: 'White Glyph',
  });
  markerGlyph.append(pinGlyph);
  map.append(markerGlyph);

  // 5. Add text to a glyph
  const pinTextGlyph = new PinElement({
    glyph: 'T',
    glyphColor: 'white',
  });
  const markerGlyphText = new MarkerElement({
    position: { lat: 37.415, lng: -122.015 },
    title: 'Text Glyph',
  });
  markerGlyphText.append(pinTextGlyph);
  map.append(markerGlyphText);

  // 6. Change the altitude and extrude
  const markerExtruded = new MarkerElement({
    position: { lat: 37.419, lng: -122.03, altitude: 150 },
    altitudeMode: 'RELATIVE_TO_MESH',
    title: 'Altitude Marker',
  });
  map.append(markerExtruded);
}

init();

/* OR
<gmp-map-3d range="2000" tilt="67.5" center="37.417,-122.02" mode="SATELLITE">
  <gmp-marker position="37.419,-122.02">
    <gmp-pin scale="1.5"></gmp-pin>
  </gmp-marker>
  <gmp-marker position="37.419,-122.01">
    <gmp-pin background="#FBBC04"></gmp-pin>
  </gmp-marker>
  <gmp-marker position="37.415,-122.035">
    <gmp-pin border-color="#137333"></gmp-pin>
  </gmp-marker>
  <gmp-marker position="37.415,-122.025">
    <gmp-pin glyph-color="white"></gmp-pin>
  </gmp-marker>
  <gmp-marker position="37.415,-122.015">
    <gmp-pin glyph="T" glyph-color="white"></gmp-pin>
  </gmp-marker>
  <gmp-marker position="37.4239,-122.0947,100" altitude-mode="relative-to-ground" extruded></gmp-marker>
</gmp-map-3d>
*/
// [END maps_3d_marker_custom_simple]
