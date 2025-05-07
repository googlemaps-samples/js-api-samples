/*
  * @license
  * Copyright 2025 Google LLC. All Rights Reserved.
  * SPDX-License-Identifier: Apache-2.0
  */

// Import necessary loader
import { registerLoaders } from '@loaders.gl/core';
import { KMLLoader } from '@loaders.gl/kml';

// Register the KML loader
registerLoaders(KMLLoader);

// Declare global namespace for Deck.gl to satisfy TypeScript compiler
declare namespace deck {
  class GeoJsonLayer {
    constructor(props: any);
    props: any;
    clone(props: any): GeoJsonLayer;
    pickable: boolean;
    getFillColor: (d: any) => number[];
    getPointRadius: (d: any) => number;
    getLineColor: (d: any) => number[];
    getLineWidth: (d: any) => number;
    lineWidthMinPixels: number;
  }
  class TextLayer {
    constructor(props: any);
    props: any;
    clone(props: any): TextLayer;
    pickable: boolean;
    getPosition: (d: any) => number[];
    getText: (d: any) => string;
    getColor: (d: any) => number[];
    getSize: (d: any) => number;
    getAngle: (d: any) => number;
    getTextAnchor: string;
    getAlignmentBaseline: string;
  }
  class GoogleMapsOverlay {
    constructor(props: any);
    setMap(map: google.maps.Map | null): void;
    setProps(props: any): void;
  }
  // Add other Deck.gl types used globally if needed
}

// Initialize and add the map
let map: google.maps.Map;
let geojsonLayer: deck.GeoJsonLayer;
let googleMapsOverlay: deck.GoogleMapsOverlay;

async function initMap(): Promise<void> {
  // Progress bar logic moved from index.html
  var progress, progressDiv = document.querySelector(".mdc-linear-progress");
  if (progressDiv) {
    // Assuming 'mdc' is globally available, potentially loaded via a script tag
    // If not, you might need to import it or add type definitions.
    // @ts-ignore
    progress = new mdc.linearProgress.MDCLinearProgress(progressDiv as HTMLElement);
    progress.open();
    progress.determinate = false;
    progress.done = function () {
      progress.close();
      progressDiv?.remove(); // Use optional chaining in case progressDiv is null
    };
  }


  // The location for the map center (adjust as needed for the KML data)
  const position = { lat: 19.223718899391237, lng:-148.62590882823457};

  //  Request needed libraries.
  const {Map} =
      await google.maps.importLibrary('maps') as google.maps.MapsLibrary;

  const mapDiv = document.getElementById('map');
  if (!mapDiv) {
    console.error('Map element not found!');
    return;
  }

  // The map, centered at the specified position
  map = new Map(mapDiv, {
    zoom:3, // Adjust zoom as needed
    center: position,
    // mapId: '6a17c323f461e521', // Replace with your Map ID
    mapId: '6a17c323f461e521',
    mapTypeId: 'satellite',
    zoomControl:true,
    clickableIcons: false, // Disable clicks on base map POIs
  });

  // Deck.gl Layer and Overlay
  geojsonLayer = new deck.GeoJsonLayer({
    id: 'geojson-layer',
    data: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week_age.kml?t=${Date.now()}`, // Append timestamp to prevent caching
    pickable: true,
    stroked: true, // Set to true to add a border
    getLineColor: [0, 0, 0, 255], // Set border color to black
    getLineWidth: 2, // Set border width
    filled: true, // Set to true to render filled circles
    pointType: 'circle', // Render points as circles
    // extruded: false, // Keep as false for 2D circles
    // lineWidthScale: 14, // Not needed for points
    // lineWidthMinPixels: 4, // Not needed for points
    pointRadiusMinPixels: 2,
    pointRadiusMaxPixels: 200,
    getRadius: (f) => 8000,
    getFillColor: (f, {index}) => {

      // Extract magnitude from the description string
      const description = f.properties.description;
      const magnitudeMatch = description.match(/M (\d+\.?\d*)/);
      let parsedMagnitude: number | null = null;
      if (magnitudeMatch && magnitudeMatch[1]) {
        parsedMagnitude = parseFloat(magnitudeMatch[1]);
      } else {
        console.log('Magnitude not found');
      }

      // Define color range (Lighter Red to #FF0000) - Increased contrast
      const minColor = [255, 255, 0]; // Yellow
      const maxColor = [255, 0, 0]; // #FF0000
      const minMag = 1;
      const maxMag = 7;

      // Use parsed magnitude for color calculation
      const magnitudeForColor = parsedMagnitude !== null ? parsedMagnitude : minMag;

      // Normalize magnitude
      const normalizedMagnitude = Math.max(0, Math.min(1, (magnitudeForColor - minMag) / (maxMag - minMag)));

      // Interpolate colors
      const r = minColor[0] + normalizedMagnitude * (maxColor[0] - minColor[0]);
      const g = minColor[1] + normalizedMagnitude * (maxColor[1] - minColor[1]);
      const b = minColor[2] + normalizedMagnitude * (maxColor[2] - minColor[2]);

      const interpolatedColor = [Math.round(r), Math.round(g), Math.round(b), 200];

      return interpolatedColor; // Color scale based on magnitude, fixed alpha
    },
    autoHighlight: true,
    transitions: {
      getRadius: {
        type: "spring",
        stiffness: 0.1,
        damping: 0.15,
        enter: () => [0], // grow from size 0,
        duration: 10000,
      },
    },
    // Optional: Add onHover or onClick handlers for interactivity
    onHover: ({object, x, y}: {object: any, x: number, y: number}) => {
      const tooltip = document.getElementById('tooltip'); // Assuming a tooltip element exists
      if (tooltip && object) {
        let tooltipContent = `Earthquakes 1.0_week_age`;
        tooltipContent += `<p> ${object.properties.description}</p>`;
        tooltip.innerHTML = tooltipContent;
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
        tooltip.style.display = 'block';
      } else if (tooltip) {
        tooltip.style.display = 'none';
      }
    },
    onDataLoad: () => {
      console.log('KML data loaded');
      if (progress && progress.done) {
        progress.done();
      }
    }
  });

  googleMapsOverlay = new deck.GoogleMapsOverlay({
    layers: [geojsonLayer],
    // Disable depth testing to avoid rendering issues with the base map
    parameters: {
      depthTest: false
    }
  });

  googleMapsOverlay.setMap(map);

  // Generate Legend
  const legendContainer = document.getElementById('legend');
  if (legendContainer) {
    const magnitudeValues = [1, 2, 3, 4, 5, 6, 7]; // Representative magnitudes
    const minMag = 1;
    const maxMag = 7;
    const minColor = [255, 255, 0]; // Yellow (should match getFillColor)
    const maxColor = [255, 0, 0]; // #FF0000 (should match getFillColor)

    magnitudeValues.forEach(magnitude => {
      // Calculate color for the magnitude (using the same interpolation logic)
      const normalizedMagnitude = Math.max(0, Math.min(1, (magnitude - minMag) / (maxMag - minMag)));
      const r = minColor[0] + normalizedMagnitude * (maxColor[0] - minColor[0]);
      const g = minColor[1] + normalizedMagnitude * (maxColor[1] - minColor[1]);
      const b = minColor[2] + normalizedMagnitude * (maxColor[2] - minColor[2]);
      const color = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;

      // Create legend item element
      const legendItem = document.createElement('div');
      legendItem.classList.add('legend-item');

      // Create color swatch
      const colorSwatch = document.createElement('div');
      colorSwatch.classList.add('legend-color');
      colorSwatch.style.backgroundColor = color;

      // Create label
      const label = document.createElement('span');
      label.textContent = `${magnitude}`; // Adjust label format as needed

      // Append color swatch and label to legend item
      legendItem.appendChild(colorSwatch);
      legendItem.appendChild(label);

      // Append legend item to legend container
      legendContainer.appendChild(legendItem);
    });
  }
}

initMap()
