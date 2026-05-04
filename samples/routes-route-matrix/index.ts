/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_routes_route_matrix]
// Initialize and add the map.
let map;
let markers: google.maps.marker.AdvancedMarkerElement[] = [];
let center = { lat: 51.55, lng: -1.8 };

async function initMap(): Promise<void> {
    //  Request the needed libraries.
    const [
        { Map },
        { Place },
        { AdvancedMarkerElement, PinElement },
        { RouteMatrix },
    ] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('places'),
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('routes'),
    ]);

    const bounds = new google.maps.LatLngBounds();

    map = new Map(document.getElementById('map') as HTMLElement, {
        zoom: 8,
        center: center,
        mapId: 'DEMO_MAP_ID',
    });

    // Build the request using Place instances.
    const origin1 = new Place({
        id: 'ChIJ83WZp86p2EcRbMrkYqGncBQ', // Greenwich, London, UK
    });
    const origin2 = new Place({
        id: 'ChIJCSkVvleJc0gR8HHaTGpajKc', // Southampton, UK
    });
    const destinationA = new Place({
        id: 'ChIJYdizgWaDcUgRH9eaSy6y5I4', // Bristol, UK
    });
    const destinationB = new Place({
        id: 'ChIJ9VPsNNQCbkgRDmeGZdsGNBQ', // Cardiff, UK
    });

    await Promise.all([
        origin1.fetchFields({ fields: ['location', 'displayName'] }),
        origin2.fetchFields({ fields: ['location', 'displayName'] }),
        destinationA.fetchFields({ fields: ['location', 'displayName'] }),
        destinationB.fetchFields({ fields: ['location', 'displayName'] }),
    ]);

    // [START maps_routes_route_matrix_request]
    const destinations = [destinationA, destinationB];
    const origins = [origin1, origin2];
    const request: google.maps.routes.ComputeRouteMatrixRequest = {
        origins,
        destinations,
        travelMode: 'DRIVING',
        units: google.maps.UnitSystem.METRIC,
        fields: ['distanceMeters', 'durationMillis', 'condition'],
    };
    // [END maps_routes_route_matrix_request]

    // Show the request.
    (document.getElementById('request') as HTMLDivElement).innerText =
        JSON.stringify(request, null, 2);

    // Get the RouteMatrix response.
    const response = await RouteMatrix.computeRouteMatrix(request);

    // Show the response.
    (document.getElementById('response') as HTMLDivElement).innerText =
        JSON.stringify(response, null, 2);

    // Add markers for the origins.
    for (const origin of origins) {
        if (origin.location) {
            const pin = new PinElement({
                glyphText: 'O',
                glyphColor: 'white',
                background: '#137333',
                borderColor: 'white',
            });
            const marker = new AdvancedMarkerElement({
                map,
                position: origin.location,
                title: `Origin: ${origin.displayName}`,
            });
            marker.append(pin);
            markers.push(marker);
            bounds.extend(origin.location);
        }
    }

    // Add markers for the destinations.
    for (let i = 0; i < destinations.length; i++) {
        const destination = destinations[i];
        if (destination.location) {
            const pin = new PinElement({
                glyphText: 'D',
                glyphColor: 'white',
                background: '#C5221F',
                borderColor: 'white',
            });

            const marker = new AdvancedMarkerElement({
                map,
                position: destination.location,
                content: pin.element,
                title: `Destination: ${destination.displayName}`,
            });

            markers.push(marker);
            bounds.extend(destination.location);
        }
    }

    // Fit the map to the bounds of all markers.
    map.fitBounds(bounds);
}

initMap();
// [END maps_routes_route_matrix]
