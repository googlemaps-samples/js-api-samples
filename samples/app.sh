#!/bin/bash

# Copy/generate files for Cloud Shell and dist.

# TODO: Test in the context of tsconfig.

# Disable history expansion so '!' doesn't trigger the command. (do we need this?)
#set +H

# Generate JSFiddle output as part of the build process.
NAME=$1 # The name of the folder, taken from package.json "build" line.

# Relative path to the top-level of the examples folder.
#OUTPUT_DIR=/Users/[USERNAME]/git/js-api-samples/samples
OUTPUT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

DIST_DIR="../../dist/samples/${NAME}/app"

# Create a new folder.
mkdir -p ${DIST_DIR}

# Copy files
cp "${OUTPUT_DIR}/${NAME}/index.html" "${DIST_DIR}/index.html"
cp "${OUTPUT_DIR}/${NAME}/index.ts" "${DIST_DIR}/index.ts"
cp "${OUTPUT_DIR}/${NAME}/style.css" "${DIST_DIR}/style.css"
cp "${OUTPUT_DIR}/${NAME}/package.json" "${DIST_DIR}/package.json"
cp "${OUTPUT_DIR}/${NAME}/tsconfig.json" "${DIST_DIR}/tsconfig.json"
cp "${OUTPUT_DIR}/${NAME}/README.md" "${DIST_DIR}/README.md"
cp "${OUTPUT_DIR}/.env" "${DIST_DIR}/.env"

cp -r "${OUTPUT_DIR}/${NAME}/dist" "${DIST_DIR}/dist"

# Generate .eslintsrc.json
touch "${DIST_DIR}/.eslintsrc.json"
cat > "${DIST_DIR}/.eslintsrc.json" << EOF
{
  "extends": [
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "rules": {
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/no-this-alias": 1,
    "@typescript-eslint/no-empty-function": 1,
    "@typescript-eslint/explicit-module-boundary-types": 1,
    "@typescript-eslint/no-unused-vars": 1
  }
}
EOF