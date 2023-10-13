---
layout: page
title: Posts
permalink: /posts/
---

<ul class="list">
{% for post in site.posts %}
  <li>
    <span class="post-meta">{{ post.date | date: "%F" }}</span>
    <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title | escape }}</a>
  </li>
{% endfor %}
</ul>

<small>Subscribe <a href="{{ "/feed.xml" | prepend: site.baseurl }}">via RSS</a></small>
