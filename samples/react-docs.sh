#!/bin/bash

# Copy/generate files for doc snippets.

echo ">>>Running react-docs.sh"

# Copy static documentation files as part of the build process.
NAME=$1 # The name of the folder, taken from package.json "build" line.

# /Users/[USERNAME]/git/js-api-samples/samples

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )" # Script directory (/samples)
PROJECT_ROOT=$(dirname "$SCRIPT_DIR")  # Get the parent directory (js-api-samples)
DIST_DIR="${PROJECT_ROOT}/dist"
SAMPLE_DIR="${PROJECT_ROOT}/dist/samples/${NAME}"

echo "PROJECT_ROOT: ${PROJECT_ROOT}"

DOCS_DIR="${PROJECT_ROOT}/dist/samples/${NAME}/docs"

# Create two new folders.
mkdir -p ${DOCS_DIR}/src

# Copy files
cp "${SCRIPT_DIR}/${NAME}/src/app.js" "${DOCS_DIR}/src/app.js"
cp "${SCRIPT_DIR}/${NAME}/src/app.tsx" "${DOCS_DIR}/src/app.tsx"
cp "${SCRIPT_DIR}/${NAME}/src/styles.css" "${DOCS_DIR}/src/styles.css"
cp "${SCRIPT_DIR}/${NAME}/index.html" "${DOCS_DIR}/index.html"

# Copy the data folder if one is found.
if [ -d "public" ] && [ "$(ls -A public)" ]; then
  cp -r public/* "${DOCS_DIR}/"
fi