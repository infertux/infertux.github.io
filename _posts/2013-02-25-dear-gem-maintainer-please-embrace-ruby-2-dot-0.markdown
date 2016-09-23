---
layout: post
title: "Dear Gem maintainer, please embrace Ruby 2.0"
date: 2013-02-25 22:09
categories:
- Ruby
- Python
- upgrade
- programming
- RubyGem
---

Ruby 2.0 has been released, yay!

Now let's talk a bit about Python, shall we?
Don't worry we'll get back to Ruby soon.

I've done some Python programming before I heard about Ruby. At the time, I was somewhat annoyed/ashamed/frustrated that the Python community was not so enthusiastic about upgrading to Python 3. This new version was fixing many youthful mistakes from Python 2 IMHO.

So when I came across the [Python 3 Wall of Shame](https://python3wos.appspot.com/), I instantly bookmarked it and started spreading the word amongst friends hoping to "greenify" that wall of shame.

Fast forward to last November, I had learnt about Ruby and RubyGems. I'd hack together a weekend project named [RubyGem Wall of Fame](http://labs.infertux.com/rubygems-wof/).
Basically I've been monitoring build statuses of popular Gems since then to see if things were improving.
There is [a nice graph](http://labs.infertux.com/rubygems-wof/#evolution) at the bottom of the page and everything is updated hourly.

Now we're in late February and the _Python 3 Wall of Shame_ has finally crossed the 50% threshold turning it into the _Python 3 Wall of Superpowers_. I haven't witnessed the exact date but it most likely happened during January.

As for Ruby, we hit 19% a couple of days ago.

![Percentage graph](/images/posts/2013-02-25-dear-gem-maintainer-please-embrace-ruby-2-dot-0/percentage.png)

But this figure is pretty inaccurate and it could be much more in reality:

    166 Gems are compatible with Ruby 2.
    677 Gems are not tested against Ruby 2.
    29 Gems are not compatible with Ruby 2.

As you can see, **most Gems are not tested against Ruby 2.0** so one can't know if they're compatible -- we need to fix that.

Whether or not your Gem is compatible, please simply add `- 2.0.0` to the [build matrix](http://about.travis-ci.org/docs/user/languages/ruby/#Choosing-Ruby-versions-implementations-to-test-against) of your `.travis.yml` -- you're using [Travis](https://travis-ci.org/) right?

If you don't see much point in doing so, please read this quote from [the release announcement](http://www.ruby-lang.org/en/news/2013/02/24/ruby-2-0-0-p0-is-released/):

> Note that unlike 1.9.0, 2.0.0 IS a stable release, even though its TEENY is 0. All library authors are strongly recommended to support 2.0.0. As mentioned above, it will be comparatively easy to migrate from 1.9 to 2.0.
>
> Ruby 2.0.0 is ready for practical use, and will absolutely improve your Ruby life.

That will allow us to get a better overall view of the RubyGems ecosystem and where work needs to be done.

![Evolution graph](/images/posts/2013-02-25-dear-gem-maintainer-please-embrace-ruby-2-dot-0/evolution.png)

Happy Rubying with 2.0! :D

Bonus links for you:

- [What's New in Ruby 2.0](https://speakerdeck.com/shyouhei/whats-new-in-ruby-2-dot-0)
- [Ruby 2.0.0 by Example](http://blog.marc-andre.ca/2013/02/23/ruby-2-by-example/)

