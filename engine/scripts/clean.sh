#!/usr/bin/env bash

# Install main modules
rm -rf node_modules

# Install plugin dependencies.
for folder in plugins/*; do
  if [ -d $folder ]; then
    echo
    echo '-----------------------'
    echo "==> ${folder}"
    echo '-----------------------'
    cd $folder
    rm -rf node_modules
    cd ../..
  fi
done
