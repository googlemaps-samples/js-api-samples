#!/bin/bash

set -e
# set -x

NAME=$(basename $PWD)

npx prettier --check --ignore-path ../../.prettierignore .
npx eslint

# set +e
# grep weekly -r --include=*.{html,js,ts,css,jsx,tsx} --exclude-dir=dist
# if [[ $? -eq 0 ]]; then
#   # sure, it could be other things, but so far it's not, so we'll keep it simple for now
#   echo "Found 'weekly'. Please remove (it's the default channel)."
#   exit 1
# fi
# grep callback -r --include=*.{html,js,ts,css,jsx,tsx} --exclude-dir=dist --no-filename | grep -v -E "^\s*//" | grep -v importLibrary # callback & importLibrary both show up the in the inline loader
# if [[ $? -eq 0 ]]; then
#   # sure, it could be other things, but so far it's not, so we'll keep it simple for now
#   echo "Found 'callback'. Please replace with a more modern pattern for loading Maps JS."
#   exit 1
# fi
# grep 'src="https://maps' -r --include=*.html
# if [[ $? -eq 0 ]]; then
#   grep 'src="https://maps' -r --include=*.html | grep "loading=async"
#   if [[ $? -ne 0 ]]; then
#     echo "Missing loading=async in direct script loader."
#     exit 1
#   fi
#   grep -B 1 'src="https://maps' -r --include=*.html | grep " async"
#   if [[ $? -ne 0 ]]; then
#     echo "Missing async attribute on direct script loader (expected on line before)."
#     exit 1
#   fi
#   grep -B 2 -A 2 'src="https://maps' -r --include=*.html | grep " defer"
#   if [[ $? -eq 0 ]]; then
#     echo "Found defer attribute on direct script loader (use async instead)."
#     exit 1
#   fi
# fi
# set -e

# clean comments for empty lines, and then clean up, to preserve newlines
sed -i.sed-back 's#^$#// TMP EMPTY LINE#g' *.ts && rm *.sed-back
set +e
npx tsc
status=$? 
set -e
sed -i.sed-back 's#// TMP EMPTY LINE##g' *.ts *.js && rm *.sed-back
if [[ $status -ne 0 ]]; then
  echo "TS build failure!"
  exit $status
fi

if [[ -f index.js ]]; then # DNE for react builds
  npx prettier -w index.js --ignore-path /dev/null
fi

set +e
grep "google\.maps\." index.js | grep -v "google.maps.importLibrary" | grep -v -E "^\s*//"
if [[ $? -eq 0 ]]; then
  echo "Using google.maps namespace for something other than google.maps.importLibrary()!"
  exit 1
fi
set -e

bash ../jsfiddle.sh "$NAME"
bash ../app.sh "$NAME"
bash ../docs.sh "$NAME"
npm run build:vite --workspace=. 
bash ../dist.sh "$NAME"