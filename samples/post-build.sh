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

#!/bin/bash

echo ">>>Running post-build.sh"

#!/bin/bash

# Check if the dist branch exists remotely
if git ls-remote --exit-code --heads origin dist; then
    # Delete the dist branch locally if it exists
    if git show-ref --verify --quiet refs/heads/dist; then
        git branch -D dist
    fi
    # Delete the dist branch remotely
    git push origin --delete dist
fi

git checkout -b dist main

# Add and commit the changes to the dist folder
git add dist
git add index.html

# Check if there are any changes to commit
if [[ -n $(git status --porcelain) ]]; then
    git commit -m "Update dist folder"
    git push origin dist
else
    echo "No changes to commit"
fi
