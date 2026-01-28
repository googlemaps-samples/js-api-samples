/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_place_photos]
async function init() {
    const { Place } = (await google.maps.importLibrary(
        'places'
    )) as google.maps.PlacesLibrary;

    // Use a place ID to create a new Place instance.
    const place = new Place({
        id: 'ChIJydSuSkkUkFQRsqhB-cEtYnw', // Woodland Park Zoo, Seattle WA
    });

    // Call fetchFields, passing the desired data fields.
    await place.fetchFields({
        fields: ['displayName', 'photos', 'editorialSummary'],
    });

    // Get the various HTML elements.
    let heading = document.getElementById('heading') as HTMLElement;
    let summary = document.getElementById('summary') as HTMLElement;
    let gallery = document.getElementById('gallery') as HTMLElement;
    let expandedImageDiv = document.getElementById(
        'expanded-image'
    ) as HTMLElement;
    let attributionLabel;

    // Show the display name and summary for the place.
    heading.textContent = place.displayName as string;
    summary.textContent = place.editorialSummary as string;

    // Add photos to the gallery.
    if (place.photos) {
        place.photos?.forEach((photo) => {
            const altText = 'Photo of ' + place.displayName;
            const img = document.createElement('img');
            const imgButton = document.createElement('button');
            const expandedImage = document.createElement('img');
            img.src = photo?.getURI({ maxHeight: 380 });
            img.alt = altText;
            imgButton.addEventListener('click', (event) => {
                event.preventDefault();
                expandedImage.src = img.src;
                expandedImage.alt = altText;
                expandedImageDiv.innerHTML = '';
                expandedImageDiv.appendChild(expandedImage);
                attributionLabel = createAttribution(photo.authorAttributions);
                expandedImageDiv.appendChild(attributionLabel);
            });

            imgButton.appendChild(img);
            gallery.appendChild(imgButton);
        });
    }

    // Display the first photo.
    if (place.photos && place.photos.length > 0) {
        const img = document.createElement('img');
        img.alt = 'Photo of ' + place.displayName;
        img.src = place.photos![0].getURI();
        expandedImageDiv.appendChild(img);
        attributionLabel = createAttribution(place.photos![0].authorAttributions);
        expandedImageDiv.appendChild(attributionLabel);
    }

    // Helper function to create attribution DIV.
    function createAttribution(attribution) {
        const attributionLabel = document.createElement('a');
        attributionLabel.classList.add('attribution-label');
        if (attribution && attribution[0]) {
            attributionLabel.textContent = attribution[0].displayName;
            attributionLabel.href = attribution[0].uri;
            attributionLabel.target = '_blank';
            attributionLabel.rel = 'noopener noreferrer';
            return attributionLabel;
        }
    }
}

init();
// [END maps_place_photos]
