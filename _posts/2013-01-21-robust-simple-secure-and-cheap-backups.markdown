---
layout: post
title: "Robust, simple, secure and cheap backups"
date: 2013-01-21 04:35
categories:
- backups
- DIY
- hard drive
---

Backup! You should backup. Backup all the things, they say.

![Backup all the things](/images/posts/2013-01-21-robust-simple-secure-and-cheap-backups/backups.jpg)

But backups are tedious to set up and require time to spend on, you would think.

And you'd be wrong.

It took me some time to end up with this setup but now it's been working flawlessly for months and it already saved me a bunch a time to recover a few screw-ups.

## Wait, why?

I like to separate my own personal data (music, videos, projects, official paperwork and all) from my operating system files.
So I have a huge 1 TB disk to hold all that "personal" stuff.
Whilst some of it is not very important, I can't afford to lose most of it.
And we all know that hard drives are unreliable and ultimately die someday.

We will use only free and open source software to achieve our goal.
What else?

## Robust

One may think RAID is the solution.
To be fair, [I thought it was](http://blog.infertux.com/2012/03/29/how-to-set-up-a-raid-1-under-gnu-slash-linux/) for a while before realizing it's not.

Duplicating data on multiple hard drives is fine to overcome hardware failures but what if the place catches on fire, or get water flooded, or collapses in an earthquake?
Since all your duplicates are in the same physical location, you will still lose everything.
That's why RAID is not the solution.

The solution is -- you've guessed it -- having **mirrors in multiple locations** ; the farthest from each other, the better.
I'd say that 500+ kilometers is good enough if you can. For instance, you could use your parents' and/or workplace in addition to your own home.

To make it even more reliable, you can use **different filesystems** in case some devilish file corrupts the whole partition.
For instance, one of my disk is using [XFS](https://en.wikipedia.org/wiki/Xfs) while the other is formatted in [JFS](https://en.wikipedia.org/wiki/JFS_%28file_system%29).

## Simple

Let's kiss, I mean let's _Keep It Simple Stupid_.
So we'll start with just two disks as three and more gets more complicated.
But don't worry because *two mirrors* is good enough as long as they are located in relatively distant locations.

Everything will be automated through a **cron job** which will run the right **rsync** command every day to keep mirrors in sync.

Moreover, it is quite firewall-proof.
As long as you have at least **one machine directly accessible from the Internet**, you're good.
You can have a location like your workplace behind a nasty NAT that refuses any new incoming connections preventing you to access a machine on that LAN from the outside Internet, it's no trouble.

## Secure

What we want here is **full disk encryption** as it's easier to manage than directory-based encryption and this way, we're sure everything is secure.
The overhead induced by encryption is negligible anyway.

**dm-crypt + LUKS** to the rescue.
Quoting the [ArchLinux wiki](https://wiki.archlinux.org/index.php/Dm-crypt_with_LUKS):

> **dm-crypt** is the standard device-mapper encryption functionality provided by the Linux kernel.
> **LUKS** is an additional convenience layer which stores all of the needed setup information for dm-crypt.

It is incredibly easy to use.
Simply format a partition with `cryptsetup luksFormat /dev/sda1` and unlock it with `cryptsetup open /dev/sda1 data` -- _data_ is just an arbitrary mapping in `/dev/mapper/`.

The partition is locked on power outage or by unplugging the data cable (typically USB or e-SATA).

This is a bit annoying because you'll have to ssh in your box to remount and unlock the drive.
But in fairness, it doesn't happen that often, even if you live in the middle of nowhere.
You can even make a start-up script which sends you an email to warn you when it has rebooted.
## Cheap

In the unlikely case you don't have any old hard drive hanging around, you can buy a 2TB disk for like 60 euros nowadays. Add a 10-euro case and you're good to go.

Now, you need to plug this hard drive into some low-end computer.
Personally, I use a [Sheevaplug](https://en.wikipedia.org/wiki/SheevaPlug) at one location and an old EeePC which serves as a music server/media PC at home.

Sheevaplugs are designed to run 24/7 so they're very power-efficient and will cost you about 5 euros per year (based on current market prices here in France).
And of course, they're completely fanless thus silent.

You might be wondering if having the hard drive spinning 24/7 will make it die prematurely.
Apparently, it's actually start/stop cycles which induce temperature shifts that are bad for hard drives according to [this study](https://static.googleusercontent.com/external_content/untrusted_dlcp/research.google.com/en/us/archive/disk_failures.pdf) from Google.
So you can let them spin _all the time_ safely!
It's probably a good idea to have [automated SMART checks](http://sourceforge.net/apps/trac/smartmontools/wiki/TocDoc) to alert you when a disk is doing bad though.

To sum up, it will cost you **0 to less than 100 euros** in most cases.

## Show me the code!

```bash
# Script to unlock and mount the partition

[ -e /dev/mapper/data ] || cryptsetup open /dev/sda1 data && \
fsck.jfs -v /dev/mapper/data && \
mount /dev/mapper/data /data && \
df -h /data
```

```bash
#!/bin/bash -eu

# Example cron job to mirror changes

LOG=/var/log/sync.log

date > $LOG

[ "$(ls -A /data)" ] || { echo "Local disk unmounted?" >&2; exit 1; }
[ "$(ssh mirror -- ls /data/UNMOUNTED 2>/dev/null)" ] && { echo "Remote disk unmounted?" >&2; exit 1; }

rsync -avz --progress --stats --exclude 'Backups/there' --delete /data/ mirror:/data/ &>> $LOG
rsync -avz --progress --stats mirror:/data/Backups/there/ /data/Backups/there/ &>> $LOG

date >> $LOG
```

## Do it!

What are you waiting for?
Just do it.

It _will_ save your ass some day -- that's 100-minus-epsilon percent sure.
And it would be stupid not to since it's really easy to set up.
It just requires a few hours max and possibly a couple of bucks to get robust, simple, secure and cheap backups.

