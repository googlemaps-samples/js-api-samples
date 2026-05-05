(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:`open`}),this.shadowRoot.innerHTML=`
            <style>
                :host {
                    display: block;
                    position: relative; /* Needed for arrow pseudo-elements */
                    margin-top: -35px; /* Offset upwards to align arrow with marker */
                }
                .widget-container {
                    background-color: white; /* Light mode background */
                    color: #222222; /* Light mode text color */
                    padding: 4px 8px;
                    border-radius: 50px;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); /* Black box shadow with 0.3 opacity for light mode */
                    font-family: 'Google Sans', Roboto, sans-serif;
                    width: auto; /* Allow width to adjust to content */
                    text-align: center;
                    position: relative; /* Needed to position arrow relative to this container */
                    min-width: 78px;
                    min-height: 35px; /* Ensure minimum height for stable layout */
                    display: flex; /* Use flexbox for centering */
                    flex-direction: column; /* Stack children vertically */
                    justify-content: center; /* Vertically center content */
                    align-items: center; /* Horizontally center content */
                    user-select: none; /* Prevent text selection */
                    overflow: visible; /* Allow arrow pseudo-element to be visible */
                    box-sizing: border-box; /* Include padding and border in the element's total width and height */
                    max-height: 50px; /* Set max-height for default state */
                    transform: translateY(-5px);
                }
                /* Arrow indent */
                .widget-container::after {
                    content: "";
                    position: absolute;
                    bottom: -5px; /* Position below the widget container */
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-top: 5px solid white; /* Match background color of widget-container */
                    z-index: 1;
                }

                .weather-info-basic {
                    display: flex;
                    align-items: center;
                    justify-content: center; /* Center items */
                    gap: 4px; /* Add gap between temperature and icon */
                    margin-bottom: 0; /* Remove bottom margin */
                    width: 100%; /* Take full width */
                    min-height: 35px; /* Ensure minimum height for stable layout */
                }
                .weather-info-basic img {
                    width: 30px;
                    height: 30px;
                    filter: invert(0); /* Default filter for light mode */
                    flex-shrink: 0; /* Prevent shrinking */
                }
                #condition-icon {
                    display: none; /* Hide the image by default */
                }
                .temperature {
                    font-size: 1.5em;
                    font-weight: bold;
                    align:right;
                }
                .error-message {
                    font-size: 1.2em;
                    font-weight: normal; /* Not bold for error messages */
                    width:80px;
                 }
                .rain-details {
                    font-size: 0.9em; /* Match detail line font size */
                    display: none; /* Hide by default */
                    align-items: center;
                    justify-content: flex-start; /* Align rain info to the left */
                    flex-direction: row; /* Arrange rain details horizontally */
                    gap: 5px; /* Space between rain probability and qpf */
                    margin-top: 5px; /* Add space above rain details */
                    width: 100%; /* Take full width */
                }
                 .rain-details img {
                    width: 18px;
                    height: 18px;
                    margin-right: 5px;
                    /* No filter by default (light mode), icon is white */
                 }

                /* Dark mode styles */
                :host(.dark-mode) .widget-container {
                    background-color: #222222; /* Dark mode background */
                    color: white; /* Dark mode text color */
                    box-shadow: 0 2px 6px rgba(255, 255, 255, 0.3); /* White box shadow with 0.3 opacity for dark mode */
                }

                :host(.dark-mode) .widget-container::after {
                    border-top-color: #222222; /* Match dark mode background color */
                }

                :host(.dark-mode) .weather-info-basic img:not(#condition-icon) {
                  filter: none; /* Remove filter in dark mode */
               }

                /* In dark mode, the rain icon should be white, so no filter is needed as the default is white */

                /* Highlighted state styles (on click) */
                .widget-container.highlight {
                    border-radius: 8px; /* Match non-highlighted border-radius */
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); /* Keep the same box shadow */
                    max-height: 150px; /* Set a larger max-height for expanded state */
                    padding: 10px 15px; /* Keep the same padding */
                    width: auto; /* Allow width to expand */
                    min-height: 70px; /* Increase min-height for expanded state */
                    justify-content: center; /* Vertically center content */
                    transition: all 0.3s ease-out;
                }
                .widget-container.highlight .rain-details {
                    display: flex; /* Show rain details when highlighted */
                }

                /* Dark mode highlighted state */
                :host(.dark-mode) .widget-container.highlight {
                    box-shadow: 0 2px 6px rgba(255, 255, 255, 0.3); /* Keep the same box shadow */
                }



            </style>
            <style>
                :host(:not(.dark-mode)) .rain-details img {
                    filter: invert(1); /* Invert for light mode to make white icon black */
                }
            </style>
            <div class="widget-container">
                <div class="weather-info-basic">
                    <img id="condition-icon" src="" alt="Weather Icon">
                    <span id="temperature" class="temperature"></span>
                </div>
                <div id="rain-details" class="rain-details">
                    <img src="/icons/rain-probability-white.svg" alt="Rain Probability Icon">
                    <span id="rain-probability"></span>
                    <span id="rain-qpf"></span>
                </div>
            </div>
        `}set data(e){let t=this.shadowRoot.getElementById(`condition-icon`),n=this.shadowRoot.getElementById(`temperature`),r=this.shadowRoot.getElementById(`rain-probability`),i=this.shadowRoot.getElementById(`rain-qpf`),a=this.shadowRoot.getElementById(`rain-details`);if(!e||e.error){t.style.display=`none`,a.style.display=`none`,e&&e.error?(n.textContent=e.error,n.classList.add(`error-message`)):(n.textContent=`N/A`,n.classList.remove(`error-message`));return}let o=e.daytimeForecast||e.nighttimeForecast,s,c,l,u;if(o){let t=e;s=t.maxTemperature?.degrees,c=t.daytimeForecast?.weatherCondition?.iconBaseUri||t.nighttimeForecast?.weatherCondition?.iconBaseUri,l=t.precipitation?.probability?.percent,u=t.precipitation?.qpf?.quantity}else{let t=e;s=t.temperature?.degrees,c=t.weatherCondition?.iconBaseUri,l=t.precipitation?.probability?.percent,u=t.currentConditionsHistory?.qpf?.quantity===void 0?t.precipitation?.qpf?.quantity:t.currentConditionsHistory.qpf.quantity}let d=``;d=c?`${c}.svg`:`/icons/cloud-cover-white.svg`,t.style.display=`none`,t.onload=()=>{t.style.display=`inline-block`},t.onerror=()=>{console.error(`Failed to load weather icon:`,d),t.style.display=`none`},t.src=d,n.textContent=`${s===void 0?`N/A`:s.toFixed(0)}°C`,n.classList.remove(`error-message`),l==null?r.textContent=`0%`:r.textContent=`${l}%`,u==null?i.textContent=`0.0mm`:i.textContent=`${u.toFixed(1)}mm`}setMode(e){e===`dark`?this.classList.add(`dark-mode`):this.classList.remove(`dark-mode`)}};customElements.define(`simple-weather-widget`,e);var t=`https://weather.googleapis.com/v1/currentConditions:lookup`,n=`AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8`,r=`c306b3c6dd3ed8d9`,i=`6b73a9fe7e831a00`,a,o=null,s=[],c=!1;async function l(){google.maps.importLibrary(`marker`);let{Map:e}=await google.maps.importLibrary(`maps`);a=new e(document.getElementById(`map`),{center:{lat:48.8566,lng:2.3522},zoom:6,minZoom:5,disableDefaultUI:!0,mapId:`c306b3c6dd3ed8d9`,clickableIcons:!1});let t=a.getCenter();t&&await u({name:`Initial Location`,lat:t.lat(),lng:t.lng()},`dynamic`),a.addListener(`click`,async e=>{let t=e.domEvent.target,n=!1;for(;t;){if(t.tagName===`SIMPLE-WEATHER-WIDGET`||t.classList.contains(`gm-control-active`)){n=!0;break}t=t.parentElement}if(!n&&e.latLng){if(o){let e=o.shadowRoot.getElementById(`rain-details`);e.style.display=`none`,o.shadowRoot.querySelector(`.widget-container`).classList.remove(`highlight`);let t=s.find(e=>e.content===o);t&&(t.zIndex=null),o=null}let t=s.findIndex(e=>e.markerType===`dynamic`);t!==-1&&(s[t].map=null,s.splice(t,1)),await u({name:`Clicked Location`,lat:e.latLng.lat(),lng:e.latLng.lng()},`dynamic`)}})}async function u(e,t){let[{AdvancedMarkerElement:n},{LatLng:r}]=await Promise.all([google.maps.importLibrary(`marker`),google.maps.importLibrary(`core`)]),i=document.createElement(`simple-weather-widget`);document.getElementById(`map`).classList.contains(`dark-mode`)&&i.setMode(`dark`);let c=new n({map:a,position:{lat:e.lat,lng:e.lng},content:i,title:e.name,gmpClickable:!0});c.markerType=t,h(c,i,new r(e.lat,e.lng)),c.addEventListener(`gmp-click`,()=>{let e=i.shadowRoot.querySelector(`.widget-container`);if(o&&o!==i){o.shadowRoot.querySelector(`.widget-container`).classList.remove(`highlight`);let e=s.find(e=>e.content===o);e&&(e.zIndex=null)}e.classList.toggle(`highlight`),e.classList.contains(`highlight`)?(o=i,c.zIndex=1):(o=null,c.zIndex=null)}),s.push(c)}async function d(){let e=document.getElementById(`map`);e.classList.toggle(`dark-mode`);let t=document.getElementById(`mode-toggle`);t&&(e.classList.contains(`dark-mode`)?t.textContent=`Light Mode`:t.textContent=`Dark Mode`),s.forEach(e=>{e.map=null});let{Map:n}=await google.maps.importLibrary(`maps`);a=new n(e,{center:a.getCenter(),zoom:a.getZoom(),minZoom:5,disableDefaultUI:!0,mapId:e.classList.contains(`dark-mode`)?i:r,clickableIcons:!1});let c=[...s];s=[];for(let e of c){e.map=a;let t=e.content;document.getElementById(`map`).classList.contains(`dark-mode`)?t.setMode(`dark`):t.setMode(`light`),s.push(e)}a.addListener(`click`,async e=>{let t=e.domEvent.target,n=!1;for(;t;){if(t.tagName===`SIMPLE-WEATHER-WIDGET`||t.classList.contains(`gm-control-active`)){n=!0;break}t=t.parentElement}if(!n&&e.latLng){if(o){let e=o.shadowRoot.getElementById(`rain-details`);e.style.display=`none`,o.shadowRoot.querySelector(`.widget-container`).classList.remove(`highlight`);let t=s.find(e=>e.content===o);t&&(t.zIndex=null),o=null}let t=s.findIndex(e=>e.markerType===`dynamic`);t!==-1&&(s[t].map=null,s.splice(t,1)),await u({name:`Clicked Location`,lat:e.latLng.lat(),lng:e.latLng.lng()},`dynamic`)}})}var f=[{name:`London`,lat:51.5074,lng:-.1278},{name:`Brussels`,lat:50.8503,lng:4.3517},{name:`Luxembourg`,lat:49.8153,lng:6.1296},{name:`Amsterdam`,lat:52.3676,lng:4.9041},{name:`Berlin`,lat:52.52,lng:13.405},{name:`Rome`,lat:41.9028,lng:12.4964},{name:`Geneva`,lat:46.2044,lng:6.14324},{name:`Barcelona`,lat:41.3874,lng:-2.1686},{name:`Milan`,lat:45.4685,lng:9.1824}];async function p(){let{AdvancedMarkerElement:e}=await google.maps.importLibrary(`marker`);for(let e of f)await u(e,`button`)}function m(){if(o){let e=s.find(e=>e.content===o&&e.markerType===`button`);if(e){let t=o.shadowRoot.getElementById(`rain-details`);t.style.display=`none`,o.shadowRoot.querySelector(`.widget-container`).classList.remove(`highlight`),e.zIndex=null,o=null}}s.filter(e=>e.markerType===`button`).forEach(e=>{e.map=null;let t=s.indexOf(e);t>-1&&s.splice(t,1)})}async function h(e,r,i){let a=`${t}?key=${n}&location.latitude=${i.lat()}&location.longitude=${i.lng()}`;try{let e=await fetch(a);if(e.ok){let t=await e.json();console.log(`Weather data fetched for marker:`,t),r.data=t}else{let t=await e.json();if(console.error(`API error response:`,t),e.status===404&&t?.error?.status===`NOT_FOUND`)r.data={error:`Location not supported`};else throw Error(`HTTP error! status: ${e.status}`)}}catch(e){console.error(`Error fetching weather data for marker:`,e),r.data={error:`Failed to fetch weather data`}}}l(),customElements.whenDefined(`simple-weather-widget`).then(()=>{let e=document.getElementById(`mode-toggle`);e&&e.addEventListener(`click`,()=>{d()});let t=document.getElementById(`load-markers-button`);t&&t.addEventListener(`click`,()=>{c?(m(),c=!1,t.textContent=`Load Markers`):(p(),c=!0,t.textContent=`Remove Markers`)})});