---
layout: post
title: "Ruby reads like English"
date: 2012-11-28 22:42
categories:
- Ruby
- code
- obfuscation
- wtf
---

What I like with the Ruby language is that it reads easily.
Too easily actually.

What about some code obfuscation just for the lulz?

```ruby
# -*- coding: UTF-8 -*-

           def    
         require  
           end

    %w(open-srx gnmt).
     each_with_index{
   |a, а| (42**а*1337).
     times {a.succ!}
           a}#

p JSON.parse(open(<<-RUBY

  ugg  c  , !!e  h   ol
  t  r z  f .  b  e t
  !nc  v  ! i1!    n
  pg   v  i v  g   l
  ! w  hfg_ hcq    n

        grq.wfba
          RUBY
     .gsub!(/\s/, '').
tr(' -,a-z', '\.-:n-za-m')).
          read
  )['-i'.to_c.to_s.unpack(
          's!x'
         ).pop -
         0x2d30]
```

**This is valid Ruby code!**

You can run it safely (at least on 1.9.3).
It'll output [the latest updated RubyGem](http://guides.rubygems.org/rubygems-org-api/#activity) -- obviously!

And [here](https://gist.github.com/4165066) is the commented version if this code isn't crystal clear to you. :)

