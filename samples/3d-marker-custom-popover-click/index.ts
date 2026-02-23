/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// @ts-nocheck
// [START maps_3d_marker_custom_popover_click]
async function init() {
  const { Map3DElement, MarkerInteractiveElement, PopoverElement } = await google.maps.importLibrary('maps3d');

  const position = { lat: 37.4239163, lng: -122.09435, altitude: 0 };

  const map = new Map3DElement({
    center: position,
    tilt: 67.5,
    range: 500,
    mode: 'SATELLITE',
  });

  document.body.append(map);

  const marker = new MarkerInteractiveElement({
    position: position,
    title: 'Interactive Marker',
  });

  const popover = new PopoverElement({
    positionAnchor: marker,
    lightDismissDisabled: true
  });

  const content = document.createElement('div');
  content.className = 'popover-content';
  content.textContent = 'Popover opened on click!';
  popover.append(content);

  map.append(marker);
  map.append(popover);

  // Manually handle toggle for click-to-open sample
  marker.addEventListener('gmp-click', () => {
    popover.open = !popover.open;
  });

  // Close the popover when clicking anywhere else on the map
  map.addEventListener('gmp-click', (event) => {
    if (event.target === map) {
      popover.open = false;
    }
  });
}

init();

/* OR
<gmp-map-3d range="500" tilt="67.5" center="37.4239163,-122.09435" mode="SATELLITE">
  <gmp-marker-interactive id="marker-1" position="37.4239163,-122.09435" title="Interactive Marker" />
  <gmp-popover position-anchor="marker-1" light-dismiss-disabled>
    <div class="popover-content">Popover opened on click!</div>
  </gmp-popover>
</gmp-map-3d>
*/
// [END maps_3d_marker_custom_popover_click]
