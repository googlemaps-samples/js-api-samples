/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/
// [START maps_place_text_search]
let map;
let center;
async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    center = { lat: 37.4161493, lng: -122.0812166 };
    map = new Map(document.getElementById('map'), {
        center: center,
        zoom: 11,
        mapId: 'DEMO_MAP_ID',
    });
    findPlaces();
}
async function findPlaces() {
    const { Place } = await google.maps.importLibrary("places");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    // [START maps_place_text_search_request]
    const request = {
        textQuery: 'Tacos in Mountain View',
        fields: ['displayName', 'location', 'businessStatus'],
        includedType: 'restaurant',
        locationBias: { lat: 37.4161493, lng: -122.0812166 },
        isOpenNow: true,
        language: 'en-US',
        maxResultCount: 8,
        minRating: 3.2,
        region: 'us',
        useStrictTypeFiltering: false,
    };
    //@ts-ignore
    const { places } = await Place.searchByText(request);
    // [END maps_place_text_search_request]
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
        console.log('No results');
    }
}
initMap();
export {};
