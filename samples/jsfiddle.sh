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

# Replace local asset paths with production URLs.
PROD_URL_BASE="https://maps-docs-team.web.app/samples/${NAME}/dist"
JSFIDDLE_DIR="${DIST_DIR}/samples/${NAME}/jsfiddle"

# Find all asset files in public and src directories.
find "${SCRIPT_DIR}/${NAME}" \( -path "*/public/*" -o -path "*/src/*" \) -type f \( -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.json" -o -name "*.js" \) | while read -r asset_file; do
  # Get the asset's path relative to the sample directory (e.g., public/icon.png)
  relative_path=${asset_file#*"${SCRIPT_DIR}/${NAME}/"}
  asset_name=$(basename "$relative_path")
  
  # Replace paths in the demo files. Note: This handles paths like './asset.png' and 'asset.png'.
  sed -i.bak "s|\(['\"(]\)\(\./\)*${asset_name}\(['\")']\)|\1${PROD_URL_BASE}/${asset_name}\3|g" "${JSFIDDLE_DIR}/demo.js" "${JSFIDDLE_DIR}/demo.html" "${JSFIDDLE_DIR}/demo.css"
done

rm -f "${JSFIDDLE_DIR}"/*.bak # Clean up backup files created by sed.

pushd "${DIST_DIR}/samples/${NAME}/jsfiddle"

# Remove region tags from files by type, since they all have different comment conventions.
# We use a conditional here since sed behaves differently on Linux.
echo "Remove region tags from ${DIST_DIR}/samples/${NAME}/jsfiddle/demo.js"
sed -i.sed-back "s#// \[START .*]##g" "demo.js" && rm *.sed-back
sed -i.sed-back "s#// \[END .*]##g" "demo.js" && rm *.sed-back
sed -i.sed-back "s#/\* \[START .*] \*/##g" "demo.js" && rm *.sed-back
sed -i.sed-back "s#/\* \[END .*] \*/##g" "demo.js"  && rm *.sed-back


echo "Remove region tags from ${DIST_DIR}/samples/${NAME}/jsfiddle/demo.html"
sed -i.sed-back "s/<!--[[:space:]]*\[START .*\][[:space:]]*-->//g" "demo.html" && rm *.sed-back
sed -i.sed-back "s/<!--[[:space:]]*\[END .*\][[:space:]]*-->//g" "demo.html" && rm *.sed-back


echo "Remove region tags from ${DIST_DIR}/samples/${NAME}/jsfiddle/demo.css"
sed -i.sed-back "s#/\* \[START maps_.*] \*/##g" "demo.css" && rm *.sed-back
sed -i.sed-back "s#/\* \[END maps_.*] \*/##g" "demo.css"  && rm *.sed-back

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