/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_overlay_popover]
async function init(): Promise<void> {
    const [{ OverlayView }, { LatLng }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('core'),
    ]);

    const mapElement = document.querySelector('gmp-map')!;
    const innerMap = mapElement.innerMap;

    /**
     * A customized popover on the map.
     */
    class Popover extends OverlayView {
        position: google.maps.LatLng;
        containerDiv: HTMLDivElement;

        constructor(position: google.maps.LatLng, content: HTMLElement) {
            super();
            this.position = position;

            content.classList.add('popover-bubble');

            const bubbleAnchor = document.createElement('div');
            bubbleAnchor.classList.add('popover-bubble-anchor');
            bubbleAnchor.appendChild(content);

            this.containerDiv = document.createElement('div');
            this.containerDiv.classList.add('popover-container');
            this.containerDiv.appendChild(bubbleAnchor);

            const style = document.createElement('style');
            style.textContent = `
        .popover-bubble {
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(-50%, -100%);
          background-color: white;
          padding: 15px;
          border-radius: 5px;
          font-family: sans-serif;
          font-size: 16px;
          overflow-y: auto;
          max-height: 120px;
          box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.5);
        }
        .popover-bubble-anchor {
          position: absolute;
          width: 100%;
          bottom: 8px;
          left: 0;
        }
        .popover-bubble-anchor::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(-50%, 0);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid white;
        }
        .popover-container {
          cursor: auto;
          height: 0;
          position: absolute;
          width: 250px;
        }
      `;
            this.containerDiv.appendChild(style);

            OverlayView.preventMapHitsAndGesturesFrom(this.containerDiv);
        }

        onAdd() {
            this.getPanes()!.floatPane.appendChild(this.containerDiv);
        }

        onRemove() {
            if (this.containerDiv.parentElement) {
                this.containerDiv.parentElement.removeChild(this.containerDiv);
            }
        }

        draw() {
            const divPosition = this.getProjection().fromLatLngToDivPixel(
                this.position
            )!;

            const display =
                Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
                    ? 'block'
                    : 'none';

            if (display === 'block') {
                this.containerDiv.style.left = String(divPosition.x) + 'px';
                this.containerDiv.style.top = String(divPosition.y) + 'px';
            }

            if (this.containerDiv.style.display !== display) {
                this.containerDiv.style.display = display;
            }
        }
    }

    const popover = new Popover(
        new LatLng(-33.866, 151.196),
        document.getElementById('content')!
    );
    popover.setMap(innerMap);
}

void init();
// [END maps_overlay_popover]
