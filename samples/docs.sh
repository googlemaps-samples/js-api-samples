#!/bin/bash

# Copy/generate files for doc snippets.

# Generate JSFiddle output as part of the build process.
NAME=$1 # The name of the folder, taken from package.json "build" line.

# Relative path to the top-level of the examples folder.
#PATH_TO_DOCS=/Users/[USERNAME]/git/js-api-samples/samples
PATH_TO_DOCS="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

echo ${PATH_TO_DOCS}

OUTPUT_DIR=${PATH_TO_DOCS}
DIST_DIR="../../dist/samples/${NAME}/docs"

# Create a new folder.
mkdir -p ${DIST_DIR}

# Copy files
cp "${OUTPUT_DIR}/${NAME}/index.js" "${DIST_DIR}/index.js"
cp "${OUTPUT_DIR}/${NAME}/index.html" "${DIST_DIR}/index.html"
cp "${OUTPUT_DIR}/${NAME}/style.css" "${DIST_DIR}/style.css"