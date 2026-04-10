"use strict";
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_place_photos]
async function init() {
    const { Place } = (await google.maps.importLibrary('places'));
    // Use a place ID to create a new Place instance.
    const place = new Place({
        id: 'ChIJydSuSkkUkFQRsqhB-cEtYnw', // Woodland Park Zoo, Seattle WA
    });
    // Call fetchFields, passing the desired data fields.
    await place.fetchFields({
        fields: ['displayName', 'photos', 'editorialSummary'],
    });
    // Get the various HTML elements.
    const heading = document.getElementById('heading');
    const summary = document.getElementById('summary');
    const gallery = document.getElementById('gallery');
    const expandedImageDiv = document.getElementById('expanded-image');
    // Show the display name and summary for the place.
    heading.textContent = place.displayName;
    summary.textContent = place.editorialSummary;
    // Add photos to the gallery.
    place.photos?.forEach((photo) => {
        const altText = 'Photo of ' + place.displayName;
        const img = document.createElement('img');
        const imgButton = document.createElement('button');
        const expandedImage = document.createElement('img');
        img.src = photo?.getURI({ maxHeight: 380 });
        img.alt = altText;
        imgButton.addEventListener('click', (event) => {
            centerSelectedThumbnail(imgButton);
            event.preventDefault();
            expandedImage.src = img.src;
            expandedImage.alt = altText;
            expandedImageDiv.innerHTML = '';
            expandedImageDiv.appendChild(expandedImage);
            const attributionLabel = createAttribution(photo.authorAttributions[0]);
            expandedImageDiv.appendChild(attributionLabel);
        });
        imgButton.addEventListener('focus', () => {
            centerSelectedThumbnail(imgButton);
        });
        imgButton.appendChild(img);
        gallery.appendChild(imgButton);
    });
    // Display the first photo.
    if (place.photos && place.photos.length > 0) {
        const photo = place.photos[0];
        const img = document.createElement('img');
        img.alt = 'Photo of ' + place.displayName;
        img.src = photo.getURI();
        expandedImageDiv.appendChild(img);
        if (photo.authorAttributions && photo.authorAttributions.length > 0) {
            expandedImageDiv.appendChild(createAttribution(photo.authorAttributions[0]));
        }
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
    // Helper function to center the selected thumbnail in the gallery.
    function centerSelectedThumbnail(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
        });
    }
}
init();
// [END maps_place_photos]
