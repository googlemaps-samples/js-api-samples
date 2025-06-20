/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_weather_api_compact]
import './simple-weather-widget'; // Import the custom element
const CURRENT_CONDITIONS_API_URL = 'https://weather.googleapis.com/v1/currentConditions:lookup'; // Current Conditions API endpoint.
const API_KEY = "AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8"; // Use the hardcoded API key from index.html
const LIGHT_MAP_ID = 'c306b3c6dd3ed8d9';
const DARK_MAP_ID = '6b73a9fe7e831a00';
let map;
let activeWeatherWidget = null; // To keep track of the currently active widget
let allMarkers = []; // To store all active markers
let markersLoaded = false; // Flag to track if button markers are loaded
async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    map = new Map(document.getElementById("map"), {
        center: { lat: 48.8566, lng: 2.3522 }, // Set center to Paris initially, will change based on markers
        zoom: 6,
        minZoom: 5, // Set minimum zoom level to 5
        disableDefaultUI: true, // Disable default UI on basemap click
        mapId: 'c306b3c6dd3ed8d9', // Use the specified map ID for light mode
        clickableIcons: false, // Disable clicks on base map POIs
    });
    // Load a marker at the initial map center
    const initialCenter = map.getCenter();
    if (initialCenter) {
        await createAndAddMarker({ name: 'Initial Location', lat: initialCenter.lat(), lng: initialCenter.lng() }, 'dynamic'); // Create and add dynamic marker at center
    }
    // Add a click listener to the map to handle creating a new marker or hiding the active widget
    map.addListener('click', async (event) => {
        // Check if the click was on a marker. If so, the marker's own click listener will handle it.
        // If not, create a new dynamic marker or hide the active widget.
        let target = event.domEvent.target;
        let isClickOnMarker = false;
        while (target) {
            if (target.tagName === 'SIMPLE-WEATHER-WIDGET' || target.classList.contains('gm-control-active')) { // Check for widget or default marker control
                isClickOnMarker = true;
                break;
            }
            target = target.parentElement;
        }
        if (!isClickOnMarker && event.latLng) {
            // If a widget is active, hide its rain details and reset zIndex
            if (activeWeatherWidget) {
                const rainDetailsElement = activeWeatherWidget.shadowRoot.getElementById('rain-details');
                rainDetailsElement.style.display = 'none';
                const activeWidgetContainer = activeWeatherWidget.shadowRoot.querySelector('.widget-container');
                activeWidgetContainer.classList.remove('highlight');
                // Find the marker associated with the active widget and reset its zIndex
                const activeMarker = allMarkers.find(marker => marker.content === activeWeatherWidget);
                if (activeMarker) {
                    activeMarker.zIndex = null;
                }
                activeWeatherWidget = null; // Clear the active widget
            }
            // Remove the previous dynamic marker if it exists
            const currentDynamicMarkerIndex = allMarkers.findIndex(marker => marker.markerType === 'dynamic');
            if (currentDynamicMarkerIndex !== -1) {
                allMarkers[currentDynamicMarkerIndex].map = null;
                allMarkers.splice(currentDynamicMarkerIndex, 1);
            }
            // Create a new dynamic marker at the clicked location
            await createAndAddMarker({ name: 'Clicked Location', lat: event.latLng.lat(), lng: event.latLng.lng() }, 'dynamic'); // Create and add dynamic marker
        }
    });
}
/**
 * Creates a weather widget and marker and adds them to the map.
 * @param location The location for the marker.
 * @param markerType The type of marker ('initial', 'button', 'dynamic').
 */
async function createAndAddMarker(location, markerType) {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const weatherWidget = document.createElement('simple-weather-widget');
    // Apply dark mode if the map container is in dark mode
    const mapContainer = document.getElementById("map");
    if (mapContainer.classList.contains('dark-mode')) {
        weatherWidget.setMode('dark');
    }
    const marker = new AdvancedMarkerElement({
        map: map,
        position: { lat: location.lat, lng: location.lng },
        content: weatherWidget,
        title: location.name // Add a title for accessibility
    });
    // Store the marker type
    marker.markerType = markerType;
    // Fetch and update weather data for this location
    updateWeatherDisplayForMarker(marker, weatherWidget, new google.maps.LatLng(location.lat, location.lng));
    // Add click listener to the marker
    marker.addListener('click', () => {
        const widgetContainer = weatherWidget.shadowRoot.querySelector('.widget-container');
        // If a widget is currently active and it's not the clicked one, remove its highlight class and reset zIndex
        if (activeWeatherWidget && activeWeatherWidget !== weatherWidget) {
            const activeWidgetContainer = activeWeatherWidget.shadowRoot.querySelector('.widget-container');
            activeWidgetContainer.classList.remove('highlight');
            // Find the marker associated with the active widget and reset its zIndex
            const activeMarker = allMarkers.find(marker => marker.content === activeWeatherWidget);
            if (activeMarker) {
                activeMarker.zIndex = null;
            }
        }
        // Toggle the highlight class on the clicked widget's container
        widgetContainer.classList.toggle('highlight');
        // Update the activeWeatherWidget and set zIndex based on the highlight state
        if (widgetContainer.classList.contains('highlight')) {
            activeWeatherWidget = weatherWidget;
            marker.zIndex = 1; // Set zIndex to 1 when highlighted
        }
        else {
            activeWeatherWidget = null;
            marker.zIndex = null; // Reset zIndex when not highlighted
        }
    });
    allMarkers.push(marker); // Add the marker to the allMarkers array
}
/**
 * Toggles the visual mode of the weather widget and map between light and dark.
 * Call this function to switch the mode.
 */
/**
 * Toggles the dark mode class on the body element.
 */
async function toggleDarkMode() {
    const mapContainer = document.getElementById("map");
    mapContainer.classList.toggle('dark-mode');
    const modeToggleButton = document.getElementById('mode-toggle');
    if (modeToggleButton) {
        if (mapContainer.classList.contains('dark-mode')) {
            modeToggleButton.textContent = 'Light Mode';
        }
        else {
            modeToggleButton.textContent = 'Dark Mode';
        }
    }
    // Remove all markers from the map
    allMarkers.forEach(marker => {
        marker.map = null;
    });
    // Re-initialize the map to apply the new map ID
    const { Map } = await google.maps.importLibrary("maps");
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();
    const currentMapId = mapContainer.classList.contains('dark-mode') ? DARK_MAP_ID : LIGHT_MAP_ID;
    map = new Map(mapContainer, {
        center: currentCenter,
        zoom: currentZoom,
        minZoom: 5, // Set minimum zoom level to 5
        disableDefaultUI: true,
        mapId: currentMapId,
        clickableIcons: false,
    });
    // Re-add all markers to the new map instance and update their widget mode
    const markersToReAdd = [...allMarkers]; // Create a copy to avoid modifying the array while iterating
    allMarkers = []; // Clear the array before re-adding
    for (const marker of markersToReAdd) {
        marker.map = map; // Add marker to the new map
        const weatherWidget = marker.content;
        const mapContainer = document.getElementById("map"); // Re-get map container
        if (mapContainer.classList.contains('dark-mode')) {
            weatherWidget.setMode('dark');
        }
        else {
            weatherWidget.setMode('light');
        }
        allMarkers.push(marker); // Add back to the allMarkers array
    }
    // Re-add the map click listener
    map.addListener('click', async (event) => {
        // Check if the click was on a marker. If so, the marker's own click listener will handle it.
        // If not, create a new dynamic marker or hide the active widget.
        let target = event.domEvent.target;
        let isClickOnMarker = false;
        while (target) {
            if (target.tagName === 'SIMPLE-WEATHER-WIDGET' || target.classList.contains('gm-control-active')) { // Check for widget or default marker control
                isClickOnMarker = true;
                break;
            }
            target = target.parentElement;
        }
        if (!isClickOnMarker && event.latLng) {
            if (activeWeatherWidget) {
                const rainDetailsElement = activeWeatherWidget.shadowRoot.getElementById('rain-details');
                rainDetailsElement.style.display = 'none';
                const activeWidgetContainer = activeWeatherWidget.shadowRoot.querySelector('.widget-container');
                activeWidgetContainer.classList.remove('highlight');
                // Find the marker associated with the active widget and reset its zIndex
                const activeMarker = allMarkers.find(marker => marker.content === activeWeatherWidget);
                if (activeMarker) {
                    activeMarker.zIndex = null;
                }
                activeWeatherWidget = null; // Clear the active widget
            }
            // Remove the previous dynamic marker if it exists
            const currentDynamicMarkerIndex = allMarkers.findIndex(marker => marker.markerType === 'dynamic');
            if (currentDynamicMarkerIndex !== -1) {
                allMarkers[currentDynamicMarkerIndex].map = null;
                allMarkers.splice(currentDynamicMarkerIndex, 1);
            }
            // Create a new dynamic marker at the clicked location
            await createAndAddMarker({ name: 'Clicked Location', lat: event.latLng.lat(), lng: event.latLng.lng() }, 'dynamic'); // Create and add dynamic marker
        }
    });
}
const locations = [
    { name: 'London', lat: 51.5074, lng: -0.1278 },
    { name: 'Brussels', lat: 50.8503, lng: 4.3517 },
    { name: 'Luxembourg', lat: 49.8153, lng: 6.1296 },
    { name: 'Amsterdam', lat: 52.3676, lng: 4.9041 },
    { name: 'Berlin', lat: 52.5200, lng: 13.4050 },
    { name: 'Rome', lat: 41.9028, lng: 12.4964 },
    { name: 'Geneva', lat: 46.2044, lng: 6.14324 },
    { name: 'Barcelona', lat: 41.3874, lng: -2.1686 },
    { name: 'Milan', lat: 45.4685, lng: 9.1824 },
];
async function loadWeatherMarkers() {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    for (const location of locations) {
        await createAndAddMarker(location, 'button'); // Create and add button markers
    }
}
function removeButtonMarkers() {
    // If a button marker widget is active, hide its rain details and reset zIndex
    if (activeWeatherWidget) {
        const buttonMarker = allMarkers.find(marker => marker.content === activeWeatherWidget && marker.markerType === 'button');
        if (buttonMarker) {
            const rainDetailsElement = activeWeatherWidget.shadowRoot.getElementById('rain-details');
            rainDetailsElement.style.display = 'none';
            const activeWidgetContainer = activeWeatherWidget.shadowRoot.querySelector('.widget-container');
            activeWidgetContainer.classList.remove('highlight');
            buttonMarker.zIndex = null;
            activeWeatherWidget = null; // Clear the active widget
        }
    }
    // Remove button markers from the map and the allMarkers array
    const markersToRemove = allMarkers.filter(marker => marker.markerType === 'button');
    markersToRemove.forEach(marker => {
        marker.map = null;
        const index = allMarkers.indexOf(marker);
        if (index > -1) {
            allMarkers.splice(index, 1);
        }
    });
}
async function updateWeatherDisplayForMarker(marker, widget, location) {
    const lat = location.lat();
    const lng = location.lng();
    const currentConditionsUrl = `${CURRENT_CONDITIONS_API_URL}?key=${API_KEY}&location.latitude=${lat}&location.longitude=${lng}`;
    try {
        const response = await fetch(currentConditionsUrl);
        if (!response.ok) {
            const errorBody = await response.json();
            console.error('API error response:', errorBody);
            if (response.status === 404 && errorBody?.error?.status === 'NOT_FOUND') {
                widget.data = { error: "Location not supported" };
            }
            else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        else {
            const weatherData = await response.json();
            console.log('Weather data fetched for marker:', weatherData);
            widget.data = weatherData;
        }
    }
    catch (error) {
        console.error('Error fetching weather data for marker:', error);
        widget.data = { error: "Failed to fetch weather data" };
    }
}
initMap();
// Wait for the custom element to be defined before adding the event listener
customElements.whenDefined('simple-weather-widget').then(() => {
    const modeToggleButton = document.getElementById('mode-toggle');
    if (modeToggleButton) {
        modeToggleButton.addEventListener('click', () => {
            toggleDarkMode();
        });
    }
    const loadMarkersButton = document.getElementById('load-markers-button');
    if (loadMarkersButton) {
        loadMarkersButton.addEventListener('click', () => {
            if (!markersLoaded) {
                loadWeatherMarkers();
                markersLoaded = true;
                loadMarkersButton.textContent = 'Remove Markers';
            }
            else {
                removeButtonMarkers();
                markersLoaded = false;
                loadMarkersButton.textContent = 'Load Markers';
            }
        });
    }
});
// [END maps_weather_api_compact]
