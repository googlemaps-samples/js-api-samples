#!/bin/bash

# A helper script to generate common boilerplate files (package.json, tsconfig.json, README.md)
# for Google Maps JavaScript samples.
# Usage: ./generate-shared-boilerplate.sh <NAME> <TITLE> <OUTPUT_DIR>

NAME="$1"
TITLE="$2"
OUTPUT_DIR="${3:-.}"

if [ -z "$NAME" ] || [ -z "$TITLE" ]; then
  echo "Usage: $0 <NAME> <TITLE> [OUTPUT_DIR]"
  exit 1
fi

mkdir -p "${OUTPUT_DIR}/${NAME}"

# Generate package.json
cat > "${OUTPUT_DIR}/${NAME}/package.json" << EOF
{
  "name": "@js-api-samples/${NAME}",
  "version": "1.0.0",
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

# Generate tsconfig.json
cat > "${OUTPUT_DIR}/${NAME}/tsconfig.json" << 'EOF'
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "."
  },
  "include": ["./*.ts"]
}
EOF

# Generate README.md
cat > "${OUTPUT_DIR}/${NAME}/README.md" << EOF
# Google Maps JavaScript Sample

## ${NAME}

${TITLE}

## Setup

### Before starting run:

\`npm i\`

### Run an example on a local web server

\`cd samples/${NAME}\`
\`npm start\`

### Build an individual example

\`cd samples/${NAME}\`
\`npm run build\`

From 'samples':

\`npm run build --workspace=${NAME}/\`

### Build all of the examples.

From 'samples':

\`npm run build-all\`

### Run lint to check for problems

\`cd samples/${NAME}\`
\`npx eslint index.ts\`

## Feedback

For feedback related to this sample, please open a new issue on
[GitHub](https://github.com/googlemaps-samples/js-api-samples/issues).
EOF
