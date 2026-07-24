# React Google Maps Development Patterns

## Overview
This document captures development patterns, library choices, and infrastructure decisions for building Google Maps Platform integrations with React, particularly in the context of sample migration.

## Library Choices

### 1. React Google Maps Library (`@vis.gl/react-google-maps`)
The official recommendation for most React applications. It provides a declarative, component-based API.

**Key Components:**
- `<APIProvider>`: Wraps the application and handles script loading.
- `<Map>`: The core map component.
- `<AdvancedMarker>`: Modern marker component.

**Pros:** Declarative, manages lifecycle automatically, integrates well with React state.
**Cons:** Adds a dependency; might be slightly ahead or behind specific low-level API features.

### 2. Manual Loader (`@googlemaps/js-api-loader`)
Using the low-level loader directly is preferred for:
- Very simple samples or codelabs where minimal dependencies are desired.
- Advanced use cases where the component library might not yet support a specific feature (e.g., brand new 3D features).
- Integrating with Maps JS Web Components inside a React app.

**Implementation Pattern:**
```tsx
'use client'
import { useEffect, useState } from 'react';
import { importLibrary } from '@googlemaps/js-api-loader';

export default function MapComponent() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    importLibrary('maps').then(() => setIsLoaded(true));
  }, []);

  return (
    isLoaded ? <gmp-map center="37.422, -122.084" zoom="10"></gmp-map> : <div>Loading...</div>
  );
}
```

### 3. 3D Maps (`maps3d`)
For the latest 3D features, use `importLibrary('maps3d')` and the corresponding web components.

**3D Map Pattern:**
```tsx
'use client'
import { useEffect, useState } from 'react';
import { importLibrary } from '@googlemaps/js-api-loader';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    importLibrary('maps3d').then(() => setIsLoaded(true));
  }, []);

  return (
    isLoaded ? (
      <gmp-map-3d
        mode="HYBRID"
        cameraPosition={{ lat: 37.422, lng: -122.085, altitude: 1500 }}
        style={{ height: '500px' }}>
        <gmp-marker-3d position={{ lat: 37.422, lng: -122.085 }}></gmp-marker-3d>
      </gmp-map-3d>
    ) : null
  );
}
```

## Infrastructure Choices for Samples

### Next.js vs. Vite
When creating pedagogical samples or tutorials, the choice of build tool impacts readability and simplicity.

| Feature | Next.js | Vite |
| :--- | :--- | :--- |
| **Use Case** | Full-stack apps, SEO-critical sites. | Simple samples, SPAs, Codelabs. |
| **Complexity** | High (SSR, Hydration, App Router). | Low (Standard SPA). |
| **Pedagogy** | Framework-specific rules (e.g., `"use client"`) can distract from the API lesson. | Cleanest representation of pure React code. |

**Recommendation:** For most Google Maps Platform React tutorials or simple samples, **Vite** is preferred for its lightweight nature and fast startup.
