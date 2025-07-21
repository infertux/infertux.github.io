#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"

domain=$(basename "$PWD")

./build.sh

rsync -avzc --delete-excluded \
    _site/ "hosting-infertux@hosting.cyberbits.eu:${domain}"
