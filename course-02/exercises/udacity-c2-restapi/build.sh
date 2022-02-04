#!/bin/bash
rm -rf build
mkdir -p build
cp -rf src/.ebextensions build/.ebextensions
cp -rf src/config build/config
cp .npmrc build/.npmrc
cp package.json build/package.json
tsc
cd build
zip -r archive.zip .