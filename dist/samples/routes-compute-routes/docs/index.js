"use strict";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_routes_compute_routes]
let markers = [];
let polylines = [];
let waypointInfoWindow = null;
const originAutocompleteSelection = {
    predictionText: null,
    location: null,
};
const destinationAUtocompleteSelection = {
    predictionText: null,
    location: null,
};
async function init() {
    const [{ InfoWindow }, { AdvancedMarkerElement }, 
    //@ts-ignore
    { PlaceAutocompleteElement }, 
    //@ts-ignore
    { ComputeRoutesExtraComputation, ReferenceRoute, Route, RouteLabel },] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('places'),
        google.maps.importLibrary('routes'),
    ]);
    const map = document.getElementById('map');
    attachSubmitListener();
    initializeLocationInputs();
    attachMapClickListener();
    attachTravelModeListener();
    attachAlertWindowListener();
    attachDepartureTimeListener();
    function attachSubmitListener() {
        const computeRoutesForm = document.getElementById('compute-routes-form');
        computeRoutesForm.addEventListener('submit', (event) => {
            event.preventDefault();
            sendRequest(new FormData(computeRoutesForm));
        });
    }
    async function sendRequest(formData) {
        clearMap();
        try {
            const { routes } = await Route.computeRoutes(buildComputeRoutesJsRequest(formData));
            if (!routes) {
                console.log('No routes returned.');
                return;
            }
            console.log('Routes:');
            routes.forEach((route) => {
                console.log(route.toJSON());
            });
            await Promise.all(routes.map((route) => drawRoute(route, !!route.routeLabels?.includes(RouteLabel.DEFAULT_ROUTE))));
        }
        catch (error) {
            console.error(error);
            setErrorMessage(error.message || 'Unknown error.');
        }
    }
    function buildComputeRoutesJsRequest(formData) {
        const travelMode = formData.get('travel_mode') === ''
            ? undefined
            : formData.get('travel_mode');
        //@ts-ignore
        const extraComputations = [];
        //@ts-ignore
        const requestedReferenceRoutes = [];
        //@ts-ignore
        const transitPreference = {};
        const request = {
            origin: {
                location: buildComputeRoutesLocation(originAutocompleteSelection, formData.get('origin_location'), formData.get('heading_org'), travelMode),
                vehicleStopover: formData.get('origin_stopover') === 'on',
                sideOfRoad: formData.get('origin_side_of_road') === 'on',
            },
            destination: {
                location: buildComputeRoutesLocation(destinationAUtocompleteSelection, formData.get('destination_location'), formData.get('heading_dest'), travelMode),
                vehicleStopover: formData.get('destination_stopover') === 'on',
                sideOfRoad: formData.get('destination_side_of_road') === 'on',
            },
            fields: Array.from(document.querySelectorAll('ul#fields li input[type="checkbox"]:checked'), (input) => input.value),
            travelMode: travelMode,
            routingPreference: formData.get('routing_preference') === ''
                ? undefined
                : formData.get('routing_preference'),
            polylineQuality: formData.get('polyline_quality') === ''
                ? undefined
                : formData.get('polyline_quality'),
            computeAlternativeRoutes: formData.get('compute_alternative_routes') === 'on',
            routeModifiers: {
                avoidTolls: formData.get('avoid_tolls') === 'on',
                avoidHighways: formData.get('avoid_highways') === 'on',
                avoidFerries: formData.get('avoid_ferries') === 'on',
                avoidIndoor: formData.get('avoid_indoor') === 'on',
            },
            departureTime: formData.get('departure_time') === ''
                ? undefined
                : new Date(formData.get('departure_time')),
            extraComputations,
            requestedReferenceRoutes,
            transitPreference,
        };
        if (formData.get('traffic_aware_polyline') === 'on') {
            extraComputations.push(ComputeRoutesExtraComputation.TRAFFIC_ON_POLYLINE);
        }
        if (formData.get('shorter_distance') === 'on') {
            requestedReferenceRoutes.push(ReferenceRoute.SHORTER_DISTANCE);
        }
        if (formData.get('eco_routes') === 'on') {
            requestedReferenceRoutes.push(ReferenceRoute.FUEL_EFFICIENT);
            extraComputations.push(ComputeRoutesExtraComputation.FUEL_CONSUMPTION);
            //@ts-ignore
            request.routeModifiers.vehicleInfo = {
                emissionType: formData.get('emission_type'),
            };
        }
        if (travelMode === google.maps.TravelMode.TRANSIT) {
            const selectedTransitModes = document.querySelectorAll('ul#transitModes li input[type="checkbox"]:checked');
            transitPreference.allowedTransitModes = Array.from(selectedTransitModes, (input) => input.value);
            transitPreference.routingPreference =
                formData.get('transit_preference') === ''
                    ? undefined
                    : formData.get('transit_preference');
        }
        return request;
    }
    function buildComputeRoutesLocation(autocompleteSelection, locationInput, headingInput, travelModeInput) {
        if (!locationInput) {
            throw new Error('Location is required.');
        }
        const latLngRegex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
        const location = locationInput;
        const heading = headingInput && travelModeInput !== 'TRANSIT'
            ? Number(headingInput)
            : undefined;
        if (autocompleteSelection.predictionText === location &&
            autocompleteSelection.location) {
            // Use the lat/lng from the autocomplete selection if the current input
            // matches the autocomplete prediction text
            return {
                lat: autocompleteSelection.location.lat(),
                lng: autocompleteSelection.location.lng(),
                altitude: 0,
                heading,
            };
        }
        else if (latLngRegex.test(location)) {
            // If the current input looks like a lat/lng, format it as a
            // google.maps.routes.DirectionalLocationLiteral
            return {
                lat: Number(location.split(',')[0]),
                lng: Number(location.split(',')[1]),
                altitude: 0,
                heading,
            };
        }
        // Otherwise return the input location string
        return location;
    }
    function setErrorMessage(error) {
        const alertBox = document.getElementById('alert');
        alertBox.querySelector('p').textContent = error;
        alertBox.style.display = 'flex';
    }
    async function drawRoute(
    //@ts-ignore
    route, isPrimaryRoute) {
        polylines = polylines.concat(route.createPolylines({
            polylineOptions: isPrimaryRoute
                ? { map: map.innerMap, zIndex: 1 }
                : {
                    map: map.innerMap,
                    strokeColor: '#669DF6',
                    strokeOpacity: 0.5,
                    strokeWeight: 8,
                },
            colorScheme: map.innerMap.get('colorScheme'),
        }));
        if (isPrimaryRoute) {
            markers = markers.concat(await route.createWaypointAdvancedMarkers({
                map: map.innerMap,
                zIndex: 1,
            }));
            if (route.viewport) {
                map.innerMap.fitBounds(route.viewport);
            }
        }
        addRouteLabel(route, Math.floor(route.path.length / 2));
    }
    //@ts-ignore
    function addRouteLabel(route, index) {
        const routeTag = document.createElement('div');
        routeTag.className = 'route-tag';
        if (route.routeLabels && route.routeLabels.length > 0) {
            const p = document.createElement('p');
            route.routeLabels.forEach((label, i) => {
                if (label.includes(RouteLabel.FUEL_EFFICIENT)) {
                    routeTag.classList.add('eco');
                }
                if (label.includes(RouteLabel.DEFAULT_ROUTE_ALTERNATE)) {
                    routeTag.classList.add('alternate');
                }
                if (label.includes(RouteLabel.SHORTER_DISTANCE)) {
                    routeTag.classList.add('shorter-distance');
                }
                p.appendChild(document.createTextNode(label));
                if (i < route.routeLabels.length - 1) {
                    p.appendChild(document.createElement('br'));
                }
            });
            routeTag.appendChild(p);
        }
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'details';
        if (route.localizedValues) {
            const distanceP = document.createElement('p');
            distanceP.textContent = `Distance: ${route.localizedValues.distance}`;
            detailsDiv.appendChild(distanceP);
            const durationP = document.createElement('p');
            durationP.textContent = `Duration: ${route.localizedValues.duration}`;
            detailsDiv.appendChild(durationP);
        }
        if (route.travelAdvisory?.fuelConsumptionMicroliters) {
            const fuelP = document.createElement('p');
            fuelP.textContent = `Fuel consumption: ${(route.travelAdvisory.fuelConsumptionMicroliters / 1e6).toFixed(2)} L`;
            detailsDiv.appendChild(fuelP);
        }
        routeTag.appendChild(detailsDiv);
        const marker = new AdvancedMarkerElement({
            map: map.innerMap,
            position: route.path[index],
            content: routeTag,
            zIndex: route.routeLabels?.includes(RouteLabel.DEFAULT_ROUTE)
                ? 1
                : undefined,
        });
        markers.push(marker);
    }
    function clearMap() {
        markers.forEach((marker) => {
            marker.map = null;
        });
        markers.length = 0;
        polylines.forEach((polyline) => {
            polyline.setMap(null);
        });
        polylines.length = 0;
    }
    function attachMapClickListener() {
        if (!map || !map.innerMap) {
            return;
        }
        let infoWindowAlert = document.getElementById('infowindow-alert');
        if (!infoWindowAlert) {
            infoWindowAlert = document.createElement('div');
            infoWindowAlert.id = infoWindowAlert.className = 'infowindow-alert';
            infoWindowAlert.textContent = 'Lat/Lng are copied to clipboard';
        }
        const infoWindow = new InfoWindow();
        let closeWindowTimeout;
        map.innerMap.addListener('click', async (mapsMouseEvent) => {
            if (!mapsMouseEvent.latLng) {
                return;
            }
            infoWindow.close();
            if (closeWindowTimeout) {
                clearTimeout(closeWindowTimeout);
            }
            infoWindow.setContent(infoWindowAlert);
            infoWindow.setPosition({
                lat: mapsMouseEvent.latLng.lat(),
                lng: mapsMouseEvent.latLng.lng(),
            });
            await navigator.clipboard.writeText(`${mapsMouseEvent.latLng.lat()},${mapsMouseEvent.latLng.lng()}`);
            infoWindow.open(map.innerMap);
            closeWindowTimeout = window.setTimeout(() => {
                infoWindow.close();
            }, 2000);
        });
    }
    function attachTravelModeListener() {
        const travelMode = document.getElementById('travel-mode');
        const routingPreference = document.getElementById('routing-preference');
        const trafficAwarePolyline = document.getElementById('traffic-aware-polyline');
        const ecoRoutes = document.getElementById('eco-routes');
        const emissionType = document.getElementById('emission-type');
        travelMode.addEventListener('change', () => {
            // Toggle the Routing Preference selection and Traffic Aware Polyline
            // selection for WALKING, BICYCLING, and TRANSIT modes.
            if (travelMode.value === 'WALKING' ||
                travelMode.value === 'BICYCLING' ||
                travelMode.value === 'TRANSIT') {
                routingPreference.disabled = true;
                routingPreference.value = '';
            }
            else {
                routingPreference.disabled = false;
                routingPreference.value = routingPreference.value || 'TRAFFIC_UNAWARE';
            }
            toggleTrafficAwarePolyline();
            // Toggle transit options for Transit mode
            document.getElementById('transit-options').style.display = travelMode.value === 'TRANSIT' ? 'flex' : 'none';
        });
        routingPreference.addEventListener('change', () => {
            toggleTrafficAwarePolyline();
        });
        ecoRoutes.addEventListener('change', () => {
            if (ecoRoutes.checked) {
                emissionType.disabled = false;
            }
            else {
                emissionType.disabled = true;
            }
        });
        function toggleTrafficAwarePolyline() {
            if (!routingPreference.value ||
                routingPreference.value === 'TRAFFIC_UNAWARE') {
                trafficAwarePolyline.checked = false;
                trafficAwarePolyline.disabled = true;
            }
            else {
                trafficAwarePolyline.disabled = false;
            }
        }
    }
    function attachAlertWindowListener() {
        const alertBox = document.getElementById('alert');
        const closeBtn = alertBox.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            if (alertBox.style.display !== 'none') {
                alertBox.style.display = 'none';
            }
        });
    }
    function initializeLocationInputs() {
        const originAutocomplete = new PlaceAutocompleteElement({
            name: 'origin_location',
        });
        const destinationAutocomplete = new PlaceAutocompleteElement({
            name: 'destination_location',
        });
        [
            [originAutocomplete, originAutocompleteSelection],
            [destinationAutocomplete, destinationAUtocompleteSelection],
        ].forEach(([autocomplete, autocompleteData]) => {
            autocomplete.addEventListener('gmp-select', 
            //@ts-ignore
            async (event) => {
                autocompleteData.predictionText = event.placePrediction.text.text;
                const place = event.placePrediction.toPlace();
                await place.fetchFields({
                    fields: ['location'],
                });
                autocompleteData.location = place.location;
            });
        });
        document.getElementById('origin-input')?.appendChild(originAutocomplete);
        document
            .getElementById('destination-input')
            ?.appendChild(destinationAutocomplete);
    }
    function attachDepartureTimeListener() {
        const departureTime = document.getElementById('departure-time');
        const utcOutput = document.getElementById('utc-output');
        departureTime.addEventListener('change', () => {
            utcOutput.textContent = `UTC time: ${new Date(departureTime.value).toUTCString()}`;
        });
    }
}
window.addEventListener('load', init);
// [END maps_routes_compute_routes]
