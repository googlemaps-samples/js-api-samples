/**
 * @license
 * Copyright 2024 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_place_nearby_search]
const mapElement = document.querySelector('gmp-map') as any;
let map;
const advancedMarkerElement = document.querySelector('gmp-advanced-marker') as any;
let center;
let typeSelect;
let markers = {};
let infoWindow;

async function initMap() {
    const { Map, InfoWindow } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;
    const {LatLng} = await google.maps.importLibrary("core") as google.maps.CoreLibrary;

    center = new LatLng(45.438646, 12.327573); // Venice, Italy

    map = await mapElement.innerMap;
    map.setOptions ({
        mapTypeControl: false,
    });

    typeSelect = document.querySelector(".type-select");

    typeSelect.addEventListener('change', () => {
        nearbySearch();
    });

    infoWindow = new InfoWindow();
}

async function nearbySearch() {
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary;
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    const { spherical } = await google.maps.importLibrary('geometry') as google.maps.GeometryLibrary;
    // [START maps_place_nearby_search_request]
    // Get bounds and radius to constrain search.
    
    center = map.getCenter();
    let bounds = map.getBounds();
    let ne = bounds.getNorthEast();
    let sw = bounds.getSouthWest();
    let diameter = spherical.computeDistanceBetween(ne, sw);
    let radius = Math.min((diameter / 2 ), 50000); // Radius cannot be more than 50000.

    const request = {
        // required parameters
        fields: ['displayName', 'location', 'formattedAddress', 'googleMapsLinks'],
        locationRestriction: {
            center,
            radius,
        },
        // optional parameters
        includedPrimaryTypes: [typeSelect.value],
        maxResultCount: 5,
        rankPreference: SearchNearbyRankPreference.POPULARITY,
        language: 'en-US',
        region: 'us',
    };

    const { places } = await Place.searchNearby(request);
    // [END maps_place_nearby_search_request]

    if (places.length) {
        const { LatLngBounds } = await google.maps.importLibrary("core") as google.maps.CoreLibrary;
        const bounds = new LatLngBounds();

        // First remove all existing markers.
        for (const id in markers) {
            markers[id].map = null;
        };
        markers = {};
        
        // Loop through and get all the results.
        places.forEach(place => {
            const marker = new AdvancedMarkerElement({
                map,
                position: place.location,
                title: place.displayName,
            });
            markers[place.id] = marker;

           //@ts-expect-error
           let content = `${place.formattedAddress}<br/>${place.id}<br/><a href="${place.googleMapsLinks.placeURI}">View Details on Google Maps</a>`;

            marker.addListener('gmp-click', () => {
                map.panTo(place.location);
                updateInfoWindow(place.displayName, content, marker);
            });

            if (place.location != null) {
                bounds.extend(place.location);
            }
        });

        map.fitBounds(bounds);

    } else {
        console.log('No results');
    }

    async function updateInfoWindow(title, content, anchor) {
        infoWindow.setContent(content);
        infoWindow.setHeaderContent(title);
        infoWindow.open({
            map,
            anchor,
            shouldFocus: false,
        });
    }
}

initMap();
// [END maps_place_nearby_search]
