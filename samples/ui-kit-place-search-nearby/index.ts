/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_place_search_nearby] */

/* [START maps_ui_kit_place_search_nearby_query_selectors] */
// Query selectors for various elements in the HTML file.
const map = document.querySelector('gmp-map') as google.maps.MapElement
const placeSearch = document.querySelector('gmp-place-search') as any
const placeSearchQuery = document.querySelector(
    'gmp-place-nearby-search-request'
) as any
const placeDetails = document.querySelector('gmp-place-details-compact') as any
const placeRequest = document.querySelector(
    'gmp-place-details-place-request'
) as any
const typeSelect = document.querySelector('.type-select') as HTMLSelectElement
/* [END maps_ui_kit_place_search_nearby_query_selectors] */

// Global variables for the map, markers, and info window.
const markers: Map<string, google.maps.marker.AdvancedMarkerElement> = new Map()
let infoWindow: google.maps.InfoWindow
let AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement
let LatLngBounds: typeof google.maps.LatLngBounds

// The init function is called when the page loads.
async function init(): Promise<void> {
    // Import the necessary libraries from the Google Maps API.
    const [{ InfoWindow }, { Place }, markerLib, coreLib] = await Promise.all([
        google.maps.importLibrary('maps') as Promise<google.maps.MapsLibrary>,
        google.maps.importLibrary(
            'places'
        ) as Promise<google.maps.PlacesLibrary>,
        google.maps.importLibrary(
            'marker'
        ) as Promise<google.maps.MarkerLibrary>,
        google.maps.importLibrary('core') as Promise<google.maps.CoreLibrary>,
    ])

    AdvancedMarkerElement = markerLib.AdvancedMarkerElement
    LatLngBounds = coreLib.LatLngBounds

    // Create a new info window and set its content to the place details element.
    infoWindow = new InfoWindow({
        content: placeDetails,
        ariaLabel: 'Place Details',
        headerDisabled: true,
        pixelOffset: new google.maps.Size(0, -40),
    })

    // Set the map options.
    map.innerMap.setOptions({
        clickableIcons: false,
        mapTypeControl: false,
        streetViewControl: false,
    })

    // Add a click listener to the map to hide the info window when the map is clicked.
    map.innerMap.addListener('click', () => infoWindow.close())
    /* [START maps_ui_kit_place_search_nearby_event] */
    // Add event listeners to the type select and place search elements.
    typeSelect.addEventListener('change', searchPlaces)

    placeSearch.addEventListener('gmp-select', (event: Event) => {
        const { place } = event as any
        if (markers.has(place.id)) {
            markers.get(place.id)!.click()
        }
        if (place.location) {
            map.innerMap.setCenter(place.location)
        }
    })
    placeSearch.addEventListener(
        'gmp-load',
        () => {
            searchPlaces()
        },
        { once: true }
    )
}
/* [END maps_ui_kit_place_search_nearby_event] */
// The searchPlaces function is called when the user changes the type select or when the page loads.
function searchPlaces() {
    // Close the info window and clear the markers.
    infoWindow.close()
    for (const marker of markers.values()) {
        marker.map = null
    }
    markers.clear()

    // Set the place search query and add an event listener to the place search element.
    if (typeSelect.value) {
        const center = map.innerMap.getCenter()!
        placeSearchQuery.maxResultCount = 5
        placeSearchQuery.locationRestriction = {
            center: { lat: center.lat(), lng: center.lng() },
            radius: 50000, // 50km radius
        }
        placeSearchQuery.locationBias = {
            center: { lat: center.lat(), lng: center.lng() },
        }
        placeSearchQuery.includedTypes = [typeSelect.value]
        placeSearch.addEventListener('gmp-load', addMarkers, { once: true })
    }
}

// The addMarkers function is called when the place search element loads.
async function addMarkers() {
    const bounds = new LatLngBounds()

    if (placeSearch.places.length === 0) {
        return
    }

    placeSearch.places.forEach((place) => {
        const marker = new AdvancedMarkerElement({
            map: map.innerMap,
            position: place.location,
            collisionBehavior:
                google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL,
        })

        markers.set(place.id, marker)
        bounds.extend(place.location)

        marker.addListener('click', () => {
            if (place.location) {
                map.innerMap.setCenter(place.location)
            }
            placeRequest.place = place
            infoWindow.setPosition(place.location)
            infoWindow.open(map.innerMap)
        })
    })

    map.innerMap.fitBounds(bounds)
}

init()
/* [END maps_ui_kit_place_search_nearby] */
