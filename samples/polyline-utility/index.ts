// [START maps_polyline_utility]
let map: google.maps.Map;
let polyline: google.maps.Polyline;
let markers: google.maps.marker.AdvancedMarkerElement[] = [];
let geometryLib: google.maps.GeometryLibrary;
let AdvancedMarkerElementClass: typeof google.maps.marker.AdvancedMarkerElement;
let LatLngClass: typeof google.maps.LatLng;
let LatLngBoundsClass: typeof google.maps.LatLngBounds;

interface Pos {
    lat: number | (() => number);
    lng: number | (() => number);
}

function getLat(p: Pos): number {
    return typeof p.lat === 'function' ? p.lat() : p.lat;
}

function getLng(p: Pos): number {
    return typeof p.lng === 'function' ? p.lng() : p.lng;
}

async function init(): Promise<void> {
    const [
        { Polyline },
        { AdvancedMarkerElement },
        { Autocomplete },
        { LatLng, LatLngBounds },
        geometryLibrary,
    ] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('places'),
        google.maps.importLibrary('core'),
        google.maps.importLibrary('geometry'),
    ]);

    geometryLib = geometryLibrary;
    AdvancedMarkerElementClass = AdvancedMarkerElement;
    LatLngClass = LatLng;
    LatLngBoundsClass = LatLngBounds;

    const mapElement = document.querySelector('gmp-map')!;
    map = mapElement.innerMap;

    // Setup Polyline
    polyline = new Polyline({
        map,
        strokeColor: '#1a73e8',
        strokeOpacity: 0.8,
        strokeWeight: 4,
    });

    // Map Click to Add Point
    map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            addPoint(e.latLng);
        }
    });

    // Setup Places Autocomplete
    const input = document.getElementById('pac-input') as HTMLInputElement;
    const autocomplete = new Autocomplete(input, {
        fields: ['geometry', 'name'],
    });
    autocomplete.bindTo('bounds', map);
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location) {
            const name = place.name ?? '';
            alert(`No details available for input: '${name}'`);
            return;
        }
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
    });

    // Buttons and Textareas
    document
        .getElementById('decode-encoded-btn')!
        .addEventListener('click', decodeEncodedPolyline);
    document
        .getElementById('decode-geojson-btn')!
        .addEventListener('click', decodeGeoJson);
    document
        .getElementById('clear-all-btn')!
        .addEventListener('click', clearAll);
}

function addPoint(latLng: google.maps.LatLng) {
    const path = polyline.getPath();
    path.push(latLng);

    const marker = new AdvancedMarkerElementClass({
        map,
        position: latLng,
        gmpDraggable: true,
    });

    marker.addListener('dragend', () => {
        rebuildPathFromMarkers();
    });

    markers.push(marker);
    updateOutputs();
}

function rebuildPathFromMarkers() {
    const path = polyline.getPath();
    path.clear();
    markers.forEach((m) => {
        if (m.position) {
            const lat = getLat(m.position);
            const lng = getLng(m.position);
            path.push(new LatLngClass(lat, lng));
        }
    });
    updateOutputs();
}

function removePoint(index: number) {
    if (index >= 0 && index < markers.length) {
        markers[index].map = null;
        markers.splice(index, 1);
        rebuildPathFromMarkers();
    }
}

function clearAll() {
    markers.forEach((m) => {
        m.map = null;
    });
    markers = [];
    polyline.getPath().clear();
    updateOutputs();
}

function updateOutputs() {
    const path = polyline.getPath();
    const arr = path.getArray();

    // Encoded Polyline
    const encodedTextarea = document.getElementById(
        'encoded-polyline'
    ) as HTMLTextAreaElement;
    if (arr.length > 0) {
        encodedTextarea.value = geometryLib.encoding.encodePath(path);
    } else {
        encodedTextarea.value = '';
    }

    // GeoJSON
    const geojsonTextarea = document.getElementById(
        'geojson-polyline'
    ) as HTMLTextAreaElement;
    if (arr.length > 0) {
        const coords = arr.map((ll) => {
            const lat = getLat(ll);
            const lng = getLng(ll);
            return [lng, lat];
        });
        geojsonTextarea.value = JSON.stringify(coords);
    } else {
        geojsonTextarea.value = '';
    }

    // List
    const list = document.getElementById('locations-list')!;
    list.innerHTML = '';
    document.getElementById('location-count')!.textContent =
        arr.length.toString();

    arr.forEach((ll, index) => {
        const lat = getLat(ll);
        const lng = getLng(ll);

        const li = document.createElement('li');
        li.textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-point-btn';
        delBtn.innerHTML = '&times;';
        delBtn.title = 'Remove point';
        delBtn.onclick = () => {
            removePoint(index);
        };

        li.appendChild(delBtn);
        list.appendChild(li);
    });
}

function decodeEncodedPolyline() {
    let encoded = (
        document.getElementById('encoded-polyline') as HTMLTextAreaElement
    ).value.trim();
    const unescape = (
        document.getElementById('enableunescape') as HTMLInputElement
    ).checked;

    if (!encoded) return;
    if (unescape) {
        encoded = encoded.replace(/\\\\\\\\/g, '\\\\').replace(/\\\\"/g, '"');
    }

    try {
        const decodedPath = geometryLib.encoding.decodePath(encoded);
        applyDecodedPath(decodedPath);
    } catch {
        alert('Failed to decode polyline string.');
    }
}

function decodeGeoJson() {
    const geojsonStr = (
        document.getElementById('geojson-polyline') as HTMLTextAreaElement
    ).value.trim();
    if (!geojsonStr) return;

    try {
        // We treat the parsed output as `unknown` to strictly validate it.
        const parsed: unknown = JSON.parse(geojsonStr);
        let coordsArray: unknown[] | undefined;

        // Check if it's a Feature or LineString object
        if (parsed && typeof parsed === 'object') {
            const obj = parsed as Record<string, unknown>;
            if (obj.type === 'LineString' && Array.isArray(obj.coordinates)) {
                coordsArray = obj.coordinates as unknown[];
            } else if (Array.isArray(parsed)) {
                coordsArray = parsed;
            }
        }

        if (!coordsArray || !Array.isArray(coordsArray)) {
            throw new Error('Invalid GeoJSON');
        }

        const decodedPath = coordsArray.map((coord: unknown) => {
            if (Array.isArray(coord) && coord.length >= 2) {
                const lng = Number(coord[0]);
                const lat = Number(coord[1]);
                if (!isNaN(lat) && !isNaN(lng)) {
                    return new LatLngClass(lat, lng);
                }
            }
            throw new Error('Invalid coordinates');
        });

        applyDecodedPath(decodedPath);
    } catch {
        alert(
            'Failed to decode GeoJSON. Ensure it is a valid array of [lng, lat] coordinates or a LineString object.'
        );
    }
}

function applyDecodedPath(decodedPath: google.maps.LatLng[]) {
    if (decodedPath.length === 0) return;

    if (markers.length > 0) {
        const replaceConfirm = confirm(
            'Are you sure you want to replace the current polyline?'
        );
        if (!replaceConfirm) return;
    }

    clearAll();

    const bounds = new LatLngBoundsClass();
    decodedPath.forEach((ll) => {
        addPoint(ll);
        bounds.extend(ll);
    });

    if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
    }
}

void init();
// [END maps_polyline_utility]
