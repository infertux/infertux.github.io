#!/bin/bash -eux

bundle exec jekyll build
bundle exec htmlproofer _site --ignore-files "/labs/" --only-4xx
