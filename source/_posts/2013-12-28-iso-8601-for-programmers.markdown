---
layout: post
title: "ISO 8601 for programmers"
date: 2013-12-28 10:02:16 +0000
categories:
- ISO 8601
- date
- time
- software
- strftime
---

As programmers, we all know we should use [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) to format date and time when represented numerically.

![XKCD 1179](/images/posts/2013-12-28-iso-8601-for-programmers/iso_8601.png)

Unfortunately, the POSIX standard does not always provide us with an easy way to use ISO 8601 with [strftime](http://man7.org/linux/man-pages/man3/strftime.3.html).
That's why I'm posting here _the right way_ to do it:

- date: `%Y-%m-%d` or `%F` for recent implementations (example: _2013-12-31_)
- time: `%H:%M:%S` or `%T` for recent implementations (example: _23:59:59_)

