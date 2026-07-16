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
echo "Copy files to ${DIST_DIR}/samples/${NAME}/jsfiddle/"
[ -f "${SCRIPT_DIR}/${NAME}/index.js" ] && cp "${SCRIPT_DIR}/${NAME}/index.js" "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.js"
[ -f "${SCRIPT_DIR}/${NAME}/index.html" ] && cp "${SCRIPT_DIR}/${NAME}/index.html" "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.html"
[ -f "${SCRIPT_DIR}/${NAME}/style.css" ] && cp "${SCRIPT_DIR}/${NAME}/style.css" "${DIST_DIR}/samples/${NAME}/jsfiddle/demo.css"

# Copy the public folder if one is found (graphics, other static files).
if [ -d "public" ] && [ "$(ls -A public)" ]; then
  cp -r public/* "${DOCS_DIR}/"
fi

# Copy the src folder if one is found (.js, .json, anything parseable by Vite).
if [ -d "src" ] && [ "$(ls -A src)" ]; then
  cp -r src/* "${DOCS_DIR}/"
fi

pushd "${DIST_DIR}/samples/${NAME}/jsfiddle"

# Remove region tags from files by type, since they all have different comment conventions.
# We use a conditional here since sed behaves differently on Linux.
echo "Remove region tags from JS"
if [ -f "demo.js" ]; then
  sed -i.sed-back "s#// \[START .*]##g" "demo.js" && rm *.sed-back
  sed -i.sed-back "s#// \[END .*]##g" "demo.js" && rm *.sed-back
  sed -i.sed-back "s#/\* \[START .*] \*/##g" "demo.js" && rm *.sed-back
  sed -i.sed-back "s#/\* \[END .*] \*/##g" "demo.js"  && rm *.sed-back
fi

echo "Remove region tags from HTML"
if [ -f "demo.html" ]; then
  sed -i.sed-back "s/<!--[[:space:]]*\[START .*\][[:space:]]*-->//g" "demo.html" && rm *.sed-back
  sed -i.sed-back "s/<!--[[:space:]]*\[END .*\][[:space:]]*-->//g" "demo.html" && rm *.sed-back
fi

echo "Remove region tags from CSS"
if [ -f "demo.css" ]; then
  sed -i.sed-back "s#/\* \[START maps_.*] \*/##g" "demo.css" && rm *.sed-back
  sed -i.sed-back "s#/\* \[END maps_.*] \*/##g" "demo.css"  && rm *.sed-back
fi

# after that other cleanup, re-run prettier to remove excess newlines
npx prettier -w . --ignore-path /dev/null

grep -r -e "\[START" -e "\[END" .
if [[ $? -eq 0 ]]; then
  echo "Region tags leaked into ${DIST_DIR}/samples/${NAME}/jsfiddle/"
  exit 1
fi

# Generate demo.details.
echo "Generate ${DIST_DIR}/samples/${NAME}/jsfiddle/demo.details"
touch "demo.details"
cat > "demo.details" << EOF
name: ${NAME}
authors:
  - Geo Developer IX Documentation Team
tags:
  - google maps
load_type: h
description: Sample code supporting Google Maps Platform JavaScript API documentation.
EOF

popd