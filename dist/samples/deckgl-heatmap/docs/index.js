"use strict";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_deckgl_heatmap] */
// Initialize and add the map
let map;
// Use global types for Deck.gl components
let heatmapLayer;
let googleMapsOverlay;
let marker;
let infoWindow;
async function initMap() {
    // Progress bar logic moved from index.html
    var progress, progressDiv = document.querySelector(".mdc-linear-progress");
    if (progressDiv) {
        // Assuming 'mdc' is globally available, potentially loaded via a script tag
        // If not, you might need to import it or add type definitions.
        // @ts-ignore
        progress = new mdc.linearProgress.MDCLinearProgress(progressDiv);
        progress.open();
        progress.determinate = false;
        progress.done = function () {
            progress.close();
            progressDiv?.remove(); // Use optional chaining in case progressDiv is null
        };
    }
    // The location for the map center.
    const position = { lat: 37.77325660358167, lng: -122.41712341793448 }; // Using the center from original deckgl-polygon.js
    //  Request needed libraries.
    const { Map, InfoWindow } = await google.maps.importLibrary('maps');
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
    const mapDiv = document.getElementById('map');
    if (!mapDiv) {
        console.error('Map element not found!');
        return;
    }
    // The map, centered at the specified position
    map = new Map(mapDiv, {
        zoom: 13, // Using the zoom from original deckgl-polygon.js
        center: position,
        tilt: 90, // Add tilt
        heading: -25, // Add heading
        mapId: '6b73a9fe7e831a00',
        fullscreenControl: false, // Disable fullscreen control
        clickableIcons: false, // Disable clicks on base map POIs
    });
    // Deck.gl Layer and Overlay
    // Use global deck object
    heatmapLayer = new deck.HeatmapLayer({
        id: 'HeatmapLayer', // Change layer ID
        data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-bike-parking.json', // Use the loaded data
        getPosition: (d) => d.COORDINATES, // Use 'any' for simplicity, or define a proper type
        getWeight: (d) => d.SPACES, // Use 'any' for simplicity, or define a proper type
        radiusPixels: 25, // Adjust radius as in user's example
        visible: true,
        pickable: true,
        onHover: (info) => {
            const tooltip = document.getElementById('tooltip');
            if (tooltip) {
                console.log('Hovered object:', info.object);
                if (info.object) {
                    // Format data for tooltip (display ADDRESS, RACKS, SPACES)
                    let tooltipContent = '<h4>Bike Parking Info:</h4>'; // Updated title
                    if (info.object.ADDRESS !== undefined) {
                        tooltipContent += `<strong>Address:</strong> ${info.object.ADDRESS}<br>`;
                    }
                    if (info.object.RACKS !== undefined) {
                        tooltipContent += `<strong>Racks:</strong> ${info.object.RACKS}<br>`;
                    }
                    if (info.object.SPACES !== undefined) {
                        tooltipContent += `<strong>Spaces:</strong> ${info.object.SPACES}<br>`;
                    }
                    tooltip.innerHTML = tooltipContent;
                    tooltip.style.left = info.x + 'px';
                    tooltip.style.top = info.y + 'px';
                    tooltip.style.display = 'block';
                }
                else {
                    tooltip.style.display = 'none';
                }
                console.log('Tooltip content set to:', tooltip.innerHTML);
            }
        }
    });
    heatmapLayer.pickable = true; // Ensure pickable is true after creation
    // Use global deck object
    googleMapsOverlay = new deck.GoogleMapsOverlay({
        layers: [heatmapLayer],
        controller: true // Enable Deck.gl to control map view
    });
    googleMapsOverlay.setMap(map);
    // Hide progress bar after data is loaded and layer is added
    if (progress) { // Check if progress is defined
        // Add a small delay to ensure the progress bar is removed
        setTimeout(() => {
            // @ts-ignore
            progress.done(); // hides progress bar
        }, 100); // 100ms delay
    }
    // Create a single InfoWindow instance
    infoWindow = new InfoWindow();
    // Add click listener to the map
    map.addListener('click', async (event) => {
        const latLng = event.latLng;
        if (!latLng)
            return; // Ensure latLng is not null
        if (!marker) {
            // Create the marker on the first click
            marker = new AdvancedMarkerElement({
                map: map,
                position: latLng,
                gmpClickable: true,
            });
            // Add click listener to the marker
            marker.addListener("click", () => {
                infoWindow.close();
                const content = `
            <div>Location: ${latLng.lat().toFixed(3)}, ${latLng.lng().toFixed(3)}</div>
            <div><a href="https://www.google.com/maps/search/?api=1&query=${latLng.lat()},${latLng.lng()}" target="_blank">Open in Google Maps</a></div>
          `;
                infoWindow.setContent(content);
                infoWindow.open(map, marker);
            });
            // Open InfoWindow immediately on first click
            const content = `
          <div>Location: ${latLng.lat().toFixed(3)}, ${latLng.lng().toFixed(3)}</div>
          <div><a href="https://www.google.com/maps/search/?api=1&query=${latLng.lat()},${latLng.lng()}" target="_blank">Open in Google Maps</a></div>
        `;
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
        }
        else {
            // Move the existing marker on subsequent clicks
            marker.position = latLng;
            // InfoWindow remains open
            const content = `
          <div>Location: ${latLng.lat().toFixed(3)}, ${latLng.lng().toFixed(3)}</div>
          <div><a href="https://www.google.com/maps/search/?api=1&query=${latLng.lat()},${latLng.lng()}" target="_blank">Open in Google Maps</a></div>
        `;
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
        }
    });
    // Button functionality
    const toggleButton = document.getElementById('toggleButton');
    if (toggleButton) { // Check if toggleButton is found
        toggleButton.addEventListener('click', () => {
            const currentVisible = heatmapLayer.props.visible;
            // Create a new layer instance with toggled visibility and update the overlay
            const newLayer = heatmapLayer.clone({ visible: !currentVisible });
            googleMapsOverlay.setProps({
                layers: [newLayer]
            });
            heatmapLayer = newLayer; // Update the heatmapLayer variable
            toggleButton.textContent = !currentVisible ? 'Hide Heatmap Layer' : 'Show Heatmap Layer';
        });
    }
}
initMap();
/* [END maps_deckgl_heatmap] */
