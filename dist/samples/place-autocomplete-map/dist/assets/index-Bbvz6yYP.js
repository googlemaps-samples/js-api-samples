(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const l of t.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function o(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=o(e);fetch(e.href,t)}})();let r,c,a;async function d(){await Promise.all([google.maps.importLibrary("marker"),google.maps.importLibrary("places")]),r=new google.maps.Map(document.getElementById("map"),{center:{lat:40.749933,lng:-73.98633},zoom:13,mapId:"4504f8b37365c3d0",mapTypeControl:!1});const s=new google.maps.places.PlaceAutocompleteElement;s.id="place-autocomplete-input";const n=document.getElementById("place-autocomplete-card");n.appendChild(s),r.controls[google.maps.ControlPosition.TOP_LEFT].push(n),c=new google.maps.marker.AdvancedMarkerElement({map:r}),a=new google.maps.InfoWindow({}),s.addEventListener("gmp-placeselect",async({place:o})=>{await o.fetchFields({fields:["displayName","formattedAddress","location"]}),o.viewport?r.fitBounds(o.viewport):(r.setCenter(o.location),r.setZoom(17));let i='<div id="infowindow-content"><span id="place-displayname" class="title">'+o.displayName+'</span><br /><span id="place-address">'+o.formattedAddress+"</span></div>";p(i,o.location),c.position=o.location})}function p(s,n){a.setContent(s),a.setPosition(n),a.open({map:r,anchor:c,shouldFocus:!1})}d();
