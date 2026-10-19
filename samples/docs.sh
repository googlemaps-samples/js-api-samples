#!/bin/bash

# Copy/generate files for doc snippets.

echo ">>>Running docs.sh"

# Copy static documentation files as part of the build process.
NAME=$1 # The name of the folder, taken from package.json "build" line.

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )" # Script directory (/samples)
PROJECT_ROOT=$(dirname "$SCRIPT_DIR")  # Get the parent directory (js-api-samples)
DIST_DIR="${PROJECT_ROOT}/dist"
SAMPLE_DIR="${PROJECT_ROOT}/dist/samples/${NAME}"

echo "PROJECT_ROOT: ${PROJECT_ROOT}"

DOCS_DIR="${PROJECT_ROOT}/dist/samples/${NAME}/docs"

# Create a new folder.
mkdir -p ${DOCS_DIR}

# Copy files
cp "${SCRIPT_DIR}/${NAME}/index.ts" "${DOCS_DIR}/index.ts"
cp "${SCRIPT_DIR}/${NAME}/index.js" "${DOCS_DIR}/index.js"
cp "${SCRIPT_DIR}/${NAME}/index.html" "${DOCS_DIR}/index.html"
cp "${SCRIPT_DIR}/${NAME}/style.css" "${DOCS_DIR}/style.css"

# Replace import.meta.url with hosted paths
perl -0777 -pi -e "s/new URL\(\s*[\\x27\\x22\\x60]\\.\\/public\\/([^\\x27\\x22\\x60]+)[\\x27\\x22\\x60],\s*import\\.meta\\.url\s*\)(\\.href|\\.toString\(\))?/\`https:\\/\\/maps-docs-team\\.web\\.app\\/samples\\/${NAME}\\/dist\\/\\1\`/g" "${DOCS_DIR}/index.ts" "${DOCS_DIR}/index.js"

# Replace local HTML asset paths with hosted paths
perl -0777 -pi -e "s#src=\"\./([^\"]+\.(png|svg|jpg|jpeg|gif|json|geojson))\"#src=\"https://maps-docs-team.web.app/samples/${NAME}/dist/\1\"#g" "${DOCS_DIR}/index.html"
