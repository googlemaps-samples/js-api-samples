/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// @ts-nocheck
// [START maps_3d_marker_custom_wrapped_component]
/**
 * A custom element that wraps a 3D marker.
 */
class MyMarker extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = '<gmp-marker position="37.4239163,-122.0947209,100" title="My marker" />';
  }
}

customElements.define('my-marker', MyMarker);

async function init() {
  const { Map3DElement } = await google.maps.importLibrary('maps3d');

  const position = { lat: 37.4239163, lng: -122.0947209, altitude: 100 };

  const map = new Map3DElement({
    center: position,
    tilt: 67.5,
    range: 1000,
    mode: 'SATELLITE',
  });

  const myMarker = new MyMarker();

  document.body.append(map);
  map.append(myMarker);
}

init();
// [END maps_3d_marker_custom_wrapped_component]
