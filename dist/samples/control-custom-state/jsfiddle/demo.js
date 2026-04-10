"use strict";
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

let innerMap;
const mapElement = document.querySelector('gmp-map');
let center = { lat: 41.85, lng: -87.65 };
// TODO: I don't think we need this class anymore.
/**
 * The CenterControl adds a control to the map that recenters the map
 * on Chicago.
 */
// class CenterControl {
//     private map_: google.maps.Map;
//     private center_: google.maps.LatLng;
//     constructor(
//         controlDiv: HTMLElement,
//         map: google.maps.Map,
//         center: google.maps.LatLngLiteral
//     ) {
//         this.map_ = map;
// Set the center property upon construction
// this.center_ = new google.maps.LatLng(center);
// controlDiv.style.clear = 'both';
// Set CSS for the control border
// const goCenterUI = document.createElement('button');
// goCenterUI.id = 'goCenterUI';
// goCenterUI.title = 'Click to recenter the map';
// controlDiv.appendChild(goCenterUI);
// Set CSS for the control interior
// const goCenterText = document.createElement('div');
// goCenterText.id = 'goCenterText';
// goCenterText.innerHTML = 'Center Map';
// goCenterUI.appendChild(goCenterText);
// Set CSS for the setCenter control border
// const setCenterUI = document.createElement('button');
// setCenterUI.id = 'setCenterUI';
// setCenterUI.title = 'Click to change the center of the map';
// controlDiv.appendChild(setCenterUI);
// // Set CSS for the control interior
// const setCenterText = document.createElement('div');
// setCenterText.id = 'setCenterText';
// setCenterText.innerHTML = 'Set Center';
// setCenterUI.appendChild(setCenterText);
// Set up the click event listener for 'Center Map': Set the center of
// the map
// to the current center of the control.
// goCenterUI.addEventListener('click', () => {
//     const currentCenter = this.center_;
//     this.map_.setCenter(currentCenter);
// });
// // Set up the click event listener for 'Set Center': Set the center of
// // the control to the current center of the map.
// setCenterUI.addEventListener('click', () => {
//     const newCenter = this.map_.getCenter()!;
//     if (newCenter) {
//         this.center_ = newCenter;
//     }
// });
//     }
// }
async function initMap() {
    (await google.maps.importLibrary('maps'));
    innerMap = mapElement.innerMap;
    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    // const centerControlDiv = document.createElement('div');
    // const control = new CenterControl(centerControlDiv, innerMap, chicago);
    // centerControlDiv.style.zIndex = '1';
    // centerControlDiv.style.paddingTop = '10px';
    // innerMap.controls[google.maps.ControlPosition.TOP_CENTER].push(
    //     centerControlDiv
    // );
    // Get the button UI elements.
    const setCenterButton = document.getElementById('btnCenterMap');
    const resetCenterButton = document.getElementById('btnSetCenter');
    setCenterButton.addEventListener('click', () => {
        const currentCenter = center;
        innerMap.setCenter(currentCenter);
    });
    // Set up the click event listener for 'Set Center': Set the center of
    // the control to the current center of the map.
    resetCenterButton.addEventListener('click', () => {
        const newCenter = innerMap.getCenter();
        if (newCenter) {
            center = newCenter;
        }
    });
}
initMap();

