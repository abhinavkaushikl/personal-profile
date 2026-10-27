#!/usr/bin/env bash
# Builds the static site and publishes it to the gh-pages branch served by GitHub Pages.
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf out
GITHUB_PAGES=true npx next build
touch out/.nojekyll

remote="$(git remote get-url origin)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
cp -R out/. "$tmp"

cd "$tmp"
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy site to GitHub Pages

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -f "$remote" gh-pages
echo "Published: https://abhinavkaushikl.github.io/personal-profile/"
