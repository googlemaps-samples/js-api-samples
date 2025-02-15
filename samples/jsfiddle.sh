#!/bin/bash

# Copy/generate files for JSFiddle.

# TODO: Test in the context of tsconfig.

# Disable history expansion so '!' doesn't trigger the command. (do we need this?)
#set +H

# Generate JSFiddle output as part of the build process.
NAME=$1 # The name of the folder, taken from package.json "build" line.

# /Users/[USERNAME]/git/js-api-samples/samples or similar
SAMPLES_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )" # Script directory (/samples)
PROJECT_ROOT=$(dirname "$SAMPLES_DIR")  # Get the parent directory (js-api-samples)
DIST_DIR="${PROJECT_ROOT}/dist"

# Create a new folder.
mkdir -p "${DIST_DIR}/samples/${NAME}/jsfiddle"

# Copy files
echo "Copy ${SAMPLES_DIR}/${NAME}/index.js to ${DIST_DIR}/samples/${NAME}/jsfiddle/index.js"
cp "${SAMPLES_DIR}/${NAME}/index.js" "${DIST_DIR}/samples/${NAME}/jsfiddle/index.js"
cp "${SAMPLES_DIR}/${NAME}/index.html" "${DIST_DIR}/samples/${NAME}/jsfiddle/index.html"
cp "${SAMPLES_DIR}/${NAME}/style.css" "${DIST_DIR}/samples/${NAME}/jsfiddle/style.css"

# Remove region tags from files by type, since they all have different comment conventions.
echo "Remove region tags from ${DIST_DIR}/samples/${NAME}/jsfiddle/index.js"
sed -i "" "s/\/\/ \[START .*]//g" "${DIST_DIR}/samples/${NAME}/jsfiddle/index.js"
sed -i "" "s/\/\/ \[END .*]//g" "${DIST_DIR}/samples/${NAME}/jsfiddle/index.js"

echo "Remove region tags from ${DIST_DIR}/samples/${NAME}/jsfiddle/index.html"
sed -i "" "s/<!--\s*\[START .*\]\s*-->//g" "${DIST_DIR}/samples/${NAME}/jsfiddle/index.html"
sed -i "" "s/<!--\s*\[END .*\]\s*-->//g" "${DIST_DIR}/samples/${NAME}/jsfiddle/index.html"

echo "Remove region tags from ${DIST_DIR}/samples/${NAME}/jsfiddle/style.css"
sed -i "" "s/\/\* \[START maps_.*] \*\///g" "${DIST_DIR}/samples/${NAME}/jsfiddle/style.css"
sed -i "" "s/\/\* \[END maps_.*] \*\///g" "${DIST_DIR}/samples/${NAME}/jsfiddle/style.css"

# Generate demo.details.
echo "Generate ${DIST_DIR}/samples/${NAME}/jsfiddle/demo.details"
touch "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.details"
cat > "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.details" << EOF
name: ${NAME}
authors:
  - Geo Developer IX Documentation Team
tags:s
  - google maps
load_type: h
description: Sample code supporting Google Maps Platform JavaScript API documentation.
EOF
