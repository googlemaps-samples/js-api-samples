/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_dds_datasets_point]
const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;
let innerMap;

async function initMap() {
    // Request needed libraries.
    await google.maps.importLibrary('maps') as google.maps.MapsLibrary;

    // Get the inner map.
    innerMap = mapElement.innerMap;

    // Add the data legend.
    //makeLegend(innerMap);

    // Dataset ID for squirrel dataset.
    const datasetId = 'a99635b0-5e73-4b2a-8ae3-cb40f4b7f47e';
    //const datasetLayer = innerMap.getDatasetFeatureLayer(datasetId);
    //datasetLayer.style = setStyle;
}

// Creates a legend for the map.
/**
async function makeLegend(innerMap) {
    let colors = {
        'black': ['black'],
        'cinnamon': ['#8b0000'],
        'cinnamon + gray': ['#8b0000','gray'],
        'cinnamon + white': ['#8b0000', 'white'],
        'gray': ['gray'],
        'gray + cinnamon': ['gray', '#8b0000'],
        'gray + cinnamon + white': ['silver', '#8b0000'],
        'gray + white': ['gray', 'white'],
        'no color data': ['yellow'],
    };

    let legend = document.getElementById('legend');
    legend!.id = 'legend';
    let title = document.createElement('div');
    title.innerText = 'Fur Colors';
    title.classList.add('title');
    legend!.appendChild(title);
    let color;
    for (color in colors) {
        let wrapper = document.createElement('div');
        wrapper.id = 'container';
        let box = document.createElement('div');
        box.style.backgroundColor = colors[color][0];
        if (colors[color][1]) {
            box.style.borderColor = colors[color][1];
        } else {
            box.style.borderColor = colors[color][0];
        }
        box.classList.add('box');
        let txt = document.createElement('div');
        txt.classList.add('legend');
        txt.innerText = color;
        wrapper.appendChild(box);
        wrapper.appendChild(txt);
        legend!.appendChild(wrapper);
    }
}*/

initMap();
// [END maps_dds_datasets_point]
