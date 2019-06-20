#!/bin/bash

set -eu

DIST=dist
VERSION=$(git describe --tags --dirty)

echo "Creating release for version ${VERSION}"

mkdir -p ${DIST}
npm run build
tar \
    --exclude 'build/config.local*.json' \
    --transform "s/build/okitty-${VERSION}/" \
    -czf "${DIST}/okitty-${VERSION}.tar.gz" build/
