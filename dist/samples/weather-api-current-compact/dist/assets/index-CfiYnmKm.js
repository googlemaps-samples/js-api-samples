(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function n(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(t){if(t.ep)return;t.ep=!0;const o=n(t);fetch(t.href,o)}})();class x extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=`
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
        `}set data(e){const n=this.shadowRoot.getElementById("condition-icon"),i=this.shadowRoot.getElementById("temperature"),t=this.shadowRoot.getElementById("rain-probability"),o=this.shadowRoot.getElementById("rain-qpf"),r=this.shadowRoot.getElementById("rain-details");if(!e||e.error){n.style.display="none",r.style.display="none",e&&e.error?(i.textContent=e.error,i.classList.add("error-message")):(i.textContent="N/A",i.classList.remove("error-message"));return}const a=e.daytimeForecast||e.nighttimeForecast;let c,g,h,p;if(a){const m=e;c=m.maxTemperature?.degrees,g=m.daytimeForecast?.weatherCondition?.iconBaseUri||m.nighttimeForecast?.weatherCondition?.iconBaseUri,h=m.precipitation?.probability?.percent,p=m.precipitation?.qpf?.quantity}else{const m=e;c=m.temperature?.degrees,g=m.weatherCondition?.iconBaseUri,h=m.precipitation?.probability?.percent,p=m.currentConditionsHistory?.qpf?.quantity!==void 0?m.currentConditionsHistory.qpf.quantity:m.precipitation?.qpf?.quantity}let u="";g?u=`${g}.svg`:u="/icons/cloud-cover-white.svg",n.style.display="none",n.onload=()=>{n.style.display="inline-block"},n.onerror=()=>{console.error("Failed to load weather icon:",u),n.style.display="none"},n.src=u,i.textContent=`${c!==void 0?c.toFixed(0):"N/A"}°C`,i.classList.remove("error-message"),h!=null?t.textContent=`${h}%`:t.textContent="0%",p!=null?o.textContent=`${p.toFixed(1)}mm`:o.textContent="0.0mm"}setMode(e){e==="dark"?this.classList.add("dark-mode"):this.classList.remove("dark-mode")}}customElements.define("simple-weather-widget",x);const k="https://weather.googleapis.com/v1/currentConditions:lookup",L="AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8",v="c306b3c6dd3ed8d9",E="6b73a9fe7e831a00";let f,s=null,d=[],w=!1;async function I(){const{Map:l}=await google.maps.importLibrary("maps"),{AdvancedMarkerElement:e}=await google.maps.importLibrary("marker");f=new l(document.getElementById("map"),{center:{lat:48.8566,lng:2.3522},zoom:6,minZoom:5,disableDefaultUI:!0,mapId:"c306b3c6dd3ed8d9",clickableIcons:!1});const n=f.getCenter();n&&await y({name:"Initial Location",lat:n.lat(),lng:n.lng()},"dynamic"),f.addListener("click",async i=>{let t=i.domEvent.target,o=!1;for(;t;){if(t.tagName==="SIMPLE-WEATHER-WIDGET"||t.classList.contains("gm-control-active")){o=!0;break}t=t.parentElement}if(!o&&i.latLng){if(s){const a=s.shadowRoot.getElementById("rain-details");a.style.display="none",s.shadowRoot.querySelector(".widget-container").classList.remove("highlight");const g=d.find(h=>h.content===s);g&&(g.zIndex=null),s=null}const r=d.findIndex(a=>a.markerType==="dynamic");r!==-1&&(d[r].map=null,d.splice(r,1)),await y({name:"Clicked Location",lat:i.latLng.lat(),lng:i.latLng.lng()},"dynamic")}})}async function y(l,e){const{AdvancedMarkerElement:n}=await google.maps.importLibrary("marker"),i=document.createElement("simple-weather-widget");document.getElementById("map").classList.contains("dark-mode")&&i.setMode("dark");const o=new n({map:f,position:{lat:l.lat,lng:l.lng},content:i,title:l.name});o.markerType=e,B(o,i,new google.maps.LatLng(l.lat,l.lng)),o.addListener("click",()=>{const r=i.shadowRoot.querySelector(".widget-container");if(s&&s!==i){s.shadowRoot.querySelector(".widget-container").classList.remove("highlight");const c=d.find(g=>g.content===s);c&&(c.zIndex=null)}r.classList.toggle("highlight"),r.classList.contains("highlight")?(s=i,o.zIndex=1):(s=null,o.zIndex=null)}),d.push(o)}async function C(){const l=document.getElementById("map");l.classList.toggle("dark-mode");const e=document.getElementById("mode-toggle");e&&(l.classList.contains("dark-mode")?e.textContent="Light Mode":e.textContent="Dark Mode"),d.forEach(a=>{a.map=null});const{Map:n}=await google.maps.importLibrary("maps"),i=f.getCenter(),t=f.getZoom(),o=l.classList.contains("dark-mode")?E:v;f=new n(l,{center:i,zoom:t,minZoom:5,disableDefaultUI:!0,mapId:o,clickableIcons:!1});const r=[...d];d=[];for(const a of r){a.map=f;const c=a.content;document.getElementById("map").classList.contains("dark-mode")?c.setMode("dark"):c.setMode("light"),d.push(a)}f.addListener("click",async a=>{let c=a.domEvent.target,g=!1;for(;c;){if(c.tagName==="SIMPLE-WEATHER-WIDGET"||c.classList.contains("gm-control-active")){g=!0;break}c=c.parentElement}if(!g&&a.latLng){if(s){const p=s.shadowRoot.getElementById("rain-details");p.style.display="none",s.shadowRoot.querySelector(".widget-container").classList.remove("highlight");const m=d.find(b=>b.content===s);m&&(m.zIndex=null),s=null}const h=d.findIndex(p=>p.markerType==="dynamic");h!==-1&&(d[h].map=null,d.splice(h,1)),await y({name:"Clicked Location",lat:a.latLng.lat(),lng:a.latLng.lng()},"dynamic")}})}const M=[{name:"London",lat:51.5074,lng:-.1278},{name:"Brussels",lat:50.8503,lng:4.3517},{name:"Luxembourg",lat:49.8153,lng:6.1296},{name:"Amsterdam",lat:52.3676,lng:4.9041},{name:"Berlin",lat:52.52,lng:13.405},{name:"Rome",lat:41.9028,lng:12.4964},{name:"Geneva",lat:46.2044,lng:6.14324},{name:"Barcelona",lat:41.3874,lng:-2.1686},{name:"Milan",lat:45.4685,lng:9.1824}];async function A(){const{AdvancedMarkerElement:l}=await google.maps.importLibrary("marker");for(const e of M)await y(e,"button")}function R(){if(s){const e=d.find(n=>n.content===s&&n.markerType==="button");if(e){const n=s.shadowRoot.getElementById("rain-details");n.style.display="none",s.shadowRoot.querySelector(".widget-container").classList.remove("highlight"),e.zIndex=null,s=null}}d.filter(e=>e.markerType==="button").forEach(e=>{e.map=null;const n=d.indexOf(e);n>-1&&d.splice(n,1)})}async function B(l,e,n){const i=n.lat(),t=n.lng(),o=`${k}?key=${L}&location.latitude=${i}&location.longitude=${t}`;try{const r=await fetch(o);if(r.ok){const a=await r.json();console.log("Weather data fetched for marker:",a),e.data=a}else{const a=await r.json();if(console.error("API error response:",a),r.status===404&&a?.error?.status==="NOT_FOUND")e.data={error:"Location not supported"};else throw new Error(`HTTP error! status: ${r.status}`)}}catch(r){console.error("Error fetching weather data for marker:",r),e.data={error:"Failed to fetch weather data"}}}I();customElements.whenDefined("simple-weather-widget").then(()=>{const l=document.getElementById("mode-toggle");l&&l.addEventListener("click",()=>{C()});const e=document.getElementById("load-markers-button");e&&e.addEventListener("click",()=>{w?(R(),w=!1,e.textContent="Load Markers"):(A(),w=!0,e.textContent="Remove Markers")})});
