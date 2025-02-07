#!/bin/bash

# Copy/generate files for:
#   - Cloud Shell
#   - Vite build output for hosting

# Generate JSFiddle output as part of the build process.
NAME=$1 # The name of the folder, taken from package.json "build" line.

# Relative path to the top-level of the examples folder.
#OUTPUT_DIR=/Users/[USERNAME]/git/js-api-samples/samples
OUTPUT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

APP_DIR="../../dist/samples/${NAME}/app"
MAIN_DIR="../../dist/samples/${NAME}"

# Create the new folders.
mkdir -p ${APP_DIR}
mkdir -p ${MAIN_DIR}

# Copy files
cp "${OUTPUT_DIR}/${NAME}/index.html" "${APP_DIR}/index.html"
cp "${OUTPUT_DIR}/${NAME}/index.ts" "${APP_DIR}/index.ts"
cp "${OUTPUT_DIR}/${NAME}/style.css" "${APP_DIR}/style.css"
cp "${OUTPUT_DIR}/${NAME}/package.json" "${APP_DIR}/package.json"
cp "${OUTPUT_DIR}/${NAME}/tsconfig.json" "${APP_DIR}/tsconfig.json"
cp "${OUTPUT_DIR}/${NAME}/README.md" "${APP_DIR}/README.md"
cp "${OUTPUT_DIR}/.env" "${APP_DIR}/.env" # TODO: Update the .env with the new API key.
cp -r "${OUTPUT_DIR}/${NAME}/dist" "${MAIN_DIR}"
echo "OUTPUT_DIR ${OUTPUT_DIR}"
echo "MAIN_DIR ${MAIN_DIR}"

# Generate .eslintsrc.json
touch "${APP_DIR}/.eslintsrc.json"
cat > "${APP_DIR}/.eslintsrc.json" << EOF
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


## TODO: Update this to copy