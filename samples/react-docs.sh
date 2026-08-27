#!/bin/bash

# Copy/generate files for doc snippets.

echo ">>>Running react-docs.sh"

# Copy static documentation files as part of the build process.
NAME=$1 # The name of the folder, taken from package.json "build" line.

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )" # Script directory (/samples)
PROJECT_ROOT=$(dirname "$SCRIPT_DIR")  # Get the parent directory (js-api-samples)
DIST_DIR="${PROJECT_ROOT}/dist"
SAMPLE_DIR="${PROJECT_ROOT}/dist/samples/${NAME}"

echo "PROJECT_ROOT: ${PROJECT_ROOT}"

DOCS_DIR="${PROJECT_ROOT}/dist/samples/${NAME}/docs"

# Create new folders.
mkdir -p "${DOCS_DIR}/src"

# Copy files
if [ -f "${SCRIPT_DIR}/${NAME}/dist/app.js" ]; then
  cp "${SCRIPT_DIR}/${NAME}/dist/app.js" "${DOCS_DIR}/app.js"
fi

if [ -f "${SCRIPT_DIR}/${NAME}/src/app.tsx" ]; then
  cp "${SCRIPT_DIR}/${NAME}/src/app.tsx" "${DOCS_DIR}/src/app.tsx"
fi

if [ -f "${SCRIPT_DIR}/${NAME}/style.css" ]; then
  cp "${SCRIPT_DIR}/${NAME}/style.css" "${DOCS_DIR}/style.css"
elif [ -f "${SCRIPT_DIR}/${NAME}/src/styles.css" ]; then
  cp "${SCRIPT_DIR}/${NAME}/src/styles.css" "${DOCS_DIR}/style.css"
fi

if [ -f "${SCRIPT_DIR}/${NAME}/index.html" ]; then
  cp "${SCRIPT_DIR}/${NAME}/index.html" "${DOCS_DIR}/index.html"
fi

# Copy the public folder if one is found (graphics, other static files).
if [ -d "${SCRIPT_DIR}/${NAME}/public" ] && [ "$(ls -A ${SCRIPT_DIR}/${NAME}/public)" ]; then
  cp -r "${SCRIPT_DIR}/${NAME}/public/"* "${DOCS_DIR}/"
fi
