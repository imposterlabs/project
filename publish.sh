#!/bin/bash
# check if directory named publish exists
if [ -d "publish" ]; then
    echo "Directory named publish exists, deleting"
    rm -rf publish
fi

mkdir publish
cp package.json publish/
cp package-lock.json publish/
cp LICENSE publish/
cp -r dist/* publish/
cp README.md publish/
