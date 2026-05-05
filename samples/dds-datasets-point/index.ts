/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_dds_datasets_point]
const mapElement = document.querySelector('gmp-map')!;
let innerMap;
// [START maps_dds_datasets_point_style_function]
function setStyle(params) {
    // [START maps_dds_datasets_point_style_get_features]
    // Get the dataset feature, so we can work with all of its attributes.
    const datasetFeature = params.feature;
    // Get all of the needed dataset attributes.
    const furColors =
        datasetFeature.datasetAttributes[
            'CombinationofPrimaryandHighlightColor'
        ];
    // [END maps_dds_datasets_point_style_get_features]

    // Apply styles. Fill is primary fur color, stroke is secondary fur color.
    switch (furColors) {
        case 'Black+':
            return {
                fillColor: 'black',
                pointRadius: 8,
            };
            break;
        case 'Cinnamon+':
            return {
                fillColor: '#8b0000',
                pointRadius: 8,
            };
            break;
        case 'Cinnamon+Gray':
            return {
                fillColor: '#8b0000',
                strokeColor: 'gray',
                pointRadius: 6,
            };
            break;
        case 'Cinnamon+White':
            return {
                fillColor: '#8b0000',
                strokeColor: 'white',
                pointRadius: 6,
            };
            break;
        case 'Gray+':
            return {
                fillColor: 'gray',
                pointRadius: 8,
            };
            break;
        case 'Gray+Cinnamon':
            return {
                fillColor: 'gray',
                strokeColor: '#8b0000',
                pointRadius: 6,
            };
            break;
        case 'Gray+Cinnamon, White':
            return {
                fillColor: 'silver',
                strokeColor: '#8b0000',
                pointRadius: 6,
            };
            break;
        case 'Gray+White':
            return {
                fillColor: 'gray',
                strokeColor: 'white',
                pointRadius: 6,
            };
            break;
        default: // Color not defined.
            return {
                fillColor: 'yellow',
                pointRadius: 8,
            };
            break;
    }
}
// [END maps_dds_datasets_point_style_function]

async function initMap() {
    // Request needed libraries.
    await google.maps.importLibrary('maps');

    // Get the inner map.
    innerMap = mapElement.innerMap;

    await google.maps.event.addListenerOnce(innerMap, 'idle', () => {
        // Add the data legend.
        makeLegend(innerMap);
    });

    // Dataset ID for squirrel dataset.
    const datasetId = 'a99635b0-5e73-4b2a-8ae3-cb40f4b7f47e';
    const datasetLayer = innerMap.getDatasetFeatureLayer(datasetId);
    datasetLayer.style = setStyle;
}

// Creates a legend for the map.
async function makeLegend(innerMap) {
    const colors = {
        black: ['black'],
        cinnamon: ['#8b0000'],
        'cinnamon + gray': ['#8b0000', 'gray'],
        'cinnamon + white': ['#8b0000', 'white'],
        gray: ['gray'],
        'gray + cinnamon': ['gray', '#8b0000'],
        'gray + cinnamon + white': ['silver', '#8b0000'],
        'gray + white': ['gray', 'white'],
        'no color data': ['yellow'],
    };

    const legend = document.getElementById('legend');
    legend!.id = 'legend';
    const title = document.createElement('div');
    title.innerText = 'Fur Colors';
    title.classList.add('title');
    legend!.appendChild(title);
    let color;
    for (color in colors) {
        const wrapper = document.createElement('div');
        wrapper.id = 'container';
        const box = document.createElement('div');
        box.style.backgroundColor = colors[color][0];
        if (colors[color][1]) {
            box.style.borderColor = colors[color][1];
        } else {
            box.style.borderColor = colors[color][0];
        }
        box.classList.add('box');
        const txt = document.createElement('div');
        txt.classList.add('legend');
        txt.innerText = color;
        wrapper.appendChild(box);
        wrapper.appendChild(txt);
        legend!.appendChild(wrapper);
    }
}

initMap();
// [END maps_dds_datasets_point]
