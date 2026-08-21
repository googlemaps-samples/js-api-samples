# Case Study: 2D Map Refactoring (map-simple)

This case study demonstrates the refactoring of a baseline 2D map sample using the modern Web Component patterns and the "Refactor" skill guidelines.

## 1. Initial State (Legacy Pattern)

The sample uses a `div` element and manual initialization in the TypeScript file.

**HTML:**
```html
<div id="map"></div>
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=init" defer></script>
```

**TypeScript:**
```typescript
let map: google.maps.Map;
async function init(): Promise<void> {
    const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
    map = new Map(document.getElementById('map') as HTMLElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });
}
void init();
```

## 2. Refactored State (Modern Pattern)

The refactored version uses the `<gmp-map>` custom element, declarative attributes, and the `innerMap` pattern.

**HTML:**
```html
<gmp-map
  center="-34.397,150.644"
  zoom="8"
  map-id="DEMO_MAP_ID">
</gmp-map>

<script type="module" src="./index.js"></script>
<script>
  // prettier-ignore
  (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "GOOGLE_MAPS_API_KEY",
  });
</script>
```

> **Note:** Always use the `GOOGLE_MAPS_API_KEY` placeholder in code snippets to ensure dynamic key injection works correctly. Avoid specifying the `v:` parameter in the bootstrapper unless a channel other than `"weekly"` is explicitly required by the sample. Initial legacy states may retain hardcoded `AIza...` keys for historical accuracy, but refactored states must use the placeholder.

**TypeScript:**
```typescript
async function init(): Promise<void> {
    // Request the maps library to trigger the gmp-map element upgrade.
    await google.maps.importLibrary('maps');

    const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;
    const innerMap = mapElement.innerMap;

    // Use innerMap for any programmatic configuration not available via attributes.
    innerMap.setOptions({
        gestureHandling: 'cooperative'
    });
}

void init();
```

## Key Refactoring Principles Applied:

1.  **Legacy Preservation**: Before refactoring, an exact copy of the legacy version was created and named `map-simple-legacy`.
2.  **Declarative attributes**: Properties like `center` and `zoom` were moved from the TS constructor to HTML attributes.
3.  **Element Selection**: Replaced `document.getElementById('map')` with `document.querySelector('gmp-map')`.
4.  **`innerMap` Distinction**: Used the `innerMap` property of the `MapElement` to access the underlying map instance, following the convention to avoid name collisions with the element itself.
5.  **Inline Bootstrap Loader**: Replaced the legacy script tag with the modern inline loader, using `prettier-ignore` to preserve formatting.
6.  **Explicit Initialization**: Removed the `callback=init` from the URL and simply called `init()` in the module script.
7.  **Library Loading**: Ensured `importLibrary('maps')` is called to upgrade the declarative HTML elements.
