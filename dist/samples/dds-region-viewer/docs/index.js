/**
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Data-driven styling region coverage viewer!
 * - View feature boundary availability around the world.
 * - Set color for fill and stroke of feature polygons.
 */
// [START maps_dds_region_viewer]
const mapElement = document.querySelector('gmp-map');
let placeAutocomplete;
let innerMap;
let countryMenu;
let featureMenu;
let searchInputOption;
let fillColorPicker;
let strokeColorPicker;
let contentDiv;
let allLayers;
let countryLayer;
let admin1Layer;
let admin2Layer;
let localityLayer;
let postalCodeLayer;
let schoolDistrictLayer;
let selectedPlaceId;
import * as countries from './src/countries.json';
async function initMap() {
    (await google.maps.importLibrary('maps'));
    (await google.maps.importLibrary('places'));
    (await google.maps.importLibrary('marker'));
    // Get the inner map.
    innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
    });
    // Create the Place Autocomplete widget.
    placeAutocomplete = document.querySelector('gmp-place-autocomplete');
    placeAutocomplete.includedPrimaryTypes = ['(regions)'];
    contentDiv = document.getElementById('pac-content');
    searchInputOption = document.getElementById('pac-filter-option');
    countryMenu = document.getElementById('country-select');
    featureMenu = document.getElementById('feature-type-select');
    fillColorPicker = document.getElementById('fill-color-picker');
    strokeColorPicker = document.getElementById('stroke-color-picker');
    // Set up input events.
    countryMenu.addEventListener('change', onCountrySelected);
    featureMenu.addEventListener('change', featureTypeChanged);
    fillColorPicker.addEventListener('change', styleChanged);
    strokeColorPicker.addEventListener('change', styleChanged);
    searchInputOption.addEventListener('change', () => {
        if (searchInputOption.checked) {
            // Do not show school_district since AC cannot use it for filtering.
            featureMenu.item(5).disabled = true;
            setFeatureType();
        }
        else {
            // Show school districts.
            featureMenu.item(5).disabled = false;
            setFeatureType();
        }
    });
    // Handle autocomplete widget selection.
    placeAutocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
        const types = placePrediction.types;
        // Find the first type that matches a feature menu option.
        const validFeatureTypes = [
            'country',
            'administrative_area_level_1',
            'administrative_area_level_2',
            'locality',
            'postal_code',
            'school_district',
        ];
        for (const type of types) {
            if (validFeatureTypes.includes(type)) {
                featureMenu.value = type; // Set the menu value directly
                break; // Use the first matching type found
            }
        }
        setFeatureType(); // Update autocomplete filtering based on new menu selection
        showSelectedPolygon(placePrediction.placeId, 1);
    });
    // Add all the feature layers.
    countryLayer = innerMap.getFeatureLayer('COUNTRY');
    admin1Layer = innerMap.getFeatureLayer('ADMINISTRATIVE_AREA_LEVEL_1');
    admin2Layer = innerMap.getFeatureLayer('ADMINISTRATIVE_AREA_LEVEL_2');
    localityLayer = innerMap.getFeatureLayer('LOCALITY');
    postalCodeLayer = innerMap.getFeatureLayer('POSTAL_CODE');
    schoolDistrictLayer = innerMap.getFeatureLayer('SCHOOL_DISTRICT');
    // Add event listeners for feature layers.
    countryLayer.addListener('click', handlePlaceClick);
    admin1Layer.addListener('click', handlePlaceClick);
    admin2Layer.addListener('click', handlePlaceClick);
    localityLayer.addListener('click', handlePlaceClick);
    postalCodeLayer.addListener('click', handlePlaceClick);
    schoolDistrictLayer.addListener('click', handlePlaceClick);
    // List of all the layers when they get initialized.
    allLayers = [
        countryLayer,
        admin1Layer,
        admin2Layer,
        localityLayer,
        postalCodeLayer,
        schoolDistrictLayer,
    ];
    // Init map styles.
    applyStyle();
    // Set up country and feature menus.
    buildMenu();
    onCountrySelected();
    featureMenu.selectedIndex = 0; // Set to COUNTRY.
}
// Restyle and make a request when the feature type is changed.
function featureTypeChanged() {
    // Style for coloring the outline of the entire feature type.
    let styleStrokeOnly = /** @type {!google.maps.FeatureStyleOptions} */ {
        fillColor: 'white',
        fillOpacity: 0.01,
        strokeColor: strokeColorPicker.value,
        strokeOpacity: 1.0,
        strokeWeight: 2.0,
    };
    revertStyles();
    setFeatureType();
    selectedPlaceId = '';
    contentDiv.innerHTML = '';
    // Apply the style to the selected feature layer.
    switch (featureMenu.value) {
        case 'country':
            countryLayer.style = styleStrokeOnly;
            searchInputOption.disabled = false;
            break;
        case 'administrative_area_level_1':
            admin1Layer.style = styleStrokeOnly;
            searchInputOption.disabled = false;
            break;
        case 'administrative_area_level_2':
            admin2Layer.style = styleStrokeOnly;
            searchInputOption.disabled = false;
            break;
        case 'locality':
            localityLayer.style = styleStrokeOnly;
            searchInputOption.disabled = false;
            break;
        case 'postal_code':
            postalCodeLayer.style = styleStrokeOnly;
            searchInputOption.disabled = false;
            break;
        case 'school_district':
            schoolDistrictLayer.style = styleStrokeOnly;
            searchInputOption.disabled = true;
            break;
        default:
            break;
    }
}
// Toggle autocomplete types based on restrict search checkbox.
function setFeatureType() {
    if (searchInputOption.checked) {
        // Set autocomplete to the selected type.
        placeAutocomplete.includedPrimaryTypes = [featureMenu.value];
    }
    else {
        // Set autocomplete to return all feature types.
        placeAutocomplete.includedPrimaryTypes = ['(regions)'];
    }
}
// Restyle when the stroke or fill is changed.
function styleChanged() {
    if (selectedPlaceId) {
        applyStyle(selectedPlaceId);
    }
}
// Apply styling to a polygon.
function applyStyle(placeid) {
    // Define styles.
    let styleStrokeOnly = /** @type {!google.maps.FeatureStyleOptions} */ {
        strokeColor: strokeColorPicker.value,
        strokeOpacity: 1.0,
        strokeWeight: 2.0,
        fillColor: 'white',
        fillOpacity: 0.1,
    };
    let styleStrokeFill = /** @type {!google.maps.FeatureStyleOptions} */ {
        strokeColor: strokeColorPicker.value,
        strokeOpacity: 1.0,
        strokeWeight: 2.0,
        fillColor: fillColorPicker.value,
        fillOpacity: 0.5,
    };
    revertStyles();
    const featureStyle = (params) => {
        if (params.feature.placeId == placeid) {
            return styleStrokeFill;
        }
        else {
            return styleStrokeOnly;
        }
    };
    // Only style the selected feature type.
    switch (featureMenu.value) {
        case 'country':
            countryLayer.style = featureStyle;
            searchInputOption.disabled = false;
            break;
        case 'administrative_area_level_1':
            admin1Layer.style = featureStyle;
            searchInputOption.disabled = false;
            break;
        case 'administrative_area_level_2':
            admin2Layer.style = featureStyle;
            searchInputOption.disabled = false;
            break;
        case 'locality':
            localityLayer.style = featureStyle;
            searchInputOption.disabled = false;
            break;
        case 'postal_code':
            postalCodeLayer.style = featureStyle;
            searchInputOption.disabled = false;
            break;
        case 'school_district':
            schoolDistrictLayer.style = featureStyle;
            searchInputOption.disabled = true;
            break;
        default:
            break;
    }
}
// Populate the countries menu.
function buildMenu() {
    for (const item of countries.default) {
        let countryOption = document.createElement('option');
        countryOption.textContent = item.name;
        countryOption.value = item.code;
        // Set U.S. as the default.
        if (item.code == 'US') {
            countryOption.selected = true;
        }
        countryMenu.appendChild(countryOption);
    }
}
// Populate the feature type menu with the supported feature types.
function onCountrySelected() {
    // Get the selected value.
    const selectedCountryCode = countryMenu.value;
    updateFeatureMenuAvailability(selectedCountryCode);
    // Set the feature list selection to 'country'.
    featureMenu.namedItem('country').selected = true;
    showSelectedCountry(countryMenu.options[countryMenu.selectedIndex].text);
}
// Enables or disables items in the feature menu based on country support.
function updateFeatureMenuAvailability(countryCode) {
    const featureAvailabilityMap = getFeatureAvailability(countryCode);
    // Do a comparison on the map, and disable any false items.
    for (const [feature, isAvailable] of featureAvailabilityMap) {
        const menuItem = featureMenu.namedItem(feature);
        if (menuItem)
            menuItem.disabled = !isAvailable;
    }
}
// Return a map of feature availability for a country.
function getFeatureAvailability(countryName) {
    // Return the data for the selected country.
    const selectedCountry = countries.default.find((country) => {
        return country.code === countryName;
    });
    // Create a map for our values.
    let featureAvailabilityMap = new Map([
        ['country', selectedCountry?.feature.country],
        [
            'administrative_area_level_1',
            selectedCountry?.feature.administrative_area_level_1,
        ],
        [
            'administrative_area_level_2',
            selectedCountry?.feature.administrative_area_level_2,
        ],
        ['postal_code', selectedCountry?.feature.postal_code],
        ['locality', selectedCountry?.feature.locality],
        ['school_district', selectedCountry?.feature.school_district],
    ]);
    return featureAvailabilityMap;
}
// Restyle all feature layers to be invisible.
function revertStyles() {
    for (const layer of allLayers) {
        layer.style = null;
    }
}
// Apply styling to the clicked place.
function handlePlaceClick(event) {
    let clickedPlaceId = event.features[0].placeId;
    if (!clickedPlaceId)
        return;
    showSelectedPolygon(clickedPlaceId, 0);
}
// Get the place ID for the selected country, then call showSelectedPolygon().
async function showSelectedCountry(countryName) {
    const { Place } = (await google.maps.importLibrary('places'));
    contentDiv.textContent = '';
    const request = {
        textQuery: countryName,
        fields: ['id'],
    };
    const { places } = await Place.searchByText(request);
    if (places.length > 0) {
        showSelectedPolygon(places[0].id, 0);
    }
}
// Event handler for when a polygon is selected.
// mode 0 = click, mode 1 = autocomplete.
async function showSelectedPolygon(placeid, mode) {
    let isFeatureSupported;
    const { Place } = (await google.maps.importLibrary('places'));
    selectedPlaceId = placeid;
    contentDiv.textContent = ''; // Clear the info display.
    const place = new Place({
        id: placeid,
    });
    await place.fetchFields({
        fields: [
            'displayName',
            'formattedAddress',
            'viewport',
            'types',
            'addressComponents',
        ],
    });
    // Zoom to the polygon and change the country menu selection.
    const countryComponent = place.addressComponents?.find((c) => c.types.includes('country'));
    if (countryComponent) {
        countryMenu.value = countryComponent.shortText;
        updateFeatureMenuAvailability(countryMenu.value);
        // Check if the selected feature type is supported by the new country.
        isFeatureSupported = getFeatureAvailability(countryMenu.value).get(featureMenu.value);
    }
    var viewport = place.viewport;
    innerMap.fitBounds(viewport, 155);
    // Build the HTML.
    contentDiv.appendChild(document.createElement('hr'));
    const types = place.types;
    // Create HTML for place information.
    const placeInfo = document.createElement('div');
    placeInfo.id = 'place-info';
    // Show information if boundary was clicked (mode 0).
    if (mode == 0) {
        const boldAddress = document.createElement('b');
        boldAddress.textContent = place.formattedAddress;
        const placeIdCode = document.createElement('code');
        placeIdCode.textContent = placeid;
        const featureTypeCode = document.createElement('code');
        featureTypeCode.textContent = types[0];
        placeInfo.append(boldAddress);
        placeInfo.append(document.createElement('br'), 'Place ID: ', placeIdCode);
        placeInfo.append(document.createElement('br'), 'Feature type: ', featureTypeCode);
    }
    else {
        // Display other information if autocomplete was used (mode 1).
        if (!isFeatureSupported) {
            placeInfo.textContent = `Feature type (${featureMenu.value}) is not supported for this country.`;
        }
        else {
            placeInfo.textContent = `Click a boundary to see its place ID and feature type.`;
        }
    }
    contentDiv.appendChild(placeInfo);
    // Call the global styling function.
    applyStyle(placeid);
}
initMap();
// [END maps_dds_region_viewer]
