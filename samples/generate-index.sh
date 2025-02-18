#!/bin/bash

# Generate a new index.html for Firebase App Hosting.

echo ">>>Running generate-index.sh"

# Set up paths.
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT=$(dirname "$SCRIPT_DIR") 
DIST_DIR="$PROJECT_ROOT/dist"

echo "SCRIPT_DIR: ${SCRIPT_DIR}"
echo "PROJECT_ROOT: ${PROJECT_ROOT}"

# Create the output file.
OUTPUT_FILE="index.html"

# Generate the HTML document.
echo "<!DOCTYPE html>" > "${OUTPUT_FILE}"
echo "<html>" >> "${OUTPUT_FILE}"
echo "<head>" >> "${OUTPUT_FILE}"
echo "<title>Maps JSAPI Samples</title>" >> "${OUTPUT_FILE}"
echo "</head>" >> "${OUTPUT_FILE}"
echo "<body>" >> "${OUTPUT_FILE}"
echo "<!-- Default top-level index for Firebase Hosting -->" >> "${OUTPUT_FILE}"
echo "<h1>Maps JSAPI Samples</h1>" >> "${OUTPUT_FILE}"
echo "<ul>" >> "${OUTPUT_FILE}"

# Iterate through sample directories.
find "${SCRIPT_DIR}" -maxdepth 1 -mindepth 1 -type d | while read -r subdir; do

# Extract the directory name.
DIR_NAME=$(basename "${subdir}")

# Construct the link.
LINK_URL="/samples/${DIR_NAME}/dist"
LINK_TEXT="${DIR_NAME}"

# Create the list item.
echo "  <li><a href='${LINK_URL}'>${LINK_TEXT}</a></li>" >> "${OUTPUT_FILE}"
done

echo "</ul>" >> "${OUTPUT_FILE}"
echo "</body>" >> "${OUTPUT_FILE}"
echo "</html>" >> "${OUTPUT_FILE}"

echo "HTML file generated: ${OUTPUT_FILE}"

echo "from ${SCRIPT_DIR}/${OUTPUT_FILE}"
echo "to ${DIST_DIR}/${OUTPUT_FILE}"

cp "${PROJECT_ROOT}/${OUTPUT_FILE}" "${DIST_DIR}/${OUTPUT_FILE}"
