---
layout: post
title: "Properly close a frozen SSH session"
date: 2012-12-20 17:03
categories:
- SSH
- WiFi
- tip
- network
---

There is a little thing that has always bothered me with SSH.

> How do you properly terminate a frozen session without closing your terminal?

It turns out there is a very easy way yet not widespread.

Let's say you're happily typing in your remote shell when all of sudden, the crappy WiFi network you're using goes down.
You end up with a perfectly unusable frozen shell, ugh!

    % ssh box
    root@box:~# while true; do date; sleep 1; done
    Thu Dec 20 13:37:39 UTC 2012
    Thu Dec 20 13:37:40 UTC 2012
    Thu Dec 20 13:37:41 UTC 2012
    Connection to box closed.
    zsh: exit 255   ssh box

To do that, assuming you lost connectivity at 13:37:42, press in that order:

1. [Enter]
1. ~
1. .

That is, _return key_ then _tilde_ then _period_.

This will send an escape sequence to your **local** SSH client and terminate the connection.
So this will always work even without a network connection.

Here's the list of cool escape sequences you can use:

    ~?
    Supported escape sequences:
      ~.  - terminate connection (and any multiplexed sessions)
      ~B  - send a BREAK to the remote system
      ~C  - open a command line
      ~R  - Request rekey (SSH protocol 2 only)
      ~^Z - suspend ssh
      ~#  - list forwarded connections
      ~&  - background ssh (when waiting for connections to terminate)
      ~?  - this message
      ~~  - send the escape character by typing it twice
    (Note that escapes are only recognized immediately after newline.)

No more `Ctrl-B + x` to kill that frozen tab of your _tmux_, no more `kill -9 THE_RIGHT_PID`.
Hell yeah!
