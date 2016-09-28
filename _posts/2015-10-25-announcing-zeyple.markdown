---
layout: post
title: "Announcing Zeyple"
date: 2015-10-25 16:20:20 +0000
categories:
- Zeyple
- GPG
- PGP
- encryption
- email
- Postfix
- Python
---

## What is it?

Zeyple. What's that? A brand of cereals? A new app for your smartphone? The name of a pizza-making robot?

Well, it's none of the above. It's actually the funky name I gave to a project I started several years ago, sometime in 2012 according to the Git history.

It was the pre-[Snowden](https://en.wikipedia.org/wiki/Edward_Snowden) era but I was already worried about blackhats doing [MITM](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) attacks onto my WiFi network.
One thing which particularly annoyed me was that it was relatively easy for someone to sniff the unencrypted emails I was receiving from various servers I was _root_ on.
This made me wonder how you could **Encrypt Your Precious Log Emails** [<a id="fnl-2015-10-25-1" href="#fn-2015-10-25-1">1</a>] all the way from the originating server to your inbox.

Obviously, [GPG](https://en.wikipedia.org/wiki/GNU_Privacy_Guard) was the answer.
But how do you make your server automatically encrypt all outgoing emails sent from a variety of applications?
That is exactly what [Zeyple](https://github.com/infertux/zeyple) does.
Assuming you configured [Postfix](http://www.postfix.org/) to send your emails, Zeyple acts as a proxy (or [filter](http://www.postfix.org/FILTER_README.html) in Postfix slang) to encrypt emails for the intended recipient(s).

## Is it ready?

Today, I'm glad to say the project can be considered stable with [release 1.1.0](https://github.com/infertux/zeyple/blob/master/CHANGELOG.md).
I got feedback from solo hobbyists to universities using it and this is quite exciting to see that *some* people do care about encryption and IT security in general.
Anyway, if that sounds of interest to you, you're very welcome to try it out on your own setup.
There are [a few ways to install it](https://github.com/infertux/zeyple/blob/master/INSTALL.md) but I haven't gotten to build official packages for your favorite distribution, [yet](https://github.com/infertux/zeyple/issues/1).

And here's the README for more information: [https://github.com/infertux/zeyple#readme](https://github.com/infertux/zeyple#readme)

## Footnotes

[<a id="fn-2015-10-25-1" href="#fnl-2015-10-25-1">1</a>]
In case you're wondering, yes this is where the name Zeyple came from - it's just a good old recursive acronym like _GNU's Not Unix!_
