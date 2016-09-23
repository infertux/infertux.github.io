#!/bin/bash -eux

bundle exec jekyll build
bundle exec htmlproofer _site --disable-external --check-html
