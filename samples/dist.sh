#!/bin/bash

# Copy/generate:
#   - Vite build output for hosting

echo ">>>Running dist.sh"

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
SAMPLE_DIR="${PROJECT_ROOT}/dist/samples/${NAME}"

# Copy Vite output files to /dist/samples/${NAME}/dist
cp -r "${SCRIPT_DIR}/${NAME}/dist" "${SAMPLE_DIR}"