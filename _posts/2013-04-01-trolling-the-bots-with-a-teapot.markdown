---
layout: post
title: "Trolling the bots with a teapot"
date: 2013-04-01 23:47
categories:
- nginx
- troll
- bots
- crawlers
- HTTP
- teapot
---

I finally got rid of the superfluous `blog/` in the URL having already a `blog` sub-domain.
Of course, I didn't want to break old links so I added the following line in my [nginx](https://nginx.org/) config:

    rewrite ^/blog(.*)$ $1 permanent;

But as always with nginx, that worked like a charm and was just too easy.
So I thought I would troll some nasty crawlers while I was at editing my nginx config.

Even though I don't use PHP, a lots of bots are spamming my logs with `GET /wp-login.php?action=register` and so forth.

So from now on, I just tell them _I'm a teapot_:

    location ~ \.(aspx|php|jsp|cgi)$ {
      return 418 "I'm a teapot!";
    }

Hopefully, that will make them confused enough to GTFO for good.

PS: I should point out this would not have been possible without [that brilliant RFC](https://tools.ietf.org/html/rfc2324#section-2.3.2) written exactly fifteen years ago.

