#!/bin/bash

# A script to generate boilerplate for a new Google Maps JavaScript sample.
# Usage: ./new-sample.sh <sample-name>

if [ -z "$1" ]; then
  echo "Usage: $0 <sample-name>"
  exit 1
fi

NAME=$1
# Replace hyphens with underscores for the region tag
REGION_TAG="maps_${NAME//-/_}"

# Create the directory
mkdir -p "$NAME"

# Create index.ts
cat > "$NAME/index.ts" << EOF
/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START $REGION_TAG]

// [END $REGION_TAG]
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
<html>
    <head>
        <title>$NAME</title>

        <link rel="stylesheet" type="text/css" href="./style.css" />
        <script type="module" src="./index.js"></script>
EOF

# Use 'EOF' to prevent expansion of the loader script
cat >> "$NAME/index.html" << 'EOF'
        <script>
            // prettier-ignore
            (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
                key: "AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8"
            });
        </script>
EOF

cat >> "$NAME/index.html" << EOF
    </head>
    <body>
    </body>
</html>
<!-- [END $REGION_TAG] -->
EOF

# Create style.css
cat > "$NAME/style.css" << EOF
/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/* [START $REGION_TAG] */
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
/* [END $REGION_TAG] */
EOF

# Create package.json
cat > "$NAME/package.json" << EOF
{
    "name": "@js-api-samples/$NAME",
    "version": "1.0.0",
    "scripts": {
      "build": "bash ../build-single.sh",
      "test": "tsc && npm run build:vite --workspace=.",
      "start": "tsc && vite build --base './' && vite",
      "build:vite": "vite build --base './'",
      "preview": "vite preview"
    }
}
EOF  

# Create tsconfig.json
cat > "$NAME/tsconfig.json" << 'EOF'
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "."
  },
  "include": [
    "./*.ts"
  ]
}
EOF

# Create README.md
cat > "$NAME/README.md" << EOF
# Google Maps JavaScript Sample

## $NAME

Add a meaningful description for $NAME here...

## Setup

### Before starting run:

\`npm i\`

### Run an example on a local web server

\`cd samples/$NAME\`
\`npm start\`

### Build an individual example

\`cd samples/$NAME\`
\`npm run build\`

From 'samples':

\`npm run build --workspace=$NAME/\`

### Build all of the examples.

From 'samples':

\`npm run build-all\`

### Run lint to check for problems

\`cd samples/$NAME\`
\`npx eslint index.ts\`

## Feedback

For feedback related to this sample, please open a new issue on
[GitHub](https://github.com/googlemaps-samples/js-api-samples/issues).
EOF

echo "Sample $NAME created successfully in directory ./$NAME"
