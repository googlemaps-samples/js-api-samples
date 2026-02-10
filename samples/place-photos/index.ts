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
    const heading = document.getElementById('heading') as HTMLElement;
    const summary = document.getElementById('summary') as HTMLElement;
    const gallery = document.getElementById('gallery') as HTMLElement;
    const expandedImageDiv = document.getElementById(
        'expanded-image'
    ) as HTMLElement;

    // Show the display name and summary for the place.
    heading.textContent = place.displayName as string;
    summary.textContent = place.editorialSummary as string;

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
            const attributionLabel = createAttribution(photo.authorAttributions)!;
            expandedImageDiv.appendChild(attributionLabel);
        });

        imgButton.addEventListener('focus', ()=> {
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
            expandedImageDiv.appendChild(createAttribution(photo.authorAttributions)!);
        }
    }

    // Helper function to create attribution DIV.
    function createAttribution(attributions: google.maps.places.AuthorAttribution[]) {
        const attributionLabel = document.createElement('a');
        attributionLabel.classList.add('attribution-label');
        attributionLabel.textContent = attributions[0].displayName;
        attributionLabel.href = attributions[0].uri!;
        attributionLabel.target = '_blank';
        attributionLabel.rel = 'noopener noreferrer';
        return attributionLabel;
    }

    // Helper function to center the selected thumbnail in the gallery.
    function centerSelectedThumbnail(element: HTMLElement) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
}

init();
// [END maps_place_photos]
