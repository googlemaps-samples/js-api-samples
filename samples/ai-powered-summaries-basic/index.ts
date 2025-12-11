/**
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_ai_powered_summaries_basic]
const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;
let innerMap;
let infoWindow;

async function initMap() {
    const { Map, InfoWindow } = (await google.maps.importLibrary(
        'maps'
    )) as google.maps.MapsLibrary;

    innerMap = mapElement.innerMap;
    infoWindow = new InfoWindow();
    getPlaceDetails();
}

async function getPlaceDetails() {
    // Request needed libraries.
    const [ {AdvancedMarkerElement}, { Place } ] = await Promise.all([
        google.maps.importLibrary('marker') as Promise<google.maps.MarkerLibrary>,
        google.maps.importLibrary('places') as Promise<google.maps.PlacesLibrary>,
    ]);

    // [START maps_ai_powered_summaries_basic_placeid]
    // Use place ID to create a new Place instance.
    const place = new Place({
        id: 'ChIJzzc-aWUM3IARPOQr9sA6vfY', // San Diego Botanic Garden
    });
    // [END maps_ai_powered_summaries_basic_placeid]

    // Call fetchFields, passing the needed data fields.
    // [START maps_ai_powered_summaries_basic_fetchfields]
    await place.fetchFields({
        fields: [
            'displayName',
            'formattedAddress',
            'location',
            'generativeSummary',
        ],
    });
    // [END maps_ai_powered_summaries_basic_fetchfields]

    // Add an Advanced Marker
    const marker = new AdvancedMarkerElement({
        map: innerMap,
        position: place.location,
        title: place.displayName,
    });

    // Create a content container.
    const content = document.createElement('div');
    // Populate the container with data.
    const address = document.createElement('div');
    const summary = document.createElement('div');
    const lineBreak = document.createElement('br');

    // Retrieve the summary text and disclosure text.
    //@ts-ignore
    let overviewText = place.generativeSummary.overview ?? 'No summary is available.';
    //@ts-ignore
    let disclosureText = place.generativeSummary.disclosureText ?? '';

    address.textContent = place.formattedAddress ?? '';
    summary.textContent = `${overviewText} [${disclosureText}]`;
    content.append(address, lineBreak, summary);;

    innerMap.setCenter(place.location);

    // Display an info window.
    infoWindow.setHeaderContent(place.displayName);
    infoWindow.setContent(content);
    infoWindow.open({
        anchor: marker,
    });
}

initMap();
// [END maps_ai_powered_summaries_basic]
