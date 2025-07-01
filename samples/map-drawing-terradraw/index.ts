// [START maps_drawing_terradraw_libraries]
import { Loader } from '@googlemaps/js-api-loader';

import {
  TerraDraw,
  TerraDrawSelectMode,
  TerraDrawPointMode,
  TerraDrawLineStringMode,
  TerraDrawPolygonMode,
  TerraDrawRectangleMode,
  TerraDrawCircleMode,
  TerraDrawFreehandMode
} from 'terra-draw';
import { TerraDrawGoogleMapsAdapter } from 'terra-draw-google-maps-adapter';

// [END maps_drawing_terradraw_libraries]

const colorPalette = [
  "#E74C3C",
  "#FF0066",
  "#9B59B6",
  "#673AB7",
  "#3F51B5",
  "#3498DB",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#27AE60",
  "#8BC34A",
  "#CDDC39",
  "#F1C40F",
  "#FFC107",
  "#F39C12",
  "#FF5722",
  "#795548"
];

const getRandomColor = () => colorPalette[Math.floor(Math.random() * colorPalette.length)] as `#${string}`;

function processSnapshotForUndo(snapshot: any[]): any[] {
    // console.log("Processing snapshot for undo:", snapshot);
    return snapshot.map(feature => {
        const newFeature = JSON.parse(JSON.stringify(feature));

        if (newFeature.properties.mode === 'rectangle') {
            // console.log("Processing rectangle for undo:", newFeature);
            newFeature.geometry.type = 'Polygon';
            newFeature.properties.mode = 'polygon';
        } else if (newFeature.properties.mode === 'circle') {
            // console.log("Processing circle for undo:", newFeature);
            newFeature.geometry.type = 'Polygon';
            // The radius is already in properties, so we just need to ensure the mode is correct for re-creation
            newFeature.properties.mode = 'circle';
        }
        return newFeature;
    });
}

function setupModeButtons(): void {
  const modeUI = document.getElementById('mode-ui');
  if (!modeUI) {
    return;
  }

  const modeButtons: { [key: string]: string } = {
    'select-mode': 'select',
    'point-mode': 'point',
    'linestring-mode': 'linestring',
    'polygon-mode': 'polygon',
    'rectangle-mode': 'rectangle',
    'circle-mode': 'circle',
    'freehand-mode': 'freehand',
    'clear-mode': 'static'
  };

  for (const buttonId in modeButtons) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.onclick = () => {
        setActiveButton(buttonId);
        const modeName = modeButtons[buttonId];

        if (!draw) {
          return;
        }
        if (modeName === 'static') {
          draw.clear();
          draw.setMode('static');
        } else if (modeName) {
          draw.setMode(modeName);
        }
      };
    }
  }
}

function setActiveButton(buttonId: string): void {
    const buttons = document.querySelectorAll('.mode-button');
    const resizeButton = document.getElementById('resize-button');
    const isResizeActive = resizeButton?.classList.contains('active');

    buttons.forEach(button => {
        if (button.id !== 'resize-button') {
            button.classList.remove('active');
        }
    });

    const activeButton = document.getElementById(buttonId);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    if (isResizeActive) {
        resizeButton?.classList.add('active');
    }
}

function initUI(): void {
  setActiveButton('point-mode');
}

let map: google.maps.Map;
let draw: TerraDraw;
let currentMode: string = 'static';
let history: any[] = [];
let redoHistory: any[] = [];
let selectedFeatureId: string | null = null;
let isRestoring = false;
let resizingEnabled = false;
let debounceTimeout: number | undefined;

const loader = new Loader({
  apiKey: "AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8",
  version: "weekly",
  libraries: ["maps", "drawing", "marker"]
});

loader.load().then(async () => {
  try {
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const { LatLngBounds } = await google.maps.importLibrary("core") as google.maps.CoreLibrary;
    const { Data } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;

    const mapOptions: google.maps.MapOptions = {
      center: { lat: 48.862, lng: 2.342 },
      zoom: 12,
      mapId:'c306b3c6dd3ed8d9', // raster '6a17c323f461e521',
      mapTypeId: 'roadmap',
      zoomControl:false,
      tilt: 45,
      mapTypeControl: true,
      clickableIcons:false,
      streetViewControl:false,
      fullscreenControl:false,
    };

    const mapDiv = document.getElementById("map") as HTMLElement;
    map = new Map(mapDiv, mapOptions);

    map.addListener("click", () => {
        if (draw) {
            console.log("Current draw mode on map click:", draw.getMode());
        }
    });

    map.addListener("projection_changed", () => {

        // [START maps_drawing_terradraw_modes]

      draw = new TerraDraw({
        adapter: new TerraDrawGoogleMapsAdapter({ map, lib: google.maps, coordinatePrecision: 9 }),
        modes: [
            new TerraDrawSelectMode({
                flags: {
                    polygon: {
                        feature: {
                            draggable: true,
                            rotateable: true,
                            coordinates: {
                                midpoints: true,
                                draggable: true,
                                deletable: true,
                            },
                        },
                    },
                    linestring: {
                        feature: {
                            draggable: true,
                            rotateable: true,
                            coordinates: {
                                midpoints: true,
                                draggable: true,
                                deletable: true,
                            },
                        },
                    },
                    point: {
                        feature: {
                            draggable: true,
                            rotateable: true,
                        },
                    },
                    rectangle: {
                        feature: {
                            draggable: true,
                            rotateable: true,
                            coordinates: {
                                midpoints: true,
                                draggable: true,
                                deletable: true,
                            },
                        },
                    },
                    circle: {
                        feature: {
                            draggable: true,
                            rotateable: true,
                            coordinates: {
                                midpoints: true,
                                draggable: true,
                                deletable: true,
                            },
                        },
                    },
                    freehand: {
                        feature: {
                            draggable: true,
                            rotateable: true,
                            coordinates: {
                                midpoints: true,
                                draggable: true,
                                deletable: true,
                            },
                        },
                    },
                },
            }),
            
            new TerraDrawPointMode({
                editable: true,
                styles: { pointColor: getRandomColor() },
            }),
            new TerraDrawLineStringMode({
                editable: true,
                styles: { lineStringColor: getRandomColor() },
            }),
            new TerraDrawPolygonMode({
                editable: true,
                styles: (() => {
                    const color = getRandomColor();
                    return {
                        fillColor: color,
                        outlineColor: color,
                    };
                })(),
            }),
            new TerraDrawRectangleMode({
                styles: (() => {
                    const color = getRandomColor();
                    return {
                        fillColor: color,
                        outlineColor: color,
                    };
                })(),
            }),
            new TerraDrawCircleMode({
                styles: (() => {
                    const color = getRandomColor();
                    return {
                        fillColor: color,
                        outlineColor: color,
                    };
                })(),
            }),
            new TerraDrawFreehandMode({
                styles: (() => {
                    const color = getRandomColor();
                    return {
                        fillColor: color,
                        outlineColor: color,
                    };
                })(),
            }),
       ],
     });

      draw.start();


      draw.on('ready', () => {
        console.log("TerraDraw is ready!");
        initUI();
        setupModeButtons();
        draw.setMode('point');
        currentMode = 'point';
        setActiveButton('point-mode');

        draw.on("select", (id) => {
            // console.log(`Feature selected: ${id}`);
            if (selectedFeatureId && selectedFeatureId !== id) {
                draw.deselectFeature(selectedFeatureId);
            }
            selectedFeatureId = id as string;
        });

        draw.on("deselect", () => {
            // console.log("Feature deselected");
            selectedFeatureId = null;
        });

        history.push(processSnapshotForUndo(draw.getSnapshot())); // Push initial empty state

        draw.on("change", (ids, type) => {
            if (isRestoring) {
                return;
            }

            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }

            debounceTimeout = window.setTimeout(() => {
                const snapshot = draw.getSnapshot();
                const processedSnapshot = processSnapshotForUndo(snapshot);
                const filteredSnapshot = processedSnapshot.filter(
                    (f) => !f.properties.midPoint && !f.properties.selectionPoint
                );
                history.push(filteredSnapshot);
                redoHistory = [];
            }, 200);
        });

        // [END maps_drawing_terradraw_modes]

        const exportButton = document.getElementById('export-button');
        if (exportButton) {
            exportButton.onclick = () => {
                const features = draw.getSnapshot();
                const geojson = {
                    type: "FeatureCollection",
                    features: features,
                };
                const data = JSON.stringify(geojson, null, 2);
                const blob = new Blob([data], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "drawing.geojson";
                link.click();
                URL.revokeObjectURL(url);
            };
        }

        const uploadButton = document.getElementById('upload-button');
        const uploadInput = document.getElementById('upload-input') as HTMLInputElement;

        if (uploadButton && uploadInput) {
            uploadButton.onclick = () => {
                uploadInput.click();
            };

            uploadInput.onchange = (event) => {
                const file = (event.target as HTMLInputElement).files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const geojson = JSON.parse(e.target?.result as string);
                            if (geojson.type === "FeatureCollection") {
                                draw.addFeatures(geojson.features);
                            } else {
                                alert("Invalid GeoJSON file: must be a FeatureCollection.");
                            }
                        } catch (error) {
                            alert("Error parsing GeoJSON file.");
                        }
                    };
                    reader.readAsText(file);
                }
            };
        }

        const resizeButton = document.getElementById('resize-button');
        if (resizeButton) {
            resizeButton.onclick = () => {
                resizingEnabled = !resizingEnabled;
                resizeButton.classList.toggle('active', resizingEnabled);

                const flags = {
                    polygon: { feature: { draggable: true, coordinates: { resizable: resizingEnabled ? 'center' : undefined, draggable: !resizingEnabled } } },
                    linestring: { feature: { draggable: true, coordinates: { resizable: resizingEnabled ? 'center' : undefined, draggable: !resizingEnabled } } },
                    rectangle: { feature: { draggable: true, coordinates: { resizable: resizingEnabled ? 'center' : undefined, draggable: !resizingEnabled } } },
                    circle: { feature: { draggable: true, coordinates: { resizable: resizingEnabled ? 'center' : undefined, draggable: !resizingEnabled } } },
                    freehand: { feature: { draggable: true, coordinates: { resizable: resizingEnabled ? 'center' : undefined, draggable: !resizingEnabled } } },
                };

                console.log("Updating flags:", flags);
                draw.updateModeOptions('select', { flags });
            };
        }

        const deleteSelectedButton = document.getElementById('delete-selected-button');
        if (deleteSelectedButton) {
            deleteSelectedButton.onclick = () => {
                if (selectedFeatureId) {
                    draw.removeFeatures([selectedFeatureId]);
                } else {
                    const features = draw.getSnapshot();
                    if (features.length > 0) {
                        const lastFeature = features[features.length - 1];
                        if (lastFeature.id) {
                            draw.removeFeatures([lastFeature.id]);
                        }
                    }
                }
            };
        }

        const undoButton = document.getElementById('undo-button');
        if (undoButton) {
            undoButton.onclick = () => {
                if (history.length > 1) {
                    redoHistory.push(history.pop());
                    const snapshotToRestore = history[history.length - 1];
                    console.log("Restoring snapshot (undo):", snapshotToRestore);
                    isRestoring = true;
                    draw.clear();
                    draw.addFeatures(snapshotToRestore);
                    setTimeout(() => { isRestoring = false; }, 0);
                }
            };
        }

        const redoButton = document.getElementById('redo-button');
        if (redoButton) {
            redoButton.onclick = () => {
                if (redoHistory.length > 0) {
                    const snapshot = redoHistory.pop();
                    console.log("Restoring snapshot (redo):", snapshot);
                    history.push(snapshot);
                    isRestoring = true;
                    draw.clear();
                    draw.addFeatures(snapshot);
                    setTimeout(() => { isRestoring = false; }, 0);
                }
            };
        }
      });
      
      function rotateFeature(feature, angle) {
          const newFeature = JSON.parse(JSON.stringify(feature));
          const coordinates = newFeature.geometry.coordinates;
          const center = getCenter(coordinates);
      
          const rotatedCoordinates = coordinates.map(ring => {
              return ring.map(point => {
                  const x = point[0] - center[0];
                  const y = point[1] - center[1];
                  const newX = x * Math.cos(angle * Math.PI / 180) - y * Math.sin(angle * Math.PI / 180);
                  const newY = x * Math.sin(angle * Math.PI / 180) + y * Math.cos(angle * Math.PI / 180);
                  return [newX + center[0], newY + center[1]];
              });
          });
      
          newFeature.geometry.coordinates = rotatedCoordinates;
          return newFeature;
      }
      
      function getCenter(coordinates) {
          let x = 0;
          let y = 0;
          let count = 0;
          coordinates.forEach(ring => {
              ring.forEach(point => {
                  x += point[0];
                  y += point[1];
                  count++;
              });
          });
          return [x / count, y / count];
      }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'r' && selectedFeatureId) {
                const features = draw.getSnapshot();
                const selectedFeature = features.find(f => f.id === selectedFeatureId);

                if (selectedFeature) {
                    const newFeature = rotateFeature(selectedFeature, 15);
                    draw.addFeatures([newFeature]);
                }
            }
        });
    });

  } catch (e) {
    console.error("Error loading Google Maps API:", e);
  }
}).catch(e => {
  console.error("Error loading Google Maps API:", e);
});
