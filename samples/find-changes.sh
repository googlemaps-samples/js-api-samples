#!/bin/bash

# Run this script from the root folder.

# --- Configuration ---
BASE_REF=${1:-"origin/main"}
PROJECTS_ROOT_DIR="samples/"

# --- Script Logic ---

echo "Detecting changed (added or modified) subfolders in '$PROJECTS_ROOT_DIR' since '$BASE_REF'..."

# Get files that were ADDED or MODIFIED in the PROJECTS_ROOT_DIR
CHANGED_FILES=$(git diff --name-only --diff-filter=AM $BASE_REF HEAD -- "$PROJECTS_ROOT_DIR")

# Determine if we are in a GitHub Actions environment
# GITHUB_ACTIONS is a built-in environment variable set to 'true' by GitHub Actions
IS_GH_ACTIONS="${GITHUB_ACTIONS:-false}"

# Function to set GitHub Actions output
set_gh_output() {
  local name="$1"
  local value="$2"
  if [ "$IS_GH_ACTIONS" = "true" ]; then
    # Use the proper way to set multi-line output in GitHub Actions
    echo "$name<<EOF" >> "$GITHUB_OUTPUT"
    echo "$value" >> "$GITHUB_OUTPUT"
    echo "EOF" >> "$GITHUB_OUTPUT"
  fi
}

if [ -z "$CHANGED_FILES" ]; then
  echo "No changes detected in '$PROJECTS_ROOT_DIR'."
  set_gh_output "changed_workspaces" "" # Set an empty output for GH Actions
  exit 0
fi

echo "All added or modified files detected:"
echo "$CHANGED_FILES"
echo "---"

AFFECTED_SUBFOLDERS=""
for file in $CHANGED_FILES; do
  relative_path="${file#$PROJECTS_ROOT_DIR}"
  
  if [[ -n "$relative_path" && "$relative_path" == */* ]]; then
    subfolder=$(echo "$relative_path" | cut -d '/' -f 1)
    
    if [ -n "$subfolder" ]; then
      AFFECTED_SUBFOLDERS+="$subfolder\n"
    fi
  else
    echo "Ignoring change to file directly in '$PROJECTS_ROOT_DIR': $file"
  fi
done

UNIQUE_CHANGED_WORKSPACES=$(echo -e "$AFFECTED_SUBFOLDERS" | sort -u)

if [ -z "$UNIQUE_CHANGED_WORKSPACES" ]; then
  echo "No specific project subfolders affected within '$PROJECTS_ROOT_DIR'."
  set_gh_output "changed_workspaces" "" # Set an empty output for GH Actions
  exit 0
fi

# --- Post-process UNIQUE_CHANGED_WORKSPACES to remove any '-e ' prefix ---
# This addresses an observed issue where folder names might be unexpectedly prefixed.
CLEANED_WORKSPACES_BUFFER=""
while IFS= read -r line; do
  if [ -n "$line" ]; then # Process only non-empty lines
    cleaned_line=$(echo "$line" | sed 's/^-e[[:space:]]*//') # Match -e followed by zero or more spaces
    CLEANED_WORKSPACES_BUFFER+="$cleaned_line\n"
  fi
done <<< "$UNIQUE_CHANGED_WORKSPACES"
UNIQUE_CHANGED_WORKSPACES=$(echo -e "$CLEANED_WORKSPACES_BUFFER" | sed '/^$/d') # Remove any trailing empty line

echo "Changed (added or modified) subfolders in '$PROJECTS_ROOT_DIR':"
echo "$UNIQUE_CHANGED_WORKSPACES"

# Set the output variable for GitHub Actions
# set_gh_output "changed_workspaces" "$UNIQUE_CHANGED_WORKSPACES"
echo "changed_workspaces=$UNIQUE_CHANGED_WORKSPACES" >> "$GITHUB_OUTPUT"
