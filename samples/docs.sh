#!/bin/bash

# Copy/generate files for doc snippets.

echo ">>>Running docs.sh"

# Copy static documentation files as part of the build process.
NAME=$1 # The name of the folder, taken from package.json "build" line.

# /Users/[USERNAME]/git/js-api-samples/samples

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )" # Script directory (/samples)
PROJECT_ROOT=$(dirname "$SCRIPT_DIR")  # Get the parent directory (js-api-samples)
DIST_DIR="${PROJECT_ROOT}/dist"
SAMPLE_DIR="${PROJECT_ROOT}/dist/samples/${NAME}"

echo "PROJECT_ROOT: ${PROJECT_ROOT}"

DOCS_DIR="${PROJECT_ROOT}/dist/samples/${NAME}/docs"

# Create a new folder.
mkdir -p ${DOCS_DIR}

# Copy files
cp "${SCRIPT_DIR}/${NAME}/index.ts" "${DOCS_DIR}/index.ts"
cp "${SCRIPT_DIR}/${NAME}/index.js" "${DOCS_DIR}/index.js"
cp "${SCRIPT_DIR}/${NAME}/index.html" "${DOCS_DIR}/index.html"
cp "${SCRIPT_DIR}/${NAME}/style.css" "${DOCS_DIR}/style.css"

# Copy the public folder if one is found (graphics, other static files).
if [ -d "public" ] && [ "$(ls -A public)" ]; then
  cp -r public/* "${DOCS_DIR}/"
fi

# Copy the src folder if one is found (.js, .json, anything parseable by Vite).
if [ -d "src" ] && [ "$(ls -A src)" ]; then
  cp -r src/* "${DOCS_DIR}/"
fi
