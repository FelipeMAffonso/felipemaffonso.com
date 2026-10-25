#!/usr/bin/env bash
# Publish the site to GitHub Pages without GitHub Actions.
#
# GitHub Actions is off on every repository since 2026-10-24 (Felipe: "we should NEVER use it"),
# so the old .github/workflows/deploy.yml never runs and a push to master publishes nothing.
# Pages instead serves the gh-pages branch exactly as it is, because that branch holds a .nojekyll
# file at its root. GitHub's own words: "if GitHub Actions is unavailable or disabled, adding a
# .nojekyll file to the root of your source branch" publishes the files without a build
# (github.blog/changelog/2024-07-08-pages-legacy-worker-sunset).
#
# This script is the publish step, and it is run only on Felipe's word. It:
#   1. refuses unless master is checked out, clean, and equal to origin/master, so the site that
#      goes live is the code that is on GitHub;
#   2. builds master's HEAD in a temporary worktree (a running `npm run dev` keeps working);
#   3. commits the built out/ folder, plus .nojekyll, to the gh-pages branch and pushes it;
#   4. checks that Pages publishes from gh-pages, and waits until felipemaffonso.com serves the
#      new build (it compares the build id in the live home page with the one just built).
#
# One-time setting, already made on 2026-10-25: Pages source = branch gh-pages, folder /.
#   gh api -X PUT repos/FelipeMAffonso/felipemaffonso.com/pages \
#     -f build_type=legacy -f "source[branch]=gh-pages" -f "source[path]=/"
#
# Usage: bash scripts/publish-pages.sh
set -euo pipefail

REPO="FelipeMAffonso/felipemaffonso.com"
SITE="https://felipemaffonso.com"
root="$(git rev-parse --show-toplevel)"
cd "$root"

branch="$(git rev-parse --abbrev-ref HEAD)"
[ "$branch" = "master" ] || { echo "REFUSED: check out master first (on $branch)."; exit 1; }
git fetch -q origin
[ -z "$(git status --porcelain)" ] || { echo "REFUSED: the working tree has uncommitted changes."; exit 1; }
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/master)" ] || { echo "REFUSED: master differs from origin/master; push or pull first."; exit 1; }
sha="$(git rev-parse --short HEAD)"

tmp="$(mktemp -d)"
src="$tmp/src"
pub="$tmp/pages"
cleanup() {
  git -C "$root" worktree remove --force "$src" 2>/dev/null || true
  git -C "$root" worktree remove --force "$pub" 2>/dev/null || true
  git -C "$root" worktree prune
}
trap cleanup EXIT

echo "Building master $sha in a temporary worktree ..."
git worktree add -q --detach "$src" HEAD
# reuse this clone's node_modules instead of installing again
if command -v cygpath >/dev/null 2>&1; then
  powershell.exe -NoProfile -Command "New-Item -ItemType Junction -Path '$(cygpath -w "$src/node_modules")' -Target '$(cygpath -w "$root/node_modules")' | Out-Null"
else
  ln -s "$root/node_modules" "$src/node_modules"
fi
(cd "$src" && npm run build)
[ -f "$src/out/index.html" ] && [ -f "$src/out/CNAME" ] || { echo "REFUSED: the build has no out/index.html or out/CNAME."; exit 1; }
# the build id names a folder under out/_next/static/ and is printed inside every built page
build_id="$(cat "$src/.next/BUILD_ID")"
grep -q -F "$build_id" "$src/out/index.html" || { echo "REFUSED: the build id $build_id is not in out/index.html."; exit 1; }

echo "Committing the build to gh-pages ..."
if git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  git fetch -q origin gh-pages
  git worktree add -q -B gh-pages "$pub" origin/gh-pages
  git -C "$pub" rm -rq --ignore-unmatch .
else
  git worktree add -q --detach "$pub"
  git -C "$pub" checkout -q --orphan gh-pages
  git -C "$pub" rm -rq --cached . >/dev/null
  git -C "$pub" clean -fdxq
fi
cp -R "$src/out/." "$pub/"
touch "$pub/.nojekyll"
git -C "$pub" add -A
git -C "$pub" commit -q -m "Publish master $sha" || echo "(nothing changed since the last publish)"
git -C "$pub" push -q origin gh-pages

pages="$(gh api "repos/$REPO/pages" --jq '.build_type + " " + .source.branch')"
if [ "$pages" != "legacy gh-pages" ]; then
  echo "NOT LIVE: Pages publishes from '$pages', not 'legacy gh-pages'. Run the one-time command at the top of this script."
  exit 2
fi

echo "Waiting for $SITE to serve build $build_id ..."
for i in $(seq 1 60); do
  if curl -s "$SITE/?publish=$sha-$i" | grep -q -F "$build_id"; then
    echo "LIVE: $SITE serves master $sha."
    exit 0
  fi
  sleep 10
done
echo "NOT YET LIVE after 10 minutes: check https://github.com/$REPO/settings/pages."
exit 3
