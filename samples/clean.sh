#!/bin/bash

# Remove the global dist folder.
rm -rf "../dist"

# Remove dist folders from each sample subdirectory.
find * -type d -name "dist" -exec rm -rf {} +