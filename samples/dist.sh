#!/bin/bash

# Copy/generate:
#   - Vite build output for hosting

echo ">>>Running dist.sh"

NAME=$1 # The name of the folder, taken from package.json "build" line.

# /Users/[USERNAME]/git/js-api-samples/samples

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )" # Script directory (/samples)
PROJECT_ROOT=$(dirname "$SCRIPT_DIR")  # Get the parent directory (js-api-samples)
DIST_DIR="${PROJECT_ROOT}/dist"
SAMPLE_DIR="${PROJECT_ROOT}/dist/samples/${NAME}"

echo "PROJECT_ROOT: ${PROJECT_ROOT}"

# Copy Vite output files to /dist/samples/${NAME}/dist
cp -r "${SCRIPT_DIR}/${NAME}/dist" "${SAMPLE_DIR}"