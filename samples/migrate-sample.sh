#!/bin/bash

# A handy shell script to make migrating js-samples easier. This script will:
#  - Create a new directory using the NAME you provide.
#  - Generate all of the boilerplate files into the new directory.
#  - Copy the required source files for the sample into the new directory.
#     These must come from the repo archive you downloaded.
# To run this script:
#  1. cd to the js-api-samples/samples folder on your local computer.
#  2. ./migrate-sample.sh <NAME> <TITLE>

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <NAME> <TITLE>"
  exit 1
fi

NAME="$1" # The name of the folder to create (for example "map-simple").
TITLE="$2" # The title of the example.
REGION_TAG="maps_${NAME//-/_}" # The region tag to use (for example "maps_map_simple").
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
// Placeholder for index.js (run TSC to generate).
EOF

# Generate shared boilerplate
bash "$(dirname "$0")/generate-shared-boilerplate.sh" "$NAME" "$TITLE" "$OUTPUT_DIR"

# Git add the files.
git add "${OUTPUT_DIR}/${NAME}/index.ts"
git add "${OUTPUT_DIR}/${NAME}/index.js"
git add "${OUTPUT_DIR}/${NAME}/index.html"
git add "${OUTPUT_DIR}/${NAME}/style.css"
git add "${OUTPUT_DIR}/${NAME}/package.json"
git add "${OUTPUT_DIR}/${NAME}/tsconfig.json"
git add "${OUTPUT_DIR}/${NAME}/README.md"
