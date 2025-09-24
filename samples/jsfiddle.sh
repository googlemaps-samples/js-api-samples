#!/bin/bash

# Copy/generate files for JSFiddle.

# TODO: Test in the context of tsconfig.

# Disable history expansion so '!' doesn't trigger the command. (do we need this?)
#set +H

echo ">>>Running jsfiddle.sh"

# Generate JSFiddle output as part of the build process.
NAME=$1 # The name of the folder, taken from package.json "build" line.

# /Users/[USERNAME]/git/js-api-samples/samples

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )" # Script directory (/samples)
PROJECT_ROOT=$(dirname "$SCRIPT_DIR")  # Get the parent directory (js-api-samples)
DIST_DIR="${PROJECT_ROOT}/dist"

echo "PROJECT_ROOT: ${PROJECT_ROOT}"
echo "SCRIPT_DIR: ${SCRIPT_DIR}"
echo "DIST_DIR: ${DIST_DIR}"
echo "NAME: ${NAME}"

# Create a new folder.
mkdir -p "${DIST_DIR}/samples/${NAME}/jsfiddle"

# Copy files
echo "Copy ${SCRIPT_DIR}/${NAME}/index.js to ${DIST_DIR}/samples/${NAME}/jsfiddle/demo.js"
cp "${SCRIPT_DIR}/${NAME}/index.js" "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.js"
cp "${SCRIPT_DIR}/${NAME}/index.html" "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.html"
cp "${SCRIPT_DIR}/${NAME}/style.css" "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.css"

# Copy the data folder if one is found.
[ -d "public" ] && cp -r public/* "${DIST_DIR}/samples/${NAME}/jsfiddle/"

# Remove region tags from files by type, since they all have different comment conventions.
# We use a conditional here since sed behaves differently on Linux.
echo "Remove region tags from ${DIST_DIR}/samples/${NAME}/jsfiddle/demo.js"
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i "" "s/\/\/ \[START .*]//g" "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.js"
  sed -i "" "s/\/\/ \[END .*]//g" "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.js"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  sed -i "s/\/\/ \[START.*]//g" "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.js"
  sed -i "s/\/\/ \[END.*]//g" "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.js"
fi

echo "Remove region tags from ${DIST_DIR}/samples/${NAME}/jsfiddle/demo.html"
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i "" "s/<!--[[:space:]]*\[START .*\][[:space:]]*-->//g" "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.html"
  sed -i "" "s/<!--[[:space:]]*\[END .*\][[:space:]]*-->//g" "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.html"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  sed -i "s/<!--[[:space:]]*\[START .*\][[:space:]]*-->//g" "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.html"
  sed -i "s/<!--[[:space:]]*\[END .*\][[:space:]]*-->//g" "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.html"
fi

echo "Remove region tags from ${DIST_DIR}/samples/${NAME}/jsfiddle/demo.css"
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i "" "s/\/\* \[START maps_.*] \*\///g" "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.css"
  sed -i "" "s/\/\* \[END maps_.*] \*\///g" "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.css"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  sed -i "s/\/\* \[START maps_.*] \*\///g" "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.css"
  sed -i "s/\/\* \[END maps_.*] \*\///g" "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.css"
fi

# Generate demo.details.
echo "Generate ${DIST_DIR}/samples/${NAME}/jsfiddle/demo.details"
touch "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.details"
cat > "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.details" << EOF
name: ${NAME}
authors:
  - Geo Developer IX Documentation Team
tags:
  - google maps
load_type: h
description: Sample code supporting Google Maps Platform JavaScript API documentation.
EOF
