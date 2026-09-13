#!/usr/bin/env sh

# abort on errors
set -e

# remove the previous build/deploy repository
rm -rf dist

# build
npm run build

# navigate into the build output directory
cd dist

# bypass Jekyll processing on GitHub Pages
echo > .nojekyll

git init
git checkout -B main
git add -A
git commit -m 'deploy'

git push -f https://github.com/DB2837/exams-simulator.git main:gh-pages

cd -
