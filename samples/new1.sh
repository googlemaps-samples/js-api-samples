#!/bin/bash

# A handy shell script to make migrating js-samples easier. This script will:
#  - Create a new directory using the NAME you provide.
#  - Generate all of the boilerplate files into the new directory.
#  - Copy the required source files for the sample into the new directory.
#     These must come from the repo archive you downloaded.
# To run this script:
#  1. Fill in the NAME, REGION_TAG, TITLE, and API_LOADER below.
#     Get these values from the <sample-name>.json for the sample being migrated.
#  2. cd to the js-api–samples/samples folder on your local computer.
#  3. ./new1.sh

# AUTHOR: Update these values!
NAME="advanced-markers-simple" # The name of the folder to create (for example "map-simple").
REGION_TAG="maps_advanced_markers_simple" # The region tag to use for the JSHTML (for example "maps_map_simple").
TITLE="Add an advanced marker to a map." # The title of the example.
API_LOADER="api_loader_dynamic" # The type of loader to use (api_loader_dynamic or api_loader_default).

# Path to the source folder for the repo archive; substitute with your own path.
INPUT_DIR=/Users/wfrench/Downloads/js-samples-main

# Relative path to the top-level of the examples folder.
#OUTPUT_DIR=/Users/[USERNAME]/git/js-api-samples/samples
OUTPUT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Create the new folder.
mkdir -p ${NAME}

# Copy index.ts, index.html, and style.css from the archived source folder.
# at INPUT_DIR
cp "${INPUT_DIR}/samples/${NAME}/index.ts" "${OUTPUT_DIR}/${NAME}/"
cp "${INPUT_DIR}/dist/samples/${NAME}/docs/index.html" "${OUTPUT_DIR}/${NAME}/"
cp "${INPUT_DIR}/dist/samples/${NAME}/docs/style.css" "${OUTPUT_DIR}/${NAME}/"

# Generate a placeholder for index.js.
touch "${OUTPUT_DIR}/${NAME}/index.js"
cat > "${OUTPUT_DIR}/${NAME}/index.js" << EOF
<!-- Placeholder for index.js (run TSC to generate). -->
EOF

# Generate the JSHTML.
touch "${OUTPUT_DIR}/${NAME}/${NAME}.jshtml"
cat > "${OUTPUT_DIR}/${NAME}/${NAME}.jshtml" << EOF

{% spaceless %}{% include "maps/documentation/javascript/examples/full/_apikey.html" %}{% endspaceless %}<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <title>${TITLE}</title>
    <style>
{% includecode content_path="maps/documentation/javascript/examples/samples/${NAME}/style.css" region_tag="${REGION_TAG}" html_escape="False" %}
    </style>
  </head>
  <body>
{% includecode content_path="maps/documentation/javascript/examples/samples/${NAME}/index.html" region_tag="${REGION_TAG}_body" html_escape="False" %}
{{ ${API_LOADER} }}
    <script>
{% includecode content_path="maps/documentation/javascript/examples/samples/${NAME}/index.js" region_tag="${REGION_TAG}" html_escape="False" %}
    </script>
  </body>
</html>
EOF

# Generate package.json
touch "${OUTPUT_DIR}/${NAME}/package.json"
cat > "${OUTPUT_DIR}/${NAME}/package.json" << EOF
{
  "name": "@js-api-samples/${NAME}",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc && bash ../jsfiddle.sh ${NAME} && bash ../app.sh ${NAME} && bash ../docs.sh ${NAME} && npm run build:vite --workspace=. && bash ../dist.sh ${NAME}",
    "test": "tsc && npm run build:vite --workspace=.",
    "start": "tsc && vite build --base './' && vite",
    "build:vite": "vite build --base './'",
    "preview": "vite preview"
  },
  "dependencies": {
    
  }
}
EOF

# Generate tsconfig.json
touch "${OUTPUT_DIR}/${NAME}/tsconfig.json"
cat > "${OUTPUT_DIR}/${NAME}/tsconfig.json" << EOF
{
  "compilerOptions": {
    "module": "esnext",
    "target": "esnext",
    "strict": true,
    "noImplicitAny": false,
    "lib": [
      "es2015",
      "esnext",
      "es6",
      "dom",
      "dom.iterable"
    ],
    "moduleResolution": "Node",
    "jsx": "preserve"
  }
}
EOF

# Generate README.md
touch "${OUTPUT_DIR}/${NAME}/README.md"
cat > "${OUTPUT_DIR}/${NAME}/README.md" << 'EOF'
# Google Maps JavaScript Sample

This sample is generated from @googlemaps/js-samples located at
https://github.com/googlemaps-samples/js-api-samples.

## Setup

### Before starting run:

`npm i`

### Run an example on a local web server

First `cd` to the folder for the sample to run, then:

`npm start`

### Build an individual example

From `samples/`:

`npm run build --workspace=sample-name/`

### Build all of the examples.

From `samples/`:

`npm run build-all`

## Feedback

For feedback related to this sample, please open a new issue on
[GitHub](https://github.com/googlemaps-samples/js-api-samples/issues).
EOF

# Git add the files.
git add "${OUTPUT_DIR}/${NAME}/index.ts"
git add "${OUTPUT_DIR}/${NAME}/index.js"
git add "${OUTPUT_DIR}/${NAME}/index.html"
git add "${OUTPUT_DIR}/${NAME}/style.css"
git add "${OUTPUT_DIR}/${NAME}/${NAME}.jshtml"
git add "${OUTPUT_DIR}/${NAME}/package.json"
git add "${OUTPUT_DIR}/${NAME}/tsconfig.json"
git add "${OUTPUT_DIR}/${NAME}/README.md"