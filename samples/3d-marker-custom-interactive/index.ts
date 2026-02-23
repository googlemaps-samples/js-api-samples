/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// @ts-nocheck
// [START maps_3d_marker_custom_interactive]
async function init() {
  const { Map3DElement, MarkerInteractiveElement } = await google.maps.importLibrary('maps3d');

  const position = { lat: 37.424458634040455, lng: -122.0946551677331, altitude: 0 };

  const map = new Map3DElement({
    center: position,
    tilt: 67.5,
    range: 1000,
    heading: 0,
    mode: 'SATELLITE',
  });

  map.style.width = '100%';
  map.style.height = '100%';

  const marker = new MarkerInteractiveElement({
    position: position,
    title: 'Booking Marker',
    altitudeMode: 'RELATIVE_TO_GROUND',
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'marker-wrapper';
  wrapper.innerHTML = `
    <div class="booking-marker">
      <div class="price">Lorem</div>
      <div class="extra-content">
        <div class="content-inner">Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</div>
      </div>
    </div>
    <div class="arrow"></div>
  `;

  marker.append(wrapper);

  const bookingMarker = wrapper.querySelector('.booking-marker');

  // Instantaneous toggle on click/touch
  bookingMarker.addEventListener('click', (event) => {
    event.stopPropagation();
    bookingMarker.classList.toggle('expanded');
  });

  // Instantaneous close when clicking the map background
  map.addEventListener('gmp-click', () => {
    console.log('map clicked');
    bookingMarker.classList.remove('expanded');
  });

  map.append(marker);

  const canvasContainer = document.getElementById('canvas-container');
  if (canvasContainer) {
    canvasContainer.innerHTML = '';
    canvasContainer.append(map);
  } else {
    document.body.append(map);
  }
}

init();
// [END maps_3d_marker_custom_interactive]
