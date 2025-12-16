/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_ai_powered_summaries]
// Define DOM elements.
const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;
const placeAutocomplete = document.querySelector(
    'gmp-place-autocomplete'
) as google.maps.places.PlaceAutocompleteElement;
const summaryPanel = document.getElementById('summary-panel') as HTMLDivElement;
const placeName = document.getElementById('place-name') as HTMLElement;
const placeAddress = document.getElementById('place-address') as HTMLElement;
const tabContainer = document.getElementById('tab-container') as HTMLDivElement;
const summaryContent = document.getElementById(
    'summary-content'
) as HTMLDivElement;
const aiDisclosure = document.getElementById('ai-disclosure') as HTMLDivElement;
const flagContentLink = document.getElementById('flag-content-link') as HTMLAnchorElement;

let innerMap;
let marker: google.maps.marker.AdvancedMarkerElement;

async function initMap(): Promise<void> {
    // Request needed libraries.
    const [] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('places'),
    ]);

    innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
    });

    // Bind autocomplete bounds to map bounds.
    google.maps.event.addListener(innerMap, 'bounds_changed', async () => {
        placeAutocomplete.locationRestriction = innerMap.getBounds();
    });

    // Create the marker.
    marker = new google.maps.marker.AdvancedMarkerElement({
        map: innerMap,
    });

    // Handle selection of an autocomplete result.
    // prettier-ignore
    // @ts-ignore
    placeAutocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
            const place = placePrediction.toPlace();

            // Fetch all summary fields.
            // [START maps_ai_powered_summaries_fetchfields]
            await place.fetchFields({
                fields: [
                    'displayName',
                    'formattedAddress',
                    'location',
                    'generativeSummary',
                    'neighborhoodSummary',
                    'reviewSummary',
                    'evChargeAmenitySummary',
                ],
            });
            // [END maps_ai_powered_summaries_fetchfields]

            // Update the map viewport and position the marker.
            if (place.viewport) {
                innerMap.fitBounds(place.viewport);
            } else {
                innerMap.setCenter(place.location);
                innerMap.setZoom(17);
            }
            marker.position = place.location;

            // Update the panel UI.
            updateSummaryPanel(place);
        }
    );
}

function updateSummaryPanel(place: google.maps.places.Place) {
    // Reset UI
    summaryPanel.classList.remove('hidden');
    tabContainer.innerHTML = ''; // innerHTML is OK here since we're clearing known child elements.
    summaryContent.textContent = '';
    aiDisclosure.textContent = '';

    placeName.textContent = place.displayName || '';
    placeAddress.textContent = place.formattedAddress || '';

    let firstTabActivated = false;

    /**
     * Safe Helper: Accepts either a text string or a DOM Node (like a div or DocumentFragment).
     */
    const createTab = (
        label: string,
        content: string | Node,
        disclosure: string,
        flagUrl: string
    ) => {
        const btn = document.createElement('button');
        btn.className = 'tab-button';
        btn.textContent = label;

        btn.onclick = () => {
            // Do nothing if the tab is already active.
            if (btn.classList.contains('active')) {
                return;
            }

            // Manage the active class state.
            document
                .querySelectorAll('.tab-button')
                .forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            if (typeof content === 'string') {
                summaryContent.textContent = content;
            } else {
                summaryContent.replaceChildren(content.cloneNode(true));
            }

            // Set the disclosure text.
            aiDisclosure.textContent = disclosure || 'AI-generated content.';

            // Add the content flag URI.
            if (flagUrl) {
                flagContentLink.href = flagUrl;
                flagContentLink.textContent = "Report an issue"
            }
        };

        tabContainer.appendChild(btn);

        // Auto-select the first available summary.
        if (!firstTabActivated) {
            btn.click();
            firstTabActivated = true;
        }
    };

    // --- 1. Generative Summary (Place) ---
    //@ts-ignore
    if (place.generativeSummary?.overview) {
        createTab(
            'Overview',
            //@ts-ignore
            place.generativeSummary.overview,
            //@ts-ignore
            place.generativeSummary.disclosureText,
            //@ts-ignore
            place.generativeSummary.flagContentURI
        );
    }

    // --- 2. Review Summary ---
    //@ts-ignore
    if (place.reviewSummary?.text) {
        createTab(
            'Reviews',
            //@ts-ignore
            place.reviewSummary.text,
            //@ts-ignore
            place.reviewSummary.disclosureText,
            //@ts-ignore
            place.reviewSummary.flagContentURI
        );
    }

    // --- 3. Neighborhood Summary ---
    //@ts-ignore
    if (place.neighborhoodSummary?.overview?.content) {
        createTab(
            'Neighborhood',
            //@ts-ignore
            place.neighborhoodSummary.overview.content,
            //@ts-ignore
            place.neighborhoodSummary.disclosureText,
            //@ts-ignore
            place.neighborhoodSummary.flagContentURI
        );
    }

    // --- 4. EV Amenity Summary (uses content blocks)) ---
    //@ts-ignore
    if (place.evChargeAmenitySummary) {
        //@ts-ignore
        const evSummary = place.evChargeAmenitySummary;
        const evContainer = document.createDocumentFragment();

        // Helper to build a safe DOM section for EV categories.
        const createSection = (title: string, text: string) => {
            const wrapper = document.createElement('div');
            wrapper.style.marginBottom = '15px'; // Or use a CSS class

            const titleEl = document.createElement('strong');
            titleEl.textContent = title;

            const textEl = document.createElement('div');
            textEl.textContent = text;

            wrapper.appendChild(titleEl);
            wrapper.appendChild(textEl);
            return wrapper;
        };

        // Check and append each potential section
        if (evSummary.overview?.content) {
            evContainer.appendChild(
                createSection('Overview', evSummary.overview.content)
            );
        }
        if (evSummary.coffee?.content) {
            evContainer.appendChild(
                createSection('Coffee', evSummary.coffee.content)
            );
        }
        if (evSummary.restaurant?.content) {
            evContainer.appendChild(
                createSection('Food', evSummary.restaurant.content)
            );
        }
        if (evSummary.store?.content) {
            evContainer.appendChild(
                createSection('Shopping', evSummary.store.content)
            );
        }

        // Only add the tab if the container has children
        if (evContainer.hasChildNodes()) {
            createTab(
                'EV Amenities',
                evContainer, // Passing a Node instead of string
                evSummary.disclosureText,
                evSummary.flagContentURI
            );
        }
    }

    // Safely handle the empty state.
    if (!firstTabActivated) {
        const msg = document.createElement('em');
        msg.textContent =
            'No AI summaries are available for this specific location.';
        summaryContent.replaceChildren(msg);
        aiDisclosure.textContent = '';
    }
}

initMap();
// [END maps_ai_powered_summaries]
