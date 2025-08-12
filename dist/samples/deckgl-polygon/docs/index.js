"use strict";
// Initialize and add the map
let map;
let polygonLayer; // Declare polygonLayer outside for button access
let googleMapsOverlay; // Declare googleMapsOverlay outside for button access
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
    const position = { lat: 37.752954624496304, lng: -122.44754059928648 }; // Using the center from original deckgl-polygon.js
    //  Request needed libraries.
    const { Map } = await google.maps.importLibrary('maps');
    const mapDiv = document.getElementById('map');
    if (!mapDiv) {
        console.error('Map element not found!');
        return;
    }
    // The map, centered at the specified position
    map = new Map(mapDiv, {
        zoom: 12, // Using the zoom from original deckgl-polygon.js
        center: position,
        tilt: 90, // Add tilt
        heading: -25, // Add heading
        mapId: 'c306b3c6dd3ed8d9', // Using the mapId from original deckgl-polygon.js
        streetViewControl: false,
        // clickableIcons: false, // Disable clicks on base map POIs
    });
    // Deck.gl Layer and Overlay
    polygonLayer = new deck.PolygonLayer({
        id: 'PolygonLayer',
        data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-zipcodes.json',
        getPolygon: (d) => d.contour, // Use 'any' for simplicity
        getElevation: (d) => d.population / d.area / 10, // Use 'any' for simplicity
        getFillColor: (d) => [d.population / d.area / 60, 140, 0], // Use 'any' for simplicity
        getLineColor: [255, 255, 255],
        getLineWidth: 20,
        lineWidthMinPixels: 1,
        visible: true,
        opacity: 0.7, // Added opacity
        pickable: true,
        onDataLoad: () => {
            if (progress) { // Check if progress is defined
                // Add a small delay to ensure the progress bar is removed
                setTimeout(() => {
                    // @ts-ignore
                    progress.done(); // hides progress bar
                }, 100); // 100ms delay
            }
        },
        onHover: ({ object, x, y }) => {
            const tooltip = document.getElementById('tooltip');
            if (tooltip) {
                if (object) {
                    // Format data for tooltip (example: display specific properties)
                    let tooltipContent = ''; // Updated title
                    const properties = object; // Correctly access the properties object
                    if (properties) {
                        if (properties.zipcode !== undefined) {
                            tooltipContent += `<strong>Zipcode:</strong> ${properties.zipcode}<br>`;
                        }
                        if (properties.population !== undefined) {
                            tooltipContent += `<strong>Population:</strong> ${properties.population}<br>`;
                        }
                        if (properties.area !== undefined) {
                            tooltipContent += `<strong>Area:</strong> ${properties.area}<br>`;
                        }
                    }
                    tooltip.innerHTML = tooltipContent;
                    tooltip.style.left = x + 'px';
                    tooltip.style.top = y + 'px';
                    tooltip.style.display = 'block';
                }
                else {
                    tooltip.style.display = 'none';
                }
            }
        }
    });
    googleMapsOverlay = new deck.GoogleMapsOverlay({
        layers: [polygonLayer],
    });
    googleMapsOverlay.setMap(map);
    // Button functionality
    const toggleButton = document.getElementById('toggleButton');
    if (toggleButton) { // Check if toggleButton is found
        toggleButton.addEventListener('click', () => {
            const currentVisible = polygonLayer.props.visible;
            // Create a new layer instance with toggled visibility
            const newPolygonLayer = polygonLayer.clone({ visible: !currentVisible });
            // Update the overlay with the new layer instance
            googleMapsOverlay.setProps({
                layers: [newPolygonLayer]
            });
            // Update the polygonLayer variable to the new instance
            polygonLayer = newPolygonLayer;
            toggleButton.textContent = !currentVisible ? 'Hide Polygon Layer' : 'Show Polygon Layer';
        });
    }
}
initMap();
/* [END maps_deckgl_polygon] */ 
