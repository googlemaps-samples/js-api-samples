#!/bin/bash

# Copy/generate:
#   - Files for Cloud Shell

echo ">>>Running app.sh"

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
APP_DIR="${PROJECT_ROOT}/dist/samples/${NAME}/app"

echo "PROJECT_ROOT ${PROJECT_ROOT}"
echo "APP_DIR ${APP_DIR}"
echo "SAMPLE_DIR ${SAMPLE_DIR}"

# Create the new folders.
mkdir -p ${APP_DIR}
mkdir -p ${MAIN_DIR}

# Copy files
cp "${SCRIPT_DIR}/${NAME}/index.html" "${APP_DIR}/index.html"
cp "${SCRIPT_DIR}/${NAME}/index.ts" "${APP_DIR}/index.ts"
cp "${SCRIPT_DIR}/${NAME}/style.css" "${APP_DIR}/style.css"
cp "${SCRIPT_DIR}/${NAME}/package.json" "${APP_DIR}/package.json"
cp "${SCRIPT_DIR}/${NAME}/tsconfig.json" "${APP_DIR}/tsconfig.json"
cp "${SCRIPT_DIR}/${NAME}/README.md" "${APP_DIR}/README.md"
cp "${SCRIPT_DIR}/.env" "${APP_DIR}/.env"

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
