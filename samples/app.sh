#!/bin/bash

# Copy/generate:
#   - Files for Cloud Shell

echo ">>>Running app.sh"

NAME=$1 # The name of the folder, taken from package.json "build" line.

# /Users/[USERNAME]/git/js-api-samples/samples

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )" # Script directory (/samples)
PROJECT_ROOT=$(dirname "$SCRIPT_DIR")  # Get the parent directory (js-api-samples)
DIST_DIR="${PROJECT_ROOT}/dist"

echo "PROJECT_ROOT: ${PROJECT_ROOT}"
echo "SCRIPT_DIR: ${SCRIPT_DIR}"
echo "DIST_DIR: ${DIST_DIR}"
echo "NAME: ${NAME}"

APP_DIR="${PROJECT_ROOT}/dist/samples/${NAME}/app"

# Create the new folders.
mkdir -p ${APP_DIR}

# Copy files
cp "${SCRIPT_DIR}/${NAME}/index.html" "${APP_DIR}/index.html"
cp "${SCRIPT_DIR}/${NAME}/index.ts" "${APP_DIR}/index.ts"
cp "${SCRIPT_DIR}/${NAME}/style.css" "${APP_DIR}/style.css"
cp "${SCRIPT_DIR}/${NAME}/package.json" "${APP_DIR}/package.json"
cp "${SCRIPT_DIR}/${NAME}/tsconfig.json" "${APP_DIR}/tsconfig.json"
cp "${SCRIPT_DIR}/${NAME}/README.md" "${APP_DIR}/README.md"

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
