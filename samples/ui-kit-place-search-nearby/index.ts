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
let infoWindow

let AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement
let LatLngBounds: typeof google.maps.LatLngBounds

// The init function is called when the page loads.
async function init(): Promise<void> {
    // Import the necessary libraries from the Google Maps API.
    const { InfoWindow } = (await google.maps.importLibrary(
        'maps'
    )) as google.maps.MapsLibrary
    await google.maps.importLibrary('places')
    const markerLib = (await google.maps.importLibrary(
        'marker'
    )) as google.maps.MarkerLibrary
    const coreLib = (await google.maps.importLibrary(
        'core'
    )) as google.maps.CoreLibrary

    AdvancedMarkerElement = markerLib.AdvancedMarkerElement
    LatLngBounds = coreLib.LatLngBounds

    // Create a new info window and set its content to the place details element.
    infoWindow = new InfoWindow({
        content: placeDetails,
        ariaLabel: 'Place Details',
        headerDisabled: true,
        pixelOffset: { width: 0, height: -40 } as google.maps.Size,
    })

    // Set the map options.
    map.innerMap.setOptions({
        clickableIcons: false,
        mapTypeControl: false,
        streetViewControl: false,
    })

    // Add a click listener to the map to hide the info window when the map is clicked.
    map.innerMap.addListener('click', () => {
        hideInfoWindow()
    })
    /* [START maps_ui_kit_place_search_nearby_event] */
    // Add event listeners to the type select and place search elements.
    typeSelect.addEventListener('change', searchPlaces)

    placeSearch.addEventListener('gmp-select', (event: Event) => {
        const { place } = event as any
        if (markers.has(place.id)) {
            markers.get(place.id)!.click()
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
    // Get the map bounds and center.
    const bounds = map.innerMap.getBounds()!
    const cent = map.innerMap.getCenter()!
    const ne = bounds.getNorthEast()
    const sw = bounds.getSouthWest()
    // Calculate the diameter of the map bounds and cap the radius at 50000.
    const diameter = google.maps.geometry.spherical.computeDistanceBetween(
        ne,
        sw
    )
    const cappedRadius = Math.min(diameter / 2, 50000) // Radius cannot be more than 50000.

    // Close the info window and clear the markers.
    infoWindow.close()

    for (const marker of markers.values()) {
        marker.map = null
    }
    markers.clear()

    // Set the place search query and add an event listener to the place search element.
    if (typeSelect.value) {
        // map.style.height = '75vh';
        placeSearch.style.visibility = 'visible'
        placeSearchQuery.maxResultCount = 10
        placeSearchQuery.locationRestriction = {
            center: { lat: cent.lat(), lng: cent.lng() },
            radius: cappedRadius,
        }
        placeSearchQuery.includedTypes = [typeSelect.value]
        placeSearch.addEventListener('gmp-load', () => addMarkers(), {
            once: true,
        })
    }
}

// The addMarkers function is called when the place search element loads.
async function addMarkers() {
    // Create a new LatLngBounds object and make the place search element visible.
    const bounds = new LatLngBounds()
    placeSearch.style.visibility = 'visible'

    // Iterate over the places and create a marker for each place.
    if (placeSearch.places.length > 0) {
        placeSearch.places.forEach((place) => {
            const marker = new AdvancedMarkerElement({
                map: map.innerMap,
                position: place.location,
                collisionBehavior:
                    google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL,
            })

            // Add the marker to the markers map and extend the bounds.
            markers.set(place.id, marker)
            bounds.extend(place.location)

            /* [START maps_ui_kit_place_search_nearby_click_event] */
            // Add a click listener to the marker to show the info window.
            marker.addListener('click', () => {
                if (place.viewport) {
                    map.innerMap.fitBounds(place.viewport)
                } else {
                    map.innerMap.panTo(place.location)
                    map.innerMap.setZoom(18)
                }
                placeRequest.place = place
                infoWindow.setPosition(place.location)
                placeDetails.style.visibility = 'visible' // Ensure place details are visible
                infoWindow.open(map.innerMap)
            })
            /* [END maps_ui_kit_place_search_nearby_click_event] */
        })
        // Set the map center and fit the bounds.
        map.innerMap.setCenter(bounds.getCenter())
        map.innerMap.fitBounds(bounds)
    }
}

// The hideInfoWindow function is called when the user clicks on the map.
function hideInfoWindow() {
    infoWindow.close()
    placeDetails.style.visibility = 'hidden'
}

init()
/* [END maps_ui_kit_place_search_nearby] */
