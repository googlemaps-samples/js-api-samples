# Google Maps Samples Project Guidelines

These rules apply to all AI Agents contributing to `js-api-samples`.

## 1. Commits and Dependencies
- **Package-Lock**: Always include `package-lock.json` in commits when making changes to samples or updating dependencies, as it is required for the repository's CI/CD pipeline to pass successfully.

## 2. Sample Scaffolding
- **Creation Scripts**: Use `new-sample.sh` and `migrate-sample.sh` to scaffold and migrate code. These rely on the `generate-shared-boilerplate.sh` script to ensure identical `package.json`, `tsconfig.json`, and Vite configurations. Do not write boilerplate manually.
- **Shared Configuration**: The Vite `package.json` scripts block must reference the root Vite config correctly (e.g. `vite build --config ../../vite.config.js`). 

## 3. Strict Linting & TypeScript Enforcement
- **No Global Namespace Instantiation**: Do not use `new google.maps.*` natively. Instead, dynamically import dependencies using destructured libraries:
  ```typescript
  const [ { Map }, { AdvancedMarkerElement } ] = await Promise.all([
      google.maps.importLibrary('maps'),
      google.maps.importLibrary('marker')
  ]);
  ```
- **Non-null Assertions**: Use the non-null assertion operator `!` (e.g., `document.querySelector('gmp-map')!`) rather than type casting it `as Element`. This is strictly enforced by `@typescript-eslint/non-nullable-type-assertion-style`.
- **Prettier & ESLint**: You must execute `build-single.sh` in the sample directory before committing to enforce the strict Prettier/ESLint constraints. 

## 4. Modern Maps Conventions
- **Web Components**: Favor declarative `<gmp-map>` (and `<gmp-map-3d>`) elements in the HTML over imperative Map initialization when practical.
- **Markers**: Legacy `google.maps.Marker` is completely deprecated. You must use `google.maps.marker.AdvancedMarkerElement`. Set `gmpDraggable: true` if drag capabilities are needed.
- **Place Autocomplete**: Legacy `Geocoder` search boxes should be upgraded to the Places `Autocomplete` widget bound directly to the map instance.
- **AdvancedMarkerElement positions**: Be aware that the `AdvancedMarkerElement.position` getter can return either a `google.maps.LatLng` function object OR a `google.maps.LatLngLiteral` primitive object. Safely cast and read properties (e.g. check if `.lat` is a function before calling it).

## 5. UI/UX Aesthetics
- **Premium Design**: Use rich, modern aesthetics for utilities and apps. Embrace the `Inter` font, split-pane flexbox layouts, glassmorphism, and responsive CSS. Do not produce legacy, inline HTML/CSS frames.
- **Map IDs**: For applications that need granular control over clicks (like drawing tools), assign a custom Map ID to the `gmp-map` to disable POIs and avoid selection hijacking.
