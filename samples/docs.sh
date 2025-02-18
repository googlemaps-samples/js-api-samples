#!/bin/bash

# Copy/generate files for doc snippets.

echo ">>>Running docs.sh"

# Copy static documentation files as part of the build process.
NAME=$1 # The name of the folder, taken from package.json "build" line.

# Relative path to the top-level of the examples folder.
# /Users/[USERNAME]/git/js-api-samples/samples or similar
# Define path based on platform.
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "Hello, Mac!"
  SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
  echo "Project path: ${SCRIPT_DIR}"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  echo "Hello, gLinux!"
  SCRIPT_DIR="$(dirname "$0")"
  echo "Project path: ${SCRIPT_DIR}"
fi

PROJECT_ROOT=$(dirname "$SCRIPT_DIR")  # Get the parent directory (js-api-samples)
DOCS_DIR="${PROJECT_ROOT}/dist/samples/${NAME}/docs"

# Create a new folder.
mkdir -p ${DOCS_DIR}

# Copy files
cp "${SCRIPT_DIR}/${NAME}/index.ts" "${DOCS_DIR}/index.ts"
cp "${SCRIPT_DIR}/${NAME}/index.js" "${DOCS_DIR}/index.js"
cp "${SCRIPT_DIR}/${NAME}/index.html" "${DOCS_DIR}/index.html"
cp "${SCRIPT_DIR}/${NAME}/style.css" "${DOCS_DIR}/style.css"