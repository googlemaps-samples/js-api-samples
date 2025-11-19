/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_customization] */
const searchPlace = document.querySelector('gmp-place-autocomplete') as any;
const componentType = document.getElementById('component') as any;
const layoutOrientation = document.getElementById('orientation') as any;

const widgetContainer = document.querySelector('.widget-container') as any;
const contentConfig = document.querySelectorAll('.content-config') as any;
const contentElemContainer = document.querySelector(
    '.content-element-container'
) as any;
const contentElem = document.querySelectorAll('.content-element') as any;
const contentsExtra = document.querySelectorAll('.extra-content') as any;

const styleColors = document.querySelectorAll("input[type='color']") as any;
const styleText = document.querySelectorAll(
    ".style-config input[type='text']"
) as any;
const placeId = document.getElementById('place-id') as any;
const widthSlider = document.getElementById('width-slider') as any;
const truncationControl = document.getElementById('truncationpreferred') as any;
const styleReset = document.querySelectorAll('.reset') as any;

let settings = {
    placeId: 'ChIJ3S-JXmauEmsRUcIaWtf4MzE',
    element: 'gmp-place-details-compact',
    orientation: 'VERTICAL',
    all: true,
    standard: false,
    custom: false,
    contentType: 'all',
    truncationPreferred: false,
    contents: {
        media: true,
        address: true,
        rating: true,
        type: true,
        price: true,
        'accessible-entrance-icon': true,
        'open-now-status': true,
        attribution: true,
    },
    extraContents: {
        website: true,
        'phone-number': true,
        'opening-hours': true,
        summary: true,
        'type-specific-highlights': true,
        reviews: true,
        'plus-code': true,
        'feature-list': true,
    },
};

let customizedStyle = {
    '--gmp-mat-color-info': '',
    '--gmp-mat-color-negative': '',
    '--gmp-mat-color-neutral-container': '',
    '--gmp-mat-color-on-secondary-container': '',
    '--gmp-mat-color-on-surface': '',
    '--gmp-mat-color-surface': '',
    '--gmp-mat-color-on-surface-variant': '',
    '--gmp-mat-color-outline-decorative': '',
    '--gmp-mat-color-positive': '',
    '--gmp-mat-color-primary': '',
    '--gmp-mat-color-secondary-container': '',
    '--gmp-mat-color-disabled-surface': '',
    '--gmp-mat-font-body-medium': '',
    '--gmp-mat-font-body-small': '',
    '--gmp-mat-font-family': '',
    '--gmp-mat-font-headline-medium': '',
    '--gmp-mat-font-label-large': '',
    '--gmp-mat-font-title-small': '',
    '--gmp-mat-color-on-neutral-container': '',
    '--gmp-mat-color-on-positive-container': '',
    '--gmp-mat-color-positive-container': '',
    '--gmp-mat-font-display-small': '',
    'background-color': '',
    border: '',
    'border-radius': '',
    'font-size': '',
};

let placeElement,
    placeRequest,
    gmpPlaceAll,
    gmpPlaceStandard,
    gmpContentConfig,
    gmpContentConfigFull;

async function init() {
    await google.maps.importLibrary('places');

    placeRequest = document.createElement('gmp-place-details-place-request');
    gmpPlaceAll = document.createElement('gmp-place-all-content');
    gmpPlaceStandard = document.createElement('gmp-place-standard-content');
    gmpContentConfig = document.createElement('gmp-place-content-config');

    initAccordion();
    detailsConstructor(); //Construct the place details element
    initSearchPlace(); //Initialize Autocomplete search
    widgetSelector(); //Handlers for controls
    styleCustomization(); //css properties
}

/* style properties accordion */
function initAccordion() {
    let accordions = document.getElementsByClassName('accordion');
    Array.from(accordions).forEach((item) => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
            let panel = item.nextElementSibling as HTMLElement | null;
            if (panel) {
                if (panel.style.display === 'grid') {
                    panel.style.display = 'none';
                } else {
                    panel.style.display = 'grid';
                }
            }
        });
    });
}

/* Initialize Autocomplete for searching places */
function initSearchPlace() {
    searchPlace.addEventListener('gmp-select', ({ placePrediction }) => {
        placePrediction
            .toPlace()
            .fetchFields({
                fields: ['id'],
            })
            .then((place) => {
                placeId.value = place.place.id;
                settings.placeId = placeId.value;
                updateWidget();
            });
    });
}

function widgetSelector() {
    /* Place ID input */
    placeId.addEventListener('input', () => {
        settings.placeId = placeId.value;
        updateWidget();
    });

    /* Select a component */
    componentType.addEventListener('change', () => {
        settings.element = componentType.value;

        if (componentType.value == 'gmp-place-details') {
            layoutOrientation.disabled = true; //horizontal orientation is not available for full version for now
            settings.truncationPreferred = false;
            truncationControl.disabled = true;
            if (settings.custom) {
                //display extra content elements config for full version
                contentsExtra.forEach((item) => {
                    item.style.display = 'block';
                });
            }
        } else {
            layoutOrientation.disabled = false;
            settings.truncationPreferred = false;
            truncationControl.disabled = false;
            if (settings.custom) {
                contentsExtra.forEach((item) => {
                    item.style.display = 'none';
                });
            }
        }
        detailsConstructor();
    });

    /* Select widget orientation */
    layoutOrientation.addEventListener('change', () => {
        settings.orientation = layoutOrientation.value;
        updateWidget();
    });

    /* Apply Truncation to widget */
    truncationControl.addEventListener('change', () => {
        settings.truncationPreferred = truncationControl.checked;
        updateWidget();
    });

    /* Switch between Standard, All, Custom radio buttons */
    contentConfig.forEach((config) => {
        config.addEventListener('change', (event) => {
            switch (event.target.value) {
                case 'standard':
                    contentElemContainer.style.display = 'none';
                    settings.all = false;
                    settings.standard = true;
                    settings.custom = false;
                    break;
                case 'all':
                    contentElemContainer.style.display = 'none';
                    settings.all = true;
                    settings.standard = false;
                    settings.custom = false;
                    break;
                case 'custom':
                    contentElemContainer.style.display = 'grid';
                    settings.all = false;
                    settings.standard = false;
                    settings.custom = true;
                    if (settings.element == 'gmp-place-details-compact') {
                        contentsExtra.forEach((item) => {
                            item.style.display = 'none';
                        });
                    } else if (settings.element == 'gmp-place-details') {
                        contentsExtra.forEach((item) => {
                            item.style.display = 'block';
                        });
                    }
                    break;
            }
            updateWidget();
        });
    });

    contentElem.forEach((element) => {
        element.addEventListener('change', (event) => {
            settings.contents[event.target.value] = event.target.checked;
            updateWidget();
        });
    });

    contentsExtra.forEach((element) => {
        element.addEventListener('change', (event) => {
            settings.extraContents[event.target.value] = event.target.checked;
            updateWidget();
        });
    });
}

function styleCustomization() {
    styleColors.forEach((style) => {
        style.addEventListener('input', (event) => {
            customizedStyle[event.target.id] = event.target.value;
            placeElement.style.setProperty(event.target.id, event.target.value);
        });
    });

    styleReset.forEach((item) => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            // @ts-ignore
            document.getElementById(event.target.dataset.style).value =
                '#000000';
            placeElement.style.removeProperty(event.target.dataset.style);
        });
    });

    styleText.forEach((style) => {
        style.addEventListener('input', (event) => {
            placeElement.style.setProperty(event.target.id, event.target.value);
        });
    });

    widthSlider.addEventListener('input', (event) => {
        placeElement.style.width = `${event.target.value}px`;
        // @ts-ignore
        document.getElementById('width-output').innerHTML =
            `${event.target.value}px`;
    });
}

/* Construct Place Details widgets */
function detailsConstructor() {
    /* Create the Element(compact or full) */
    placeElement = document.createElement(settings.element);
    updateWidget();
}

/* Update the widget */
function updateWidget() {
    placeRequest.place = settings.placeId;
    placeElement.orientation = settings.orientation;
    placeElement.truncationPreferred = settings.truncationPreferred;

    widgetContainer.innerHTML = '';
    widgetContainer.appendChild(placeElement);

    placeElement.innerHTML = '';
    placeElement.appendChild(placeRequest);

    if (placeElement.contains(gmpPlaceStandard)) {
        placeElement.removeChild(gmpPlaceStandard);
    }
    if (placeElement.contains(gmpPlaceAll)) {
        placeElement.removeChild(gmpPlaceAll);
    }
    if (placeElement.contains(gmpContentConfig)) {
        placeElement.removeChild(gmpContentConfig);
    }

    //Configure elements for compact layout
    gmpContentConfig.innerHTML = '';
    for (let property in settings.contents) {
        if (settings.contents[property]) {
            //include content
            if (!gmpContentConfig.querySelector(`gmp-place-${property}`)) {
                gmpContentConfig.appendChild(
                    document.createElement(`gmp-place-${property}`)
                );
            }
        } else {
            //remove content
            if (gmpContentConfig.querySelector(`gmp-place-${property}`)) {
                gmpContentConfig.removeChild(
                    gmpContentConfig.querySelector(`gmp-place-${property}`)
                );
            }
        }
    }

    //Configure elements for full layout
    gmpContentConfigFull = gmpContentConfig.cloneNode(true);
    for (let property in settings.extraContents) {
        if (settings.extraContents[property]) {
            //include content
            if (!gmpContentConfigFull.querySelector(`gmp-place-${property}`)) {
                gmpContentConfigFull.appendChild(
                    document.createElement(`gmp-place-${property}`)
                );
            }
        } else {
            //remove content
            if (gmpContentConfigFull.querySelector(`gmp-place-${property}`)) {
                gmpContentConfigFull.removeChild(
                    gmpContentConfigFull.querySelector(`gmp-place-${property}`)
                );
            }
        }
    }

    if (settings.all) {
        placeElement.appendChild(gmpPlaceAll);
    }

    if (settings.standard) {
        placeElement.appendChild(gmpPlaceStandard);
    }

    if (settings.custom) {
        if (settings.element == 'gmp-place-details-compact') {
            placeElement.appendChild(gmpContentConfig);
        }

        if (settings.element == 'gmp-place-details') {
            placeElement.appendChild(gmpContentConfigFull);
        }
    }
}

init();
/* [END maps_ui_kit_customization] */
