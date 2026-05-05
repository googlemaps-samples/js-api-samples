#!/bin/bash

set -e
set -x

NAME=$(basename $PWD)

# clean comments for empty lines, and then clean up, to preserve newlines
sed -i.sed-back 's#^$#// TMP EMPTY LINE#g' *.ts && rm *.sed-back
set +e
npx tsc
status=$? 
sed -i.sed-back 's#// TMP EMPTY LINE##g' *.ts *.js && rm *.sed-back
if [[ $status -ne 0 ]]; then
  echo "TS build failure!"
  exit $status
fi

npx prettier -w index.js --ignore-path /dev/null

set +e
grep "google\.maps\." index.js | grep -v "google.maps.importLibrary"
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