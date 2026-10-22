'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

const CITIES = [
    { name: 'New York', id: 'ChIJOwg_06VPwokRYv534QaPC8g' },
    { name: 'London', id: 'ChIJdd4hrwug2EcRmSrV3Vo6llI' },
    { name: 'Paris', id: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ' },
    { name: 'Tokyo', id: 'ChIJ51cu8IcbXWARiRtXIothAS4' },
    { name: 'Rome', id: 'ChIJu46S-ZZhLxMROG5lkwZ3D7k' },
];

async function init() {
    const { Place } = await google.maps.importLibrary('places');

    const heading = document.getElementById('heading');
    const summary = document.getElementById('summary');
    const expandedImageDiv = document.getElementById('expanded-image');
    const randomizeBtn = document.getElementById('randomize-btn');

    async function showRandomCityPhoto() {
        randomizeBtn.disabled = true;

        // Pick a random city
        const city = CITIES[Math.floor(Math.random() * CITIES.length)];

        try {
            const place = new Place({ id: city.id });
            await place.fetchFields({
                fields: ['displayName', 'photos', 'editorialSummary'],
            });

            heading.textContent = place.displayName ?? city.name;
            summary.textContent = place.editorialSummary ?? '';
            expandedImageDiv.innerHTML = '';

            if (place.photos && place.photos.length > 0) {
                // Pick one of the first 10 photos
                const maxPhotos = Math.min(10, place.photos.length);
                const randomIndex = Math.floor(Math.random() * maxPhotos);
                const photo = place.photos[randomIndex];

                const img = document.createElement('img');
                img.alt = `Photo of ${place.displayName ?? city.name}`;
                img.src = photo.getURI({ maxHeight: 800 });
                expandedImageDiv.appendChild(img);

                if (photo.authorAttributions.length) {
                    expandedImageDiv.appendChild(
                        createAttribution(photo.authorAttributions[0])
                    );
                }
            } else {
                expandedImageDiv.textContent =
                    'No photos available for this location.';
            }
        } catch (error) {
            console.error('Failed to fetch place details:', error);
            summary.textContent = 'Failed to load data.';
        }

        // Re-enable button after 2 seconds
        setTimeout(() => {
            randomizeBtn.disabled = false;
        }, 2000);
    }

    // Helper function to create attribution DIV.
    function createAttribution(attribution) {
        const attributionLabel = document.createElement('a');
        attributionLabel.classList.add('attribution-label');
        attributionLabel.textContent = attribution.displayName;
        attributionLabel.href = attribution.uri;
        attributionLabel.target = '_blank';
        attributionLabel.rel = 'noopener noreferrer';
        return attributionLabel;
    }

    randomizeBtn.addEventListener('click', () => void showRandomCityPhoto());

    // Initial load
    void showRandomCityPhoto();
}

void init();
