/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// Import necessary loader
import { registerLoaders, } from '@loaders.gl/core';
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
  class IconLayer {
    constructor(props: any);
    props: any;
    clone(props: any): IconLayer;
    pickable: boolean;
    getPosition: (d: any) => number[];
    getIcon: (d: any) => any;
    getSize: (d: any) => number;
    sizeScale: number;
    parameters: any;
  }
  // Add other Deck.gl types used globally if needed
}

// [START maps_add_map_deckgl_kml_raster]
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
  const position = { lat: 37.4239163, lng: -122.0949638 }; // Estimated center for westcampus.kml

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
    zoom: 17, // Adjusted zoom for the new KML data
    center: position,
    // mapId: '6a17c323f461e521', // Replace with your Map ID
    mapId: '6a17c323f461e521',
    zoomControl:true,
    clickableIcons: false, // Disable clicks on base map POIs
  });
 // [END maps_add_map_deckgl_kml_raster]

 // Deck.gl Layer and Overlay
 geojsonLayer = new deck.GeoJsonLayer({
   id: 'geojson-layer',
   data: './KML_Samples.kml', // https://developers.google.com/maps/documentation/javascript/examples/kml/westcampus.kml
   pickable: true,
   stroked: true, // Set to true to render polygon outlines
   filled: true, // Set to true to render filled polygons
   extruded: false, // Keep as false for 2D polygons
   getFillColor: (d: any) => { // Function to get fill color from properties
     const color = d.properties.color || d.properties.fill; // Try 'color' or 'fill' property
     if (color) {
       // Convert hex or AABBGGRR string to RGBA array
       const rgba = hexOrAabbggrrToRgba(color);
       if (rgba) {
         return rgba;
       }
     }
     return [120, 120, 120, 150]; // Default fill color with some transparency
   },
   getLineColor: (d: any) => { // Function to get line color from properties
     const color = d.properties.color || d.properties.stroke; // Try 'color' or 'stroke' property
     if (color) {
       // Convert hex or AABBGGRR string to RGBA array
       const rgba = hexOrAabbggrrToRgba(color);
       if (rgba) {
         return rgba;
       }
     }
     return [120, 120, 120, 255]; // Default line color
   },
   getLineWidth: (d: any) => d.properties['stroke-width'] || 2, // Get line width from properties or default to 2
   lineWidthMinPixels: 2, // Minimum line width in pixels
   onDataLoad: (data) => {
     console.log('GeoJsonLayer data loaded:', JSON.stringify(data, null, 2));
     // Removed filtering based on visibility
     console.log('GeoJsonLayer data after (no) filtering:', JSON.stringify(data, null, 2));

     // Explicitly set data for iconLayer and textLayer after geojsonLayer loads
     // Note: Directly modifying props is not the standard deck.gl update pattern,
     // but used here for debugging. The standard way is via googleMapsOverlay.setProps({ layers: [...] }).
     if (iconLayer && iconLayer.props) {
       iconLayer.props.data = data;
     }
     if (textLayer && textLayer.props) {
       textLayer.props.data = data;
     }

     if (progress) { // Check if progress is defined
       // Add a small delay to ensure the progress bar is removed
       setTimeout(() => {
         // @ts-ignore
         progress.done(); // hides progress bar
       }, 100); // 100ms delay
     }
   },
   // Optional: Add onHover or onClick handlers for interactivity
   onHover: ({object, x, y}: {object: any, x: number, y: number}) => {
     const tooltip = document.getElementById('tooltip'); // Assuming a tooltip element exists
     if (tooltip && object) {
       let tooltipContent = `<h4>${object.properties.name || 'GeoJSON Feature'}</h4>`;
       // Define a list of common KML properties to display
       const kmlProperties = ['description', 'styleUrl', 'color', 'stroke', 'stroke-width', 'fill'];
       for (const key of kmlProperties) {
         if (object.properties.hasOwnProperty(key) && object.properties[key] !== undefined) {
           tooltipContent += `<p><strong>${key}:</strong> ${object.properties[key]}</p>`;
         }
       }
       tooltip.innerHTML = tooltipContent;
       tooltip.style.left = x + 'px';
       tooltip.style.top = y + 'px';
       tooltip.style.display = 'block';
     } else if (tooltip) {
       tooltip.style.display = 'none';
     }
   }
 });

 // Icon Layer for points with icons
 const iconLayer = new deck.IconLayer({
   id: 'icon-layer',
   data: geojsonLayer.props.data, // Use the same data as the GeoJsonLayer
   pickable: true,
   onDataLoad: (data) => {
     console.log('IconLayer onDataLoad triggered. Data:', JSON.stringify(data, null, 2));
   },
   getPosition: (d: any) => {
     // Check if the feature is a Point and return its coordinates
     if (d.geometry && d.geometry.type === 'Point' && d.geometry.coordinates) {
       return d.geometry.coordinates;
     }
     return null; // Return null for non-Point features
   },
   getIcon: (d: any) => {
     console.log('getIcon called with data:', d); // Log the data object
     // Extract icon information from properties, assuming a structure
     // This might need adjustment based on the actual KML structure
     const iconUrl = d.properties.iconUrl || (d.properties.style && d.properties.style.icon && d.properties.style.icon.href);
     console.log('Extracted iconUrl:', iconUrl); // Log the extracted icon URL
     // Note: Remote icon URLs from KML might be blocked by CORS.
     // If icons don't display, consider using local icons or a proxy.
     if (iconUrl) {
       return {
         url: iconUrl,
         width: 128, // Default icon width
         height: 128, // Default icon height
         anchorY: 128 // Anchor point
       };
     }
     return null; // No icon information found
   },
   getSize: 30, // Size of the icon in pixels
   sizeScale: 1,
   // Disable depth testing for icon layer as well
   parameters: {
     depthTest: false
   }
 });


 // TextLayer might not be needed for this KML, but keeping it for now.
 // We might need to adjust its getPosition logic if the KML doesn't have centroids.
 const textLayer = new deck.TextLayer({
   id: 'text-layer',
   data: geojsonLayer.props.data, // Use the same data as the GeoJsonLayer
   onDataLoad: (data) => {
     console.log('TextLayer onDataLoad triggered. Data:', JSON.stringify(data, null, 2));
   },
   getPosition: (d: any) => {
     // Attempt to use a 'centroid' property if available, otherwise use the first coordinate
     let position = [0, 0]; // Default position
     if (d.properties.centroid) {
       position = d.properties.centroid;
     } else if (d.geometry && d.geometry.coordinates && d.geometry.coordinates.length > 0) {
       // Assuming Polygon or MultiPolygon
       const coordinates = d.geometry.coordinates[0][0];
       if (coordinates && coordinates.length >= 2) {
         position = [coordinates[0], coordinates[1]]; // [lng, lat]
       }
     }
     return position;
   },
   getText: (d: any) => d.properties.name || '', // Display the name property
   getColor: [0, 0, 0, 255], // Black text color for better visibility
   getSize: 16, // Increased text size
   getAngle: 0,
   getTextAnchor: 'middle',
   getAlignmentBaseline: 'middle',
   // Disable depth testing for text layer as well
   parameters: {
     depthTest: false
   }
 });

 googleMapsOverlay = new deck.GoogleMapsOverlay({
   layers: [geojsonLayer, iconLayer, textLayer], // Add both layers
   // Disable depth testing to avoid rendering issues with the base map
   parameters: {
     depthTest: false
   }
 });

 googleMapsOverlay.setMap(map);
}

/**
* Converts a hex color string (#RRGGBB or #AABBGGRR) or an AABBGGRR string to an RGBA array.
* @param color The color string.
* @returns An RGBA array [R, G, B, A] or null if the format is invalid.
*/
function hexOrAabbggrrToRgba(color: string): number[] | null {
 if (color.startsWith('#')) {
   color = color.slice(1);
 }

 if (color.length === 6) {
   // #RRGGBB format
   const r = parseInt(color.substring(0, 2), 16);
   const g = parseInt(color.substring(2, 4), 16);
   const b = parseInt(color.substring(4, 6), 16);
   return [r, g, b, 255]; // Assume full opacity
 } else if (color.length === 8) {
   // #AABBGGRR or AABBGGRR format (KML uses AABBGGRR)
   const a = parseInt(color.substring(0, 2), 16);
   const b = parseInt(color.substring(2, 4), 16);
   const g = parseInt(color.substring(4, 6), 16);
   const r = parseInt(color.substring(6, 8), 16);
   return [r, g, b, a];
 }

 return null; // Invalid format
}

initMap();
// Expose initMap to the global scope
(window as any).initMap = initMap;
