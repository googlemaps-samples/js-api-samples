#!/bin/bash

# A script to generate boilerplate for a new Google Maps React sample.
# Usage: ./new-react-sample.sh <sample-name>

if [ -z "$1" ]; then
  echo "Usage: $0 <sample-name>"
  exit 1
fi

NAME=$1
# Replace hyphens with underscores for the region tag
REGION_TAG="maps_${NAME//-/_}"
TITLE="React - ${NAME//-/ }"

# Create the directory
mkdir -p "$NAME/src"

# Create src/app.tsx
cat > "$NAME/src/app.tsx" << EOF
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START ${REGION_TAG}_app]
import React from 'react';
import { createRoot } from 'react-dom/client';
import { APIProvider, Map } from '@vis.gl/react-google-maps';

const API_KEY = 'GOOGLE_MAPS_API_KEY';

export default function App() {
    return (
        <APIProvider apiKey={API_KEY}>
            <Map
                defaultCenter={{ lat: 37.422, lng: -122.084 }}
                defaultZoom={14}
                mapId="DEMO_MAP_ID"
            >
                {/* Add map components here */}
            </Map>
        </APIProvider>
    );
}

export function renderToDom(container: HTMLElement) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
// [END ${REGION_TAG}_app]
EOF

# Create index.html
cat > "$NAME/index.html" << EOF
<!doctype html>
<!--
 @license
 Copyright 2026 Google LLC. All Rights Reserved.
 SPDX-License-Identifier: Apache-2.0
-->
<!-- [START $REGION_TAG] -->
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <title>$TITLE</title>
        <style>
            body {
                margin: 0;
                font-family: sans-serif;
            }
            #app {
                width: 100vw;
                height: 100vh;
            }
        </style>
        <script type="module">
            import { renderToDom } from './src/app';

            renderToDom(document.querySelector('#app'));
        </script>
    </head>
    <body>
        <div id="app"></div>
    </body>
</html>
<!-- [END $REGION_TAG] -->
EOF

# Create package.json
cat > "$NAME/package.json" << EOF
{
  "name": "@js-api-samples/$NAME",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "bash ../build-single.sh",
    "test": "tsc && npm run build:vite --workspace=.",
    "start": "tsc && vite build --config ../../vite.config.js --base './' && vite --config ../../vite.config.js",
    "build:vite": "vite build --config ../../vite.config.js --base './'",
    "preview": "vite preview --config ../../vite.config.js"
  },
  "author": "Google LLC"
}
EOF

# Create tsconfig.json
cat > "$NAME/tsconfig.json" << EOF
{
  "extends": "../../tsconfig.react-base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["./src/**/*.ts*"]
}
EOF

echo "Created React sample '$NAME' successfully!"
