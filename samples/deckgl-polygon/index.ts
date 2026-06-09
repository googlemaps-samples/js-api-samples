/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/* [START maps_deckgl_polygon] */
// Initialize and add the map
let map: google.maps.Map;
let polygonLayer: deck.PolygonLayer; // Declare polygonLayer outside for button access
let googleMapsOverlay: deck.GoogleMapsOverlay; // Declare googleMapsOverlay outside for button access

// Declare global namespace for MDC to satisfy TypeScript compiler
declare namespace mdc {
    namespace linearProgress {
        class MDCLinearProgress {
            constructor(el: Element);
            open(): void;
            close(): void;
            determinate: boolean;
            done?: () => void;
        }
    }
}

interface ZipcodeData {
    contour: [number, number][] | [number, number][][];
    population: number;
    area: number;
    zipcode: string;
}

interface PolygonLayerProps {
    id: string;
    data: string;
    getPolygon: (d: ZipcodeData) => [number, number][] | [number, number][][];
    getElevation: (d: ZipcodeData) => number;
    getFillColor: (d: ZipcodeData) => number[];
    getLineColor?: number[];
    getLineWidth?: number;
    lineWidthMinPixels?: number;
    visible?: boolean;
    opacity?: number;
    pickable?: boolean;
    onDataLoad?: () => void;
    onHover?: (info: {
        object: ZipcodeData | undefined;
        x: number;
        y: number;
    }) => void;
}

// Declare global namespace for Deck.gl to satisfy TypeScript compiler
declare namespace deck {
    class PolygonLayer {
        constructor(props: PolygonLayerProps);
        props: PolygonLayerProps;
        clone(props: Partial<PolygonLayerProps>): PolygonLayer;
        pickable: boolean; // Added pickable property
    }
    class GoogleMapsOverlay {
        constructor(props: { layers: PolygonLayer[] });
        setMap(map: google.maps.Map | null): void;
        setProps(props: { layers: PolygonLayer[] }): void;
    }
    // Add other Deck.gl types used globally if needed
}

async function init(): Promise<void> {
    // Progress bar logic moved from index.html
    let progress: mdc.linearProgress.MDCLinearProgress | undefined;
    const progressDiv = document.querySelector('.mdc-linear-progress');
    if (progressDiv) {
        // Assuming 'mdc' is globally available, potentially loaded via a script tag
        // If not, you might need to import it or add type definitions.
        progress = new mdc.linearProgress.MDCLinearProgress(progressDiv);
        progress.open();
        progress.determinate = false;
        progress.done = function () {
            progress!.close();
            progressDiv.remove();
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
        // Assign to the outer polygonLayer
        id: 'PolygonLayer',
        data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-zipcodes.json',

        getPolygon: (d: ZipcodeData) => d.contour,
        getElevation: (d: ZipcodeData) => d.population / d.area / 10,
        getFillColor: (d: ZipcodeData) => [d.population / d.area / 60, 140, 0],
        getLineColor: [255, 255, 255],
        getLineWidth: 20,
        lineWidthMinPixels: 1,
        visible: true,
        opacity: 0.7, // Added opacity
        pickable: true,
        onDataLoad: () => {
            if (progress) {
                // Check if progress is defined
                // Add a small delay to ensure the progress bar is removed
                setTimeout(() => {
                    progress.done?.(); // hides progress bar
                }, 100); // 100ms delay
            }
        },
        onHover: ({
            object,
            x,
            y,
        }: {
            object: ZipcodeData | undefined;
            x: number;
            y: number;
        }) => {
            const tooltip = document.getElementById('tooltip');
            if (tooltip) {
                if (object) {
                    // Format data for tooltip (example: display specific properties)
                    let tooltipContent = ''; // Updated title
                    tooltipContent += `<strong>Zipcode:</strong> ${object.zipcode}<br>`;
                    tooltipContent += `<strong>Population:</strong> ${object.population}<br>`;
                    tooltipContent += `<strong>Area:</strong> ${object.area}<br>`;
                    tooltip.innerHTML = tooltipContent;
                    tooltip.style.left = String(x) + 'px';
                    tooltip.style.top = String(y) + 'px';
                    tooltip.style.display = 'block';
                } else {
                    tooltip.style.display = 'none';
                }
            }
        },
    });

    googleMapsOverlay = new deck.GoogleMapsOverlay({
        // Assign to the outer googleMapsOverlay
        layers: [polygonLayer],
    });

    googleMapsOverlay.setMap(map);

    // Button functionality
    const toggleButton = document.getElementById('toggleButton');
    if (toggleButton) {
        // Check if toggleButton is found
        toggleButton.addEventListener('click', () => {
            const currentVisible = polygonLayer.props.visible ?? true;
            // Create a new layer instance with toggled visibility
            const newPolygonLayer = polygonLayer.clone({
                visible: !currentVisible,
            });
            // Update the overlay with the new layer instance
            googleMapsOverlay.setProps({
                layers: [newPolygonLayer],
            });
            // Update the polygonLayer variable to the new instance
            polygonLayer = newPolygonLayer;

            toggleButton.textContent = !currentVisible
                ? 'Hide Polygon Layer'
                : 'Show Polygon Layer';
        });
    }
}

void init();
/* [END maps_deckgl_polygon] */
