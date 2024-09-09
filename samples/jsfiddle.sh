#!/bin/bash

# Copy/generate files for JSFiddle.

# TODO: Test in the context of tsconfig.

# Disable history expansion so '!' doesn't trigger the command. (do we need this?)
#set +H

# Generate JSFiddle output as part of the build process.
NAME=$1 # The name of the folder, taken from package.json "build" line.

# Relative path to the top-level of the examples folder.
#PATH_TO_DOCS=/Users/[USERNAME]/git/js-api-samples/samples
PATH_TO_DOCS="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

OUTPUT_DIR=${PATH_TO_DOCS}
DIST_DIR="../../dist/samples/${NAME}/jsfiddle"

# Create a new folder.
mkdir -p ${DIST_DIR}

# Copy files
cp "${OUTPUT_DIR}/${NAME}/index.js" "${DIST_DIR}/index.js"
cp "${OUTPUT_DIR}/${NAME}/index.html" "${DIST_DIR}/index.html"
cp "${OUTPUT_DIR}/${NAME}/style.css" "${DIST_DIR}/style.css"

# Remove region tags from files by type, since they all have different comment conventions.
sed -i "" "s/\/\/ \[START .*]//g" "${DIST_DIR}/index.js"
sed -i "" "s/\/\/ \[END .*]//g" "${DIST_DIR}/index.js"

sed -i "" "s/<!--\s*\[START .*\]\s*-->//g" "${DIST_DIR}/index.html"
sed -i "" "s/<!--\s*\[END .*\]\s*-->//g" "${DIST_DIR}/index.html"

sed -i "" "s/\/\* \[START maps_.*] \*\///g" "${DIST_DIR}/style.css"
sed -i "" "s/\/\* \[END maps_.*] \*\///g" "${DIST_DIR}/style.css"

# Generate demo.details.
touch "${DIST_DIR}/demo.details"
cat > "${DIST_DIR}/demo.details" << EOF
name: ${NAME}
authors:
  - Geo Developer IX Documentation Team
tags:
  - google maps
load_type: h
description: Sample code for Google Maps Platform JavaScript API
EOF