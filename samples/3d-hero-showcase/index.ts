/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

interface TourStop {
    name: string;
    desc: string;
    camera: {
        center: { lat: number; lng: number; altitude: number };
        range: number;
        tilt: number;
        heading: number;
    };
    stats: {
        size: string;
        highlight: string;
    };
}

const TOUR_STOPS: TourStop[] = [
    {
        name: 'Rijksmuseum',
        desc: 'The national museum of the Netherlands. The footprint of this grand Gothic-Renaissance building is highlighted, and its 3D building mesh can be toggled on or off.',
        camera: {
            center: { lat: 52.36, lng: 4.8852, altitude: 40 },
            range: 280,
            tilt: 45,
            heading: 180,
        },
        stats: {
            size: '🖼 8,000+ objects',
            highlight: "Rembrandt's Night Watch",
        },
    },
    {
        name: 'Vondelpark',
        desc: "Amsterdam's largest and most famous public park. A flat translucent green polygon outlines a section of its lush lawns and tranquil lakes.",
        camera: {
            center: { lat: 52.358, lng: 4.8685, altitude: 50 },
            range: 600,
            tilt: 45,
            heading: 250,
        },
        stats: {
            size: '🌳 120 acres',
            highlight: 'Open Air Theatre',
        },
    },
    {
        name: 'Prinsengracht Canal',
        desc: "One of Amsterdam's three main belt canals. Traced in Googly orange is a flat polyline showing the canal tour path floating at water level.",
        camera: {
            center: { lat: 52.3637, lng: 4.8855, altitude: 30 },
            range: 300,
            tilt: 45,
            heading: 330,
        },
        stats: {
            size: '⛵ 3.2 km length',
            highlight: 'Historic Houseboats',
        },
    },
    {
        name: 'De Gooyer Windmill',
        desc: 'The tallest wooden mill in the Netherlands. We load a dynamic 3D model of the windmill which rotates in real-time, standing next to the canal.',
        camera: {
            center: { lat: 52.3667, lng: 4.9263, altitude: 30 },
            range: 180,
            tilt: 45,
            heading: 135,
        },
        stats: {
            size: '⚙ 26 meters tall',
            highlight: 'Built in 1725',
        },
    },
];

// Reference to map elements
let map: google.maps.maps3d.Map3DElement;
let windmillModel: google.maps.maps3d.Model3DElement;
let canalPolyline: google.maps.maps3d.Polyline3DElement;
let vondelparkPolygon: google.maps.maps3d.Polygon3DElement;
let museumPolygon: google.maps.maps3d.Polygon3DElement;
let museumFlattener: google.maps.maps3d.FlattenerElement;

// Collections of pins
const standardMarkers: google.maps.maps3d.Marker3DInteractiveElement[] = [];
const standardPopovers: google.maps.maps3d.PopoverElement[] = [];

// Tour State
let isTouring = false;
let currentStopIndex = -1;
let isAnimationCallbackActive = false;
let tourAnimationCleanup: (() => void) | null = null;

async function init() {
    const [
        {
            Map3DElement,
            Polyline3DElement,
            Polygon3DElement,
            Polygon3DInteractiveElement,
            Model3DElement,
            Marker3DInteractiveElement,
            PopoverElement,
            FlattenerElement,
        },
        { PinElement },
    ] = await Promise.all([
        google.maps.importLibrary('maps3d'),
        google.maps.importLibrary('marker'),
    ]);

    // 1. Initialize the 3D Map (Centered on Rijksmuseum)
    map = new Map3DElement({
        center: { lat: 52.36, lng: 4.8852, altitude: 800 },
        tilt: 40,
        heading: 0,
        range: 4000,
        mode: 'SATELLITE',
        gestureHandling: 'COOPERATIVE',
    });
    document.body.append(map);

    // 2. Create Layers

    // Polyline: Prinsengracht canal route (flat, orange)
    canalPolyline = new Polyline3DElement({
        path: [
            { lat: 52.3622, lng: 4.89149 },
            { lat: 52.36276, lng: 4.88788 },
            { lat: 52.36614, lng: 4.88277 },
            { lat: 52.36673, lng: 4.88242 },
            { lat: 52.36673, lng: 4.88242 },
        ],
        strokeColor: '#F37021',
        strokeWidth: 6,
        altitudeMode: 'CLAMP_TO_GROUND',
        extruded: false,
        drawsOccludedSegments: true,
    });

    // Polygon 1: Vondelpark lake/lawn zone (flat green)
    vondelparkPolygon = new Polygon3DInteractiveElement({
        path: [
            { lat: 52.35639, lng: 4.85497 },
            { lat: 52.36108, lng: 4.87449 },
            { lat: 52.3593, lng: 4.87592 },
            { lat: 52.35511, lng: 4.86683 },
            { lat: 52.35457, lng: 4.85623 },
        ],
        strokeColor: '#1e8e3e90',
        strokeWidth: 3,
        fillColor: '#1e8e3e40',
        drawsOccludedSegments: false,
    });

    vondelparkPolygon.addEventListener('gmp-click', () => {
        alert(
            'Welcome to Vondelpark! Enjoy the open lawns and winding pathways.'
        );
    });

    // Polygon 2: Rijksmuseum Building footprint (extruded)
    museumPolygon = new Polygon3DElement({
        path: [
            { lat: 52.36029, lng: 4.88327, altitude: 25 },
            { lat: 52.36092, lng: 4.88502, altitude: 25 },
            { lat: 52.36011, lng: 4.8867, altitude: 25 },
            { lat: 52.35881, lng: 4.88627, altitude: 25 },
            { lat: 52.3592, lng: 4.88412, altitude: 25 },
        ],
        strokeColor: '#4285F490',
        strokeWidth: 3,
        fillColor: '#4285F440',
        altitudeMode: 'RELATIVE_TO_GROUND',
        extruded: true,
    });

    // Rijksmuseum 3D flattener
    museumFlattener = new FlattenerElement({
        path: [
            { lat: 52.36029, lng: 4.88327 },
            { lat: 52.36092, lng: 4.88502 },
            { lat: 52.36011, lng: 4.8867 },
            { lat: 52.35881, lng: 4.88627 },
            { lat: 52.3592, lng: 4.88412 },
        ],
    });

    // 3D Model: Windmill (placed at De Gooyer Windmill site)
    windmillModel = new Model3DElement({
        src: 'https://maps-docs-team.web.app/assets/windmill.glb',
        position: { lat: 52.3667, lng: 4.9263 },
        orientation: { heading: 0, tilt: 270, roll: 90 },
        scale: 0.15,
        altitudeMode: 'CLAMP_TO_GROUND',
    });

    // 3. Create Standard Markers & Popovers with Custom HTML (at each Tour Stop)
    const poiLocations = [
        {
            id: 'rijksmuseum',
            name: 'Rijksmuseum',
            lat: 52.36,
            lng: 4.8852,
            alt: 35,
            desc: 'The national museum of the Netherlands, home to masterpieces by Rembrandt and Vermeer.',
            glyph: '🖼',
            bg: '#4285F4',
            highlight: "Rembrandt's Night Watch",
        },
        {
            id: 'vondelpark',
            name: 'Vondelpark',
            lat: 52.358,
            lng: 4.8685,
            alt: 20,
            desc: "Amsterdam's historic public park, filled with cafes, ponds, and paths.",
            glyph: '🌳',
            bg: '#34A853',
            highlight: 'Open Air Theatre',
        },
        {
            id: 'canal',
            name: 'Prinsengracht Canal',
            lat: 52.36409,
            lng: 4.88584,
            alt: 10,
            desc: 'The longest of the main canal rings, known for its iconic houseboats.',
            glyph: '⛵',
            bg: '#FBBC05',
            highlight: 'Historic Houseboats',
        },
        {
            id: 'degooyer',
            name: 'De Gooyer Windmill',
            lat: 52.3667,
            lng: 4.9263,
            alt: 30,
            desc: 'A historic flour mill built in 1725, the tallest wooden mill in the country.',
            glyph: '⚙',
            bg: '#EA4335',
            highlight: 'Built in 1725',
        },
    ];

    poiLocations.forEach((loc, index) => {
        const pin = new PinElement({
            background: loc.bg,
            glyph: loc.glyph,
            borderColor: '#FFFFFF',
        });

        const interactiveMarker = new Marker3DInteractiveElement({
            position: { lat: loc.lat, lng: loc.lng, altitude: loc.alt },
            altitudeMode: 'RELATIVE_TO_GROUND',
            extruded: true,
        });
        interactiveMarker.append(pin);

        const popover = new PopoverElement({
            open: false,
            positionAnchor: interactiveMarker,
        });

        const popoverContent = document.createElement('div');
        popoverContent.className = 'popover-custom-content';
        popoverContent.innerHTML = `
            <div class="popover-header">
                <span class="popover-emoji">${loc.glyph}</span>
                <h4>${loc.name}</h4>
            </div>
            <p class="popover-desc">${loc.desc}</p>
            <div class="popover-stats">
                <div class="popover-stat-item">
                    <span class="popover-stat-lbl">Highlight</span>
                    <span class="popover-stat-val">${loc.highlight}</span>
                </div>
            </div>
        `;
        popover.append(popoverContent);

        interactiveMarker.addEventListener('gmp-click', () => {
            // Close others
            standardPopovers.forEach((p, i) => {
                if (i !== index) p.open = false;
            });
            popover.open = !popover.open;
        });

        standardMarkers.push(interactiveMarker);
        standardPopovers.push(popover);
    });

    // Sync initial states
    syncLayers();
    syncRijksmuseumMesh();

    // 5. Connect UI Event Listeners
    setupUIListeners();
}

function syncLayers() {
    const showMarkers = (
        document.getElementById('toggle-markers') as HTMLInputElement
    ).checked;
    const showPolyline = (
        document.getElementById('toggle-polyline') as HTMLInputElement
    ).checked;
    const showPolygons = (
        document.getElementById('toggle-polygons') as HTMLInputElement
    ).checked;
    const showModel = (
        document.getElementById('toggle-model') as HTMLInputElement
    ).checked;

    // Standard Markers & Popovers
    standardMarkers.forEach((marker, index) => {
        if (showMarkers) {
            map.append(marker);
            map.append(standardPopovers[index]);
        } else {
            marker.remove();
            standardPopovers[index].remove();
        }
    });

    // Polyline
    if (showPolyline) {
        map.append(canalPolyline);
    } else {
        canalPolyline.remove();
    }

    // Polygons
    if (showPolygons) {
        map.append(vondelparkPolygon);
        map.append(museumPolygon);
    } else {
        vondelparkPolygon.remove();
        museumPolygon.remove();
    }

    // 3D Model
    if (showModel) {
        map.append(windmillModel);
    } else {
        windmillModel.remove();
    }
}

function syncRijksmuseumMesh() {
    const showMesh = (
        document.getElementById('toggle-salesforce-mesh') as HTMLInputElement
    ).checked;
    if (showMesh) {
        museumFlattener.remove();
    } else {
        map.append(museumFlattener);
    }
}

function setupUIListeners() {
    // Welcome dismiss
    const welcome = document.getElementById('welcome-banner') as HTMLDivElement;
    document
        .getElementById('btn-welcome-dismiss')
        ?.addEventListener('click', () => {
            welcome.classList.add('hidden');
        });

    // Tour buttons
    const btnStart = document.getElementById(
        'btn-start-tour'
    ) as HTMLButtonElement;
    const btnStop = document.getElementById(
        'btn-stop-tour'
    ) as HTMLButtonElement;
    const tourNav = document.getElementById('btn-prev-stop')
        ?.parentElement as HTMLDivElement;

    btnStart.addEventListener('click', () => {
        isTouring = true;
        btnStart.classList.add('hidden');
        btnStop.classList.remove('hidden');
        tourNav.classList.remove('hidden');
        welcome.classList.add('hidden');
        jumpToStop(0);
    });

    btnStop.addEventListener('click', () => {
        endTour();
    });

    document.getElementById('btn-prev-stop')?.addEventListener('click', () => {
        if (currentStopIndex > 0) {
            jumpToStop(currentStopIndex - 1);
        }
    });

    document.getElementById('btn-next-stop')?.addEventListener('click', () => {
        if (currentStopIndex < TOUR_STOPS.length - 1) {
            jumpToStop(currentStopIndex + 1);
        }
    });

    // Layer Toggle Listeners
    document
        .getElementById('toggle-markers')
        ?.addEventListener('change', syncLayers);

    document
        .getElementById('toggle-polyline')
        ?.addEventListener('change', syncLayers);
    document
        .getElementById('toggle-polygons')
        ?.addEventListener('change', syncLayers);
    document
        .getElementById('toggle-salesforce-mesh')
        ?.addEventListener('change', syncRijksmuseumMesh);
    document
        .getElementById('toggle-model')
        ?.addEventListener('change', syncLayers);

    // Map Mode Selectors
    const modeSat = document.getElementById(
        'mode-satellite'
    ) as HTMLButtonElement;
    const modeHyb = document.getElementById('mode-hybrid') as HTMLButtonElement;

    modeSat.addEventListener('click', () => {
        map.mode = 'SATELLITE';
        modeSat.classList.add('active');
        modeHyb.classList.remove('active');
    });

    modeHyb.addEventListener('click', () => {
        map.mode = 'HYBRID';
        modeHyb.classList.add('active');
        modeSat.classList.remove('active');
    });

    // Listener for camera interrupt
    map.addEventListener('gmp-click', () => {
        if (isTouring) {
            console.log(
                'Tour camera animation interrupted by user interaction.'
            );
        }
    });
}

function jumpToStop(index: number) {
    if (tourAnimationCleanup) {
        tourAnimationCleanup();
    }

    currentStopIndex = index;
    isAnimationCallbackActive = true;

    // Update Tour Nav UI
    const prevBtn = document.getElementById(
        'btn-prev-stop'
    ) as HTMLButtonElement;
    const nextBtn = document.getElementById(
        'btn-next-stop'
    ) as HTMLButtonElement;
    const progressText = document.getElementById(
        'tour-progress'
    ) as HTMLSpanElement;

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === TOUR_STOPS.length - 1;
    progressText.textContent = `Stop ${String(index + 1)} of ${String(TOUR_STOPS.length)}`;

    // Open active stop popover and close all others
    standardPopovers.forEach((p, i) => {
        p.open = i === index;
    });

    const stop = TOUR_STOPS[index];
    const flightStartTime = Date.now();

    // Perform camera FlyTo Animation (18s duration for cinematic smoothness)
    map.flyCameraTo({
        endCamera: stop.camera,
        durationMillis: 18000,
    });

    const listener = () => {
        const elapsed = Date.now() - flightStartTime;
        if (
            isAnimationCallbackActive &&
            currentStopIndex === index &&
            elapsed >= 17000
        ) {
            if (tourAnimationCleanup === cleanup) {
                tourAnimationCleanup = null;
            }
            map.removeEventListener('gmp-animationend', listener);
            flyAroundStop(index);
        }
    };

    const cleanup = () => {
        map.removeEventListener('gmp-animationend', listener);
    };
    tourAnimationCleanup = cleanup;

    map.addEventListener('gmp-animationend', listener);
}

function flyAroundStop(index: number) {
    isAnimationCallbackActive = false; // Prevent loop trigger
    const stop = TOUR_STOPS[index];
    const spinStartTime = Date.now();

    // Slower, smoother rotation (30s duration)
    map.flyCameraAround({
        camera: stop.camera,
        durationMillis: 30000,
        repeatCount: 1,
    });

    const listener = () => {
        const elapsed = Date.now() - spinStartTime;
        if (isTouring && currentStopIndex === index && elapsed >= 29000) {
            if (tourAnimationCleanup === cleanup) {
                tourAnimationCleanup = null;
            }
            map.removeEventListener('gmp-animationend', listener);
            // Wait 3 seconds at current view, then fly to the next stop
            window.setTimeout(() => {
                if (isTouring && currentStopIndex === index) {
                    if (index < TOUR_STOPS.length - 1) {
                        jumpToStop(index + 1);
                    } else {
                        endTour();
                    }
                }
            }, 3000);
        }
    };

    const cleanup = () => {
        map.removeEventListener('gmp-animationend', listener);
    };
    tourAnimationCleanup = cleanup;

    map.addEventListener('gmp-animationend', listener);
}

function endTour() {
    isTouring = false;
    currentStopIndex = -1;
    isAnimationCallbackActive = false;
    map.stopCameraAnimation();

    if (tourAnimationCleanup) {
        tourAnimationCleanup();
        tourAnimationCleanup = null;
    }

    // Close all popovers
    standardPopovers.forEach((p) => (p.open = false));

    const btnStart = document.getElementById(
        'btn-start-tour'
    ) as HTMLButtonElement;
    const btnStop = document.getElementById(
        'btn-stop-tour'
    ) as HTMLButtonElement;
    const tourNav = document.getElementById('btn-prev-stop')
        ?.parentElement as HTMLDivElement;

    btnStart.classList.remove('hidden');
    btnStop.classList.add('hidden');
    tourNav.classList.add('hidden');
}

window.addEventListener('load', () => {
    void init();
});
