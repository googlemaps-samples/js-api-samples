"use strict";
/**
 * @license
 * Copyright 2024 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

const mapElement = document.querySelector('gmp-map');
let innerMap;
const advancedMarkerElement = document.querySelector('gmp-advanced-marker');
let center;
let typeSelect;
let infoWindow;
async function initMap() {
    const { Map, InfoWindow } = await google.maps.importLibrary('maps');
    const { LatLng } = await google.maps.importLibrary("core");
    innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
    });
    typeSelect = document.querySelector(".type-select");
    typeSelect.addEventListener('change', () => {
        nearbySearch();
    });
    infoWindow = new InfoWindow();
    // Kick off an initial search once map has loaded.
    google.maps.event.addListenerOnce(innerMap, 'idle', () => {
        nearbySearch();
    });
}
async function nearbySearch() {
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary('places');
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { spherical } = await google.maps.importLibrary('geometry');
    
    // Get bounds and radius to constrain search.
    center = mapElement.center;
    let bounds = innerMap.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const diameter = spherical.computeDistanceBetween(ne, sw);
    const radius = Math.min((diameter / 2), 50000); // Radius cannot be more than 50000.
    const request = {
        // required parameters
        fields: ['displayName', 'location', 'formattedAddress', 'googleMapsURI'],
        locationRestriction: {
            center,
            radius,
        },
        // optional parameters
        includedPrimaryTypes: [typeSelect.value],
        maxResultCount: 5,
        rankPreference: SearchNearbyRankPreference.POPULARITY,
    };
    const { places } = await Place.searchNearby(request);
    
    if (places.length) {
        const { LatLngBounds } = await google.maps.importLibrary("core");
        const bounds = new LatLngBounds();
        // First remove all existing markers.
        for (const marker of mapElement.querySelectorAll('gmp-advanced-marker'))
            marker.remove();
        // Loop through and get all the results.
        places.forEach(place => {
            if (!place.location)
                return;
            bounds.extend(place.location);
            const marker = new AdvancedMarkerElement({
                map: innerMap,
                position: place.location,
                title: place.displayName,
            });
            // Build the content of the InfoWindow safely using DOM elements.
            const content = document.createElement('div');
            const address = document.createElement('div');
            address.textContent = place.formattedAddress || '';
            const placeId = document.createElement('div');
            placeId.textContent = place.id;
            content.append(address, placeId);
            if (place.googleMapsURI) {
                const link = document.createElement('a');
                link.href = place.googleMapsURI;
                link.target = '_blank';
                link.textContent = 'View Details on Google Maps';
                content.appendChild(link);
            }
            marker.addListener('gmp-click', () => {
                innerMap.panTo(place.location);
                updateInfoWindow(place.displayName, content, marker);
            });
        });
        innerMap.fitBounds(bounds, 100);
    }
    else {
        console.log('No results');
    }
}
function updateInfoWindow(title, content, anchor) {
    infoWindow.setContent(content);
    infoWindow.setHeaderContent(title);
    infoWindow.open({
        anchor,
    });
}
initMap();

