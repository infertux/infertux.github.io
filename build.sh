#!/bin/bash -eux

bundle exec jekyll build
bundle exec htmlproofer _site --ignore-files "/labs/" --ignore-status-codes 0,403,503,999
