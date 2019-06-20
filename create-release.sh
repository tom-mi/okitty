#!/bin/bash

set -eu

DIST=dist
VERSION=$(git describe --tags --dirty)
export REACT_APP_VERSION=${VERSION}

echo "Creating release for version ${VERSION}"

mkdir -p ${DIST}

npm run build
tar \
    --exclude 'config.local*.json' \
    -czf "${DIST}/okitty-${VERSION}.tar.gz" -C build/ .

PUBLIC_URL=/okitty npm run build
tar \
    --exclude 'config.local*.json' \
    --transform 's,^build,okitty,' \
    -czf "${DIST}/okitty-context-${VERSION}.tar.gz" build/
