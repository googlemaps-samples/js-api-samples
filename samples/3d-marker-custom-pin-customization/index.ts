/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// @ts-nocheck
// [START maps_3d_marker_custom_pin_customization]
async function init() {
  const { Map3DElement, MarkerElement } = await google.maps.importLibrary('maps3d');
  const { PinElement } = await google.maps.importLibrary('marker');
  const { Place } = await google.maps.importLibrary('places');

  const centerPosition = { lat: 37.4239163, lng: -122.09435, altitude: 0 };

  const map = new Map3DElement({
    center: centerPosition,
    tilt: 67.5,
    range: 500,
    mode: 'SATELLITE',
  });

  document.body.append(map);

  // 1. Place Icon Customization (Deep Purple with White)
  // [START maps_3d_marker_place_icon_glyph]
  const place = new Place({
    id: 'ChIJN5Nz71W3j4ARhx5bwpTQEGg', // Sports Page (Bar)
  });

  await place.fetchFields({
    fields: [
      'displayName',
      'svgIconMaskURI',
      'iconBackgroundColor',
    ],
  });

  const pinElement = new PinElement({
    background: '#673ab7', // Deep Purple
    borderColor: '#ffffff',
    glyphColor: '#ffffff',
    glyphSrc: new URL(String(place.svgIconMaskURI)),
  });

  const placeIconMarker = new MarkerElement({
    position: { lat: 37.4239163, lng: -122.0927209, altitude: 50 },
    title: place.displayName,
  });

  placeIconMarker.append(pinElement);
  map.append(placeIconMarker);
  // [END maps_3d_marker_place_icon_glyph]

  // 2. Custom Graphic File (PNG)
  // [START maps_3d_marker_custom_image]
  const beachFlagImg = document.createElement('img');
  beachFlagImg.src = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

  const marker2 = new MarkerElement({
    position: { lat: 37.4239, lng: -122.0957, altitude: 50 },
    title: 'Custom Graphic File (PNG)',
  });
  marker2.append(beachFlagImg);
  map.append(marker2);
  // [END maps_3d_marker_custom_image]

  // 3. Inline SVG Marker (Vibrant Teal & Coral)
  // [START maps_3d_marker_inline_svg]
  const parser = new DOMParser();
  const pinSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
    <rect width="56" height="56" rx="28" fill="#00bcd4"></rect>
    <path d="M46.0675 22.1319L44.0601 22.7843" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M11.9402 33.2201L9.93262 33.8723" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M27.9999 47.0046V44.8933" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M27.9999 9V11.1113" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M39.1583 43.3597L37.9186 41.6532" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M16.8419 12.6442L18.0816 14.3506" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M9.93262 22.1319L11.9402 22.7843" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M46.0676 33.8724L44.0601 33.2201" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M39.1583 12.6442L37.9186 14.3506" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M16.8419 43.3597L18.0816 41.6532" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M28 39L26.8725 37.9904C24.9292 36.226 23.325 34.7026 22.06 33.4202C20.795 32.1378 19.7867 30.9918 19.035 29.9823C18.2833 28.9727 17.7562 28.0587 17.4537 27.2401C17.1512 26.4216 17 25.5939 17 24.7572C17 23.1201 17.5546 21.7513 18.6638 20.6508C19.7729 19.5502 21.1433 19 22.775 19C23.82 19 24.7871 19.2456 25.6762 19.7367C26.5654 20.2278 27.34 20.9372 28 21.8649C28.77 20.8827 29.5858 20.1596 30.4475 19.6958C31.3092 19.2319 32.235 19 33.225 19C34.8567 19 36.2271 19.5502 37.3362 20.6508C38.4454 21.7513 39 23.1201 39 24.7572C39 25.5939 38.8488 26.4216 38.5463 27.2401C38.2438 28.0587 37.7167 28.9727 36.965 29.9823C36.2133 30.9918 35.205 32.1378 33.94 33.4202C32.675 34.7026 31.0708 36.226 29.1275 37.9904L28 39Z" fill="#ff7043"></path>
  </svg>`;
  const pinSvg = parser.parseFromString(pinSvgString, 'image/svg+xml').documentElement;

  const marker3 = new MarkerElement({
    position: { lat: 37.4239, lng: -122.0937, altitude: 50 },
    title: 'Inline SVG Marker',
  });
  marker3.append(pinSvg);
  map.append(marker3);
  // [END maps_3d_marker_inline_svg]

  // 4. Custom Glyph SVG (Bright Pink)
  // [START maps_3d_marker_glyph_image]
  const pin4 = new PinElement({
    background: '#e91e63', // Pink
    borderColor: '#ffffff',
    //@ts-ignore
    glyphSrc: new URL('https://developers.google.com/maps/documentation/javascript/examples/full/images/google_logo_g.svg'),
  });

  const marker4 = new MarkerElement({
    position: { lat: 37.4249, lng: -122.0947, altitude: 50 },
    title: 'Custom Glyph (SVG)',
  });
  marker4.append(pin4);
  map.append(marker4);
  // [END maps_3d_marker_glyph_image]
}

init();
// [END maps_3d_marker_custom_pin_customization]
