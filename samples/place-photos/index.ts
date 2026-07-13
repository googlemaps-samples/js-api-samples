/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_place_photos]
async function init() {
    const { Place } = await google.maps.importLibrary('places');

    // Use a place ID to create a new Place instance.
    const place = new Place({
        id: 'ChIJydSuSkkUkFQRsqhB-cEtYnw', // Woodland Park Zoo, Seattle WA
    });

    // Call fetchFields, passing the desired data fields.
    await place.fetchFields({
        fields: ['displayName', 'photos', 'editorialSummary'],
    });

    // Get the various HTML elements.
    const heading = document.getElementById('heading')!;
    const summary = document.getElementById('summary')!;
    const expandedImageDiv = document.getElementById('expanded-image')!;

    // Show the display name and summary for the place.
    heading.textContent = place.displayName!;
    summary.textContent = place.editorialSummary!;

    // Display a random photo.
    if (place.photos && place.photos.length > 0) {
        // Pick a random photo index to reduce quota usage
        const randomIndex = Math.floor(Math.random() * place.photos.length);
        const photo = place.photos[randomIndex];
        const img = document.createElement('img');
        img.alt = `Photo of ${place.displayName || 'place'}`;
        // Fetch only the URI for this specific random photo
        img.src = photo.getURI({ maxHeight: 800 });
        expandedImageDiv.appendChild(img);

        if (photo.authorAttributions?.length) {
            expandedImageDiv.appendChild(
                createAttribution(photo.authorAttributions[0])
            );
        }
    }

    // Helper function to create attribution DIV.
    function createAttribution(
        attribution: google.maps.places.AuthorAttribution
    ) {
        const attributionLabel = document.createElement('a');
        attributionLabel.classList.add('attribution-label');
        attributionLabel.textContent = attribution.displayName;
        attributionLabel.href = attribution.uri!;
        attributionLabel.target = '_blank';
        attributionLabel.rel = 'noopener noreferrer';
        return attributionLabel;
    }
}

void init();
// [END maps_place_photos]
