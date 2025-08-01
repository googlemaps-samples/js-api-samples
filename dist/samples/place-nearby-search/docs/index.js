"use strict";
/**
 * @license
 * Copyright 2024 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_place_nearby_search]
let map;
async function initMap() {
    const { Map, InfoWindow } = await google.maps.importLibrary('maps');
    let center = new google.maps.LatLng(52.369358, 4.889258);
    map = new Map(document.getElementById('map'), {
        center: center,
        zoom: 11,
        mapId: 'DEMO_MAP_ID',
        mapTypeControl: false,
    });
    nearbySearch();
}
async function nearbySearch() {
    //@ts-ignore
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary('places');
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    // [START maps_place_nearby_search_request]
    // Restrict within the map viewport.
    let center = new google.maps.LatLng(52.369358, 4.889258);
    const request = {
        // required parameters
        fields: ['displayName', 'location', 'businessStatus'],
        locationRestriction: {
            center: center,
            radius: 500,
        },
        // optional parameters
        includedPrimaryTypes: ['restaurant'],
        maxResultCount: 5,
        rankPreference: SearchNearbyRankPreference.POPULARITY,
        language: 'en-US',
        region: 'us',
    };
    //@ts-ignore
    const { places } = await Place.searchNearby(request);
    // [END maps_place_nearby_search_request]
    if (places.length) {
        console.log(places);
        const { LatLngBounds } = await google.maps.importLibrary("core");
        const bounds = new LatLngBounds();
        // Loop through and get all the results.
        places.forEach((place) => {
            const markerView = new AdvancedMarkerElement({
                map,
                position: place.location,
                title: place.displayName,
            });
            bounds.extend(place.location);
            console.log(place);
        });
        map.fitBounds(bounds);
    }
    else {
        console.log("No results");
    }
}
initMap();
// [END maps_place_nearby_search]
