// @ts-nocheck

/* [START maps_ui_kit_place_search_details] */
const map = document.querySelector("gmp-map");
const placeList = document.querySelector("gmp-place-list");
const queryInput = document.querySelector(".query-input");
const searchButton = document.querySelector(".search-button");
const placeDetails = document.querySelector("gmp-place-details");
let markers = {};
let infowindow = {};
// let pinMarkers = [];



async function init() {
    await google.maps.importLibrary("places");
    const {InfoWindow} = await google.maps.importLibrary("maps");

    infowindow = new InfoWindow();

    findCurrentLocation();

    map.innerMap.setOptions({
        mapTypeControl: false,
        clickableIcons: false,
    });

    searchButton.addEventListener("click", () => {
        for(marker in markers){
            markers[marker].map = null;
        }
        markers = {};
        if (queryInput.value) {
            placeList.style.display = 'block';
            placeList.configureFromSearchByTextRequest({
                textQuery: queryInput.value,
                locationBias: map.innerMap.getBounds()
            }).then(addMarkers);
        }
    });

    placeList.addEventListener("gmp-placeselect", ({ place }) => {
        markers[place.id].click();

    });
}

async function addMarkers(){
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { LatLngBounds } = await google.maps.importLibrary("core");

    const bounds = new LatLngBounds();
    
    if(placeList.places.length > 0){
        placeList.places.forEach((place) => {
            let marker = new AdvancedMarkerElement({
                map: map.innerMap,
                position: place.location
            });

            marker.metadata = {id: place.id};
            markers[place.id] = marker;
            bounds.extend(place.location);
            // pinMarkers.push(marker);

            marker.addListener('click',(event) => {
                if(infowindow.isOpen){
                    infowindow.close();
                }
                placeDetails.style.display = 'block';
                placeDetails.configureFromPlace(place);
                placeDetails.style.width = "350px";
                infowindow.setOptions({
                    content: placeDetails
                });
                infowindow.open({
                    anchor: marker,
                    map: map.innerMap
                });
                placeDetails.addEventListener('gmp-load',() => {
                    map.innerMap.fitBounds(place.viewport, {top: placeDetails.offsetHeight || 206, left: 200});
                });
                
            });
            map.innerMap.setCenter(bounds.getCenter());
            map.innerMap.fitBounds(bounds);
        });
    }
}

async function findCurrentLocation(){
    const { LatLng } = await google.maps.importLibrary("core");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = new LatLng(position.coords.latitude,position.coords.longitude);
            map.innerMap.panTo(pos);
            map.innerMap.setZoom(16);
          },
          () => {
            console.log('The Geolocation service failed.');
            map.innerMap.setZoom(16);
          },
        );
      } else {
        console.log("Your browser doesn't support geolocation");
        map.innerMap.setZoom(16);
      }
      
}

init();
/* [END maps_ui_kit_place_search_details] */

