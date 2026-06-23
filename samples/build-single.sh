#!/bin/bash

set -e
# set -x

NAME=$(basename $PWD)

# start with some rudimentary checks for best practices...

common_recursive_grep_options=( -r --exclude-dir=node_modules --exclude-dir=dist )
all_type_recursive_grep_options=( "${common_recursive_grep_options[@]}" --include=*.{html,js,ts,css,jsx,tsx} )
html_recursive_grep_options=( "${common_recursive_grep_options[@]}"  --include=*.html )
html_script_src_grep_options=( 'src="https://maps' "${html_recursive_grep_options[@]}" )

find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "./dist/*" -not -path "./node_modules/*" -print0 \
 | while IFS= read -r -d '' file; do
    range=999
    while IFS= read -r line; do
      # echo "$file $range $line"
      if [[ "$line" == *"await google"* ]]; then
        if [[ $range -lt 3 ]]; then
          echo "Found 'await google' in close proximity. Consider Promise.all() instead. $file"
          exit 1
        fi

        range=0
      else
        range=$(( $range + 1 ))
      fi
    done < "$file"
done

find . -type f -name "*.html" -not -path "./dist/*" -not -path "./node_modules/*" -print0 \
 | while IFS= read -r -d '' file; do
    body_started=false
    while IFS= read -r line; do
      # echo "$file $body_started $line"
      if [[ "$line" == *"<body"* ]]; then
        body_started=true
      fi
      if [[ "$line" == *"<script"* && "$body_started" == "true" ]]; then
        echo "Found '<script>' in <body>. Move to <head>. $file"
        exit 1
      fi
    done < "$file"
done

set +e

grep -i -E " init\(" "${common_recursive_grep_options[@]}" --include=*.{ts,tsx} > /dev/null
if [[ $? -ne 0 ]]; then
  grep -i -E " init[a-z]+\(" "${common_recursive_grep_options[@]}" --include=*.{ts,tsx}
  if [[ $? -eq 0 ]]; then
    echo "Found an init...() function but not an init() function. Must normalize root init() function name.";
    exit 1
  fi
fi

grep -i "internal_usage_attribution_ids" "${html_recursive_grep_options[@]}"
if [[ $? -eq 0 ]]; then
  echo "Found 'internal_usage_attribution_ids'. Not a valid param.";
  exit 1
fi

grep -E "\(\{\}\)" "${common_recursive_grep_options[@]}" --include=*.{ts,tsx}
if [[ $? -eq 0 ]]; then
  echo "Found '({})' in the code. That should probably be just '()'.";
  exit 1
fi

grep -E "\[," "${common_recursive_grep_options[@]}" --include=*.{ts,tsx}
if [[ $? -eq 0 ]]; then
  echo "Found '[,' in the code. Reorder the calls to avoid.";
  exit 1
fi

grep "<!-- prettier-ignore -->" "${html_recursive_grep_options[@]}"
if [[ $? -eq 0 ]]; then
  echo "Don't use '<!-- prettier-ignore -->' in HTML files. For the inline loader, use a '// prettier-ignore' comment inside the <script> tag."
  exit 1
fi

# __ib__ is in the inline loader
grep "__ib__" "${html_recursive_grep_options[@]}" > /dev/null
if [[ $? -eq 0 ]]; then
  grep "__ib__" "${html_recursive_grep_options[@]}" | grep "({$" > /dev/null
  if [[ $? -ne 0 ]]; then
    echo "For the inline loader, the first line should end with '({'."
    exit 1
  fi
  grep "__ib__" "${html_recursive_grep_options[@]}" | grep -E '^[-_./a-z0-9]+: {12}\(' > /dev/null
  if [[ $? -ne 0 ]]; then
    echo "For the inline loader, the first line should be indented correctly."
    exit 1
  fi
  grep -A 1 "__ib__" "${html_recursive_grep_options[@]}" | grep -E '^[-_./a-z0-9]+- {16}key' > /dev/null
  if [[ $? -ne 0 ]]; then
    echo "For the inline loader, the config lines should be properly indented."
    exit 1
  fi
  grep -A 3 "__ib__" "${html_recursive_grep_options[@]}" | grep -E '^[-_./a-z0-9]+- {12}\}\);$' > /dev/null
  if [[ $? -ne 0 ]]; then
    echo "For the inline loader, the '});' should be on its own line, and properly indented."
    exit 1
  fi
fi

grep "var h, a, k, p" "${all_type_recursive_grep_options[@]}"
if [[ $? -eq 0 ]]; then
  # sure, it could be other things, but so far it's not, so we'll keep it simple for now
  echo "Found semi-unminified inline loader. Please be sure to use the most compressed inline loader (see new-sample.sh)."
  exit 1
fi

grep weekly "${all_type_recursive_grep_options[@]}"
if [[ $? -eq 0 ]]; then
  # sure, it could be other things, but so far it's not, so we'll keep it simple for now
  echo "Found 'weekly'. Please remove (it's the default channel)."
  exit 1
fi

# callback & __ib__ both show up the in the inline loader, that's okay. comments also okay
grep callback "${all_type_recursive_grep_options[@]}" | grep -v -E '^[-_./a-z0-9]+:\s*//' | grep -v __ib__ 
if [[ $? -eq 0 ]]; then
  # sure, it could be other things, but so far it's not, so we'll keep it simple for now
  echo "Found 'callback'. Please replace with a more modern pattern for loading Maps JS."
  exit 1
fi

grep "${html_script_src_grep_options[@]}" > /dev/null
if [[ $? -eq 0 ]]; then
  grep "${html_script_src_grep_options[@]}" | grep "loading=async" > /dev/null
  if [[ $? -ne 0 ]]; then
    echo "Missing loading=async in direct script loader."
    exit 1
  fi
  grep -B 1 "${html_script_src_grep_options[@]}" | grep " async" > /dev/null
  if [[ $? -ne 0 ]]; then
    echo "Missing async attribute on direct script loader (expected on line before)."
    exit 1
  fi
  grep -B 2 -A 2 "${html_script_src_grep_options[@]}" | grep " defer"
  if [[ $? -eq 0 ]]; then
    echo "Found defer attribute on direct script loader (use async instead)."
    exit 1
  fi
fi

set -e

npx prettier --check --ignore-path ../../.prettierignore .
npx eslint

# actual TS build...

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


if ls *.js; then # Note: DNE for react builds
  # ensure final output is still pretty...
  echo "Making JS pretty..."
  sed -i.sed-back 's#// @ts-expect-error.*##g' *.js && rm *.sed-back
  sed -i.sed-back 's#// eslint-disable.*##g' *.js && rm *.sed-back
  sed -i.sed-back 's#/\* eslint-disable.*\*/##g' *.js && rm *.sed-back
  npx prettier -w *.js --ignore-path /dev/null # --ignore-path /dev/null forces enablement 
fi

# post-build checks:
set +e

start_snippet_ct=$(grep "\[START " "${common_recursive_grep_options[@]}" --include=*.js | wc -l)
end_snippet_ct=$(grep "\[END " "${common_recursive_grep_options[@]}" --include=*.js | wc -l)
if [[ $start_snippet_ct -ne $end_snippet_ct ]]; then
  echo "Mismatched snippet tags in final output (may have been stripped by TSC)."
  exit 1
fi

grep "google\.maps\." "${common_recursive_grep_options[@]}" --include=*.js | grep -v "google.maps.importLibrary" | grep -v -E '^[-_./a-z0-9]+:\s*//'
if [[ $? -eq 0 ]]; then
  echo "Using google.maps namespace for something other than google.maps.importLibrary()."
  exit 1
fi

set -e

bash ../jsfiddle.sh "$NAME"
bash ../app.sh "$NAME"
bash ../docs.sh "$NAME"
npm run build:vite --workspace=. 