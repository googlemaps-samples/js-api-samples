# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Copy contents of /dist to the Cloud Bucket.

#!/bin/bash

# Configuration
BUCKET_NAME="maps-docs-team.appspot.com"
DIST_FOLDER="../dist"
LATEST_FOLDER="gs://$BUCKET_NAME/latest"
ARCHIVE_FOLDER="gs://$BUCKET_NAME/archive"
MAX_ARCHIVES=5  # Number of archive folders to keep

# Check if dist folder exists
if [! -d "$DIST_FOLDER" ]; then
  echo "Error: Dist folder '$DIST_FOLDER' not found."
  exit 1
fi

# Create archive folder if it doesn't exist
gsutil ls "$ARCHIVE_FOLDER" || gsutil mkdir "$ARCHIVE_FOLDER"

# Move current 'latest' to a dated archive folder
if gsutil ls "$LATEST_FOLDER"; then  # Check if 'latest' folder exists
  DATE=$(date +%Y%m%d%H%M%S)  # Get current timestamp
  ARCHIVE_DESTINATION="$ARCHIVE_FOLDER/$DATE"
  gsutil -m cp -r "$LATEST_FOLDER" "$ARCHIVE_DESTINATION"
fi

# Upload to 'latest'
gsutil -m cp -r "$DIST_FOLDER"/* "$LATEST_FOLDER/"

echo "Uploaded to $LATEST_FOLDER"

# Cleanup old archives (keep MAX_ARCHIVES)
ARCHIVES=($(gsutil ls "$ARCHIVE_FOLDER" | grep -v / | sort -r)) # Get list of archives
ARCHIVE_COUNT=${#ARCHIVES[@]}

if (( ARCHIVE_COUNT > MAX_ARCHIVES )); then
  OLDEST_ARCHIVE="${ARCHIVES[((MAX_ARCHIVES))]}" # Get the oldest archive
  gsutil rm -r "$OLDEST_ARCHIVE"
  echo "Deleted oldest archive: $OLDEST_ARCHIVE"
fi