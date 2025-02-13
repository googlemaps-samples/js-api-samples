#!/bin/bash

# Checkout the dist branch
git checkout dist || git checkout -b dist

# Add and commit the changes to the dist folder
git add dist
git commit -m "Update dist folder"

# Push the changes to the dist branch
git push origin dist
