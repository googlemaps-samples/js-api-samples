#!/bin/bash

# --- Configuration ---
BASE_REF=${1:-"origin/main"}
PROJECTS_ROOT_DIR="samples/"

# --- Script Logic ---

echo "Detecting deleted subfolders in '$PROJECTS_ROOT_DIR' since '$BASE_REF'..."

# Get files that were deleted in the PROJECTS_ROOT_DIR
DELETED_FILES=$(git diff --name-only --diff-filter=D $BASE_REF HEAD -- "$PROJECTS_ROOT_DIR")

# Determine if we are in a GitHub Actions environment
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

if [ -z "$DELETED_FILES" ]; then
  echo "No deleted files detected in '$PROJECTS_ROOT_DIR', so no subfolders could have been deleted."
  set_gh_output "deleted_workspaces" "" # Set an empty output for GH Actions
  exit 0
fi

echo "All deleted files detected:"
echo "$DELETED_FILES"
echo "---"

DELETED_SUBFOLDERS=""
for file in $DELETED_FILES; do
  # Remove the PROJECTS_ROOT_DIR prefix to get the path relative to PROJECTS_ROOT_DIR
  relative_path="${file#$PROJECTS_ROOT_DIR}"
  
  # Check if the file was inside a subfolder (path contains '/')
  if [[ -n "$relative_path" && "$relative_path" == */* ]]; then
    subfolder=$(echo "$relative_path" | cut -d '/' -f 1)
    
    if [ -n "$subfolder" ]; then
      DELETED_SUBFOLDERS+="$subfolder\n"
    fi
  fi
done

UNIQUE_DELETED_SUBFOLDERS=$(echo -e "$DELETED_SUBFOLDERS" | sort -u)

if [ -z "$UNIQUE_DELETED_SUBFOLDERS" ]; then
  echo "No specific project subfolders appear to have been deleted within '$PROJECTS_ROOT_DIR'."
  set_gh_output "deleted_workspaces" "" # Set an empty output for GH Actions
  exit 0
fi

echo "Potentially deleted subfolders in '$PROJECTS_ROOT_DIR' (based on deleted files):"
echo "$UNIQUE_DELETED_SUBFOLDERS"

# Set the output variable for GitHub Actions
set_gh_output "deleted_workspaces" "$UNIQUE_DELETED_SUBFOLDERS"