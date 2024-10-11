---
layout: post
title: "Announcing Bashcov 1.0.0"
date: 2013-03-16 15:25
categories:
- Bash
- code coverage
- testing
- TDD
- Ruby
- SimpleCov
---

Hey look! There's a demo: [infertux.github.io/bashcov/test_app](https://infertux.github.io/bashcov/test_app).

## What is it?

I'm a big fan of both Ruby's [SimpleCov](https://github.com/colszowka/simplecov) and Bash.
[Bashcov](https://github.com/infertux/bashcov) is my dream to have in Bash what SimpleCov is to Ruby.

Oddly enough, I didn't find any coverage tool for Bash except [shcov](https://code.google.com/p/shcov/source/browse/trunk/scripts/shcov) but as stated [there](https://stackoverflow.com/questions/7188081/code-coverage-tools-for-validating-the-scripts), shcov is:

> somewhat simplistic and doesn't handle all possible cases very well (especially when we're talking about long and complex lines)

Indeed, it doesn't work very well for me.
I have covered lines marked as uncovered and some files completely missed although executed through another script (via `source`).
Moreover, I'm not sure it is still being actively maintained.
This makes me feel like a sad panda :(

Bashcov aims to be a neat and working coverage tool backed by SimpleCov and [simplecov-html](https://github.com/colszowka/simplecov-html).

## How does it work?

Ruby has a [coverage module](https://www.ruby-doc.org/stdlib-1.9.3/libdoc/coverage/rdoc/Coverage.html) which computes the coverage on demand.
Unfortunately, Bash doesn't have such niceties but we can use the [xtrace feature](https://www.gnu.org/software/bash/manual/bashref.html#index-BASH_005fXTRACEFD) which prints every line executed using [PS4](https://www.gnu.org/software/bash/manual/bashref.html#index-PS4).

After a bit of parsing, it sends results through SimpleCov which generates an awesome HTML report.

And of course, you can take great advantage of SimpleCov by adding a `.simplecov` file in your project's root (like [this](https://github.com/infertux/bashcov/blob/master/spec/test_app/.simplecov)).

## Is it ready?

Well, I've been working on it for a few months now and it looks stable enough for a 1.0.0 release.
There is [one glitch](https://github.com/infertux/bashcov/issues/2) I'd like to get rid of but apart from that, it works pretty well for me.

My yardstick is currently [RVM](https://github.com/wayneeseguin/rvm) because it has a relatively big codebase and extensive tests.

If you have a Bash project and tests for your code, you could give [Bashcov](https://rubygems.org/gems/bashcov) a try to see what code you're actually covering through your testsuite. I'd love to hear your feedback if so!

