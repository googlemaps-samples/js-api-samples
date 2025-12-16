"use strict";
/**
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_place_reviews]
let innerMap;
let infoWindow;
const mapElement = document.querySelector('gmp-map');
async function initMap() {
    // Import the needed libraries.
    const [{ InfoWindow }, { AdvancedMarkerElement }, { Place }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('places'),
    ]);
    innerMap = mapElement.innerMap;
    // [START maps_place_reviews_get_first]
    // Create a new Place instance.
    const place = new Place({
        id: 'ChIJpyiwa4Zw44kRBQSGWKv4wgA', // Faneuil Hall Marketplace, Boston, MA
    });
    // Call fetchFields, passing 'reviews' and other needed fields.
    await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location', 'reviews'],
    });
    // Create an HTML container.
    const content = document.createElement('div');
    const title = document.createElement('div');
    const rating = document.createElement('div');
    const address = document.createElement('div');
    const review = document.createElement('div');
    const authorLink = document.createElement('a');
    // If there are any reviews display the first one.
    if (place.reviews && place.reviews.length > 0) {
        // Get info for the first review.
        const reviewRating = place.reviews[0].rating;
        const reviewText = place.reviews[0].text;
        const authorName = place.reviews[0].authorAttribution.displayName;
        const authorUri = place.reviews[0].authorAttribution.uri;
        // Safely populate the HTML.
        title.textContent = place.displayName || '';
        address.textContent = place.formattedAddress || '';
        rating.textContent = `Rating: ${reviewRating} stars`;
        review.textContent = reviewText || '';
        authorLink.textContent = authorName;
        authorLink.href = authorUri || '';
        authorLink.target = '_blank';
        content.appendChild(title);
        content.appendChild(address);
        content.appendChild(rating);
        content.appendChild(review);
        content.appendChild(authorLink);
    }
    else {
        content.textContent =
            `No reviews were found for ${place.displayName}.`;
    }
    // Create an infowindow to display the review.
    infoWindow = new InfoWindow({
        content,
        ariaLabel: place.displayName,
    });
    // [END maps_place_reviews_get_first]
    // Add a marker.
    const marker = new AdvancedMarkerElement({
        map: innerMap,
        position: place.location,
        title: place.displayName,
    });
    innerMap.setCenter(place.location);
    // Show the info window.
    infoWindow.open({
        anchor: marker,
        map: innerMap,
    });
}
initMap();
// [END maps_place_reviews]
