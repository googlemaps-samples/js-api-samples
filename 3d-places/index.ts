/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * * https://www.apache.org/licenses/LICENSE-2.0
 * * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/
//@ts-nocheck
// [START maps3d_places]
let map3DElement = null;
async function init() {
    const { Map3DElement } = await google.maps.importLibrary("maps3d");
    {  }
    map3DElement = new Map3DElement({
        center: { lat: 51.532, lng : -0.124, altitude: 30 }, 
        range: 1400, 
        tilt: 64,
        heading: -5,
        mode: 'HYBRID'
    });

    document.body.append(map3DElement);

    map3DElement.addEventListener('gmp-click', async (event) => {
        if (event.placeId) {
            const place = await event.fetchPlace();
            await place.fetchFields({ fields: ['*'] });

            // Display place details.
            document.getElementById("placeName").innerHTML = "<b>Name :</b><br>&nbsp;" + place.displayName;     
            document.getElementById("placeId").innerHTML = "<b>Id :</b><br>&nbsp;" + place.id;     
            document.getElementById("placeType").innerHTML = "<b>Types :<b/>";
            
            for (const type of place.types) {
                document.getElementById("placeType").innerHTML += "<br>&nbsp;" + type ;
            }

            document.getElementById("details").style.display = "block";
        }
    });

}
init(); 
// [END maps3d_places]
