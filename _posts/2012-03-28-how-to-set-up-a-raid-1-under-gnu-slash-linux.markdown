---
layout: post
title: "How to set up a RAID 1 under GNU/Linux"
date: 2012-03-29 00:42
categories:
- RAID
- hardware
- GNU/Linux
- mdadm
- fdisk
- sysadmin
---

This article explains how to set up a software RAID 1 (simple mirroring) under
GNU/Linux with existing data.

Rationale: Let's say you've got two hard drives of the same size and want to
make some redundancy because the currently installed disk is starting to make
scary noises. You know, that kind of "I'm gonna die soonish!" sound in hard
drive parlance.  Also, you don't want to format this first drive so we'll see
how to build a RAID 1 array on our already running system without losing data or
using a third drive.

<a href="https://www.flickr.com/photos/knowprose/111119035/" title="Old Hard Drive... circa 1982 (1) by TaranRampersad, on Flickr"><img src="/images/posts/2012-03-28-how-to-set-up-a-raid-1-under-gnu-slash-linux/111119035_c65e65c164_z.jpg" width="640" height="480" alt="Old Hard Drive... circa 1982 (1)"></a>

This how-to should be suitable for any GNU/Linux distro (the only
distro-specific step is explained for Fedora and Debian families).

First of all, let's make sure we've got the package _mdadm_ installed:

    sudo yum install mdadm # or sudo apt-get install mdadm

`sdd` and `sde` will be the two drives that we're going to use for our RAID.
`sde` is the one containing the existing precious data and `sdd` is the spare
drive with nothing important on it (it'll be formatted). Bare in mind to adapt
it for your configuration if different.

_Pro tip: An array of two drives can read in two different places at the same
time. Therefore, to maximize performance benefits of RAID 1, you should use
independent disk controllers, i.e. one for each disk._

Start by unmounting both drives to be sure they are not currently used:

    sudo umount /dev/sd{d,e}?

The next step is to change the partition type to _Linux raid autodetect_ for
every partition on `sde`.

    sudo fdisk /dev/sde
    [...]
    Command (m for help): p

    Disk /dev/sde: 1000.2 GB, 1000204886016 bytes
    [...]
       Device Boot      Start         End      Blocks   Id  System
    /dev/sde1            2048  1953523711   976760832   83  Linux

    Command (m for help): t
    Selected partition 1
    Hex code (type L to list codes): fd
    Changed system type of partition 1 to fd (Linux raid autodetect)

    Command (m for help): w
    The partition table has been altered!

    Calling ioctl() to re-read partition table.
    Syncing disks.

Then we can use _sfdisk_ to copy the partition table from `sde` to `sdd`:

    sudo sfdisk -d /dev/sde | sudo sfdisk /dev/sdd
    Checking that no-one is using this disk right now ...
    OK

    Disk /dev/sdd: 121601 cylinders, 255 heads, 63 sectors/track
    [...]
    New situation:
    Units = sectors of 512 bytes, counting from 0

       Device Boot    Start       End   #sectors  Id  System
    /dev/sdd1          2048 1953523711 1953521664  fd  Linux raid autodetect
    /dev/sdd2             0         -          0   0  Empty
    /dev/sdd3             0         -          0   0  Empty
    /dev/sdd4             0         -          0   0  Empty
    [...]

Check both hard drives have the same layout:

    sudo fdisk -l /dev/sdd /dev/sde

    Disk /dev/sdd: 1000.2 GB, 1000204886016 bytes
    [...]
       Device Boot      Start         End      Blocks   Id  System
    /dev/sdd1            2048  1953523711   976760832   fd  Linux raid autodetect

    Disk /dev/sde: 1000.2 GB, 1000204886016 bytes
    [...]
       Device Boot      Start         End      Blocks   Id  System
    /dev/sde1            2048  1953523711   976760832   fd  Linux raid autodetect

Your might need to reset the superblock if the drive was used to be part of a
RAID.  But it doesn't hurt to reset it anyway, you'll just get this warning if
it wasn't necessary - no worries.

    sudo mdadm --zero-superblock /dev/sdd1
    mdadm: Unrecognised md component device - /dev/sdd1

Then, we create the actual RAID 1 using the placeholder `missing` for our
partition with existing data. That will allow us to mount it outside from the
RAID to copy our data onto the new RAID.

    sudo mdadm --create /dev/md0 --level=1 --raid-disks=2 missing /dev/sdd1
    mdadm: Note: this array has metadata at the start and
        may not be suitable as a boot device.  If you plan to
        store '/boot' on this device please ensure that
        your boot-loader understands md/v1.x metadata, or use
        --metadata=0.90
    Continue creating array? y
    mdadm: Defaulting to version 1.2 metadata
    mdadm: array /dev/md0 started.

Since my partition is a simple dumb "data" partition with no `boot` flag,
`mdadm` warns us but that's fine in this case.

    cat /proc/mdstat
    Personalities : [raid1]
    md0 : active raid1 sdd1[1]
          976759672 blocks super 1.2 [2/1] [_U]

    unused devices: <none>

Before we can actually use the RAID, we need to format it. I've chosen XFS here
but you may want something else depending of your needs.

    sudo mkfs.xfs -L data /dev/md0
    [...]

Now, you need to create a new file to store your RAID configuration. Otherwise,
your OS will not know about it after reboot.
`man 5 mdadm.conf` should tell you its name but it's usually `/etc/mdadm.conf`
on Fedora/CentOs/Redhat and `/etc/mdadm/mdadm.conf` on Debian/Ubuntu.

    sudo mdadm --examine --scan | sudo tee /etc/mdadm.conf
    ARRAY /dev/md/0 metadata=1.2 UUID=77b7054a:b48639d1:23b28664:597f5075 name=hostname:0

Now, we need to create a mount point for our RAID partition:

    sudo mkdir /data

And add the appropriate line into `/etc/fstab` (bare in mind to adapt it for
your setup!):

    sudoedit /etc/fstab

<br>

    tail -1 /etc/fstab
    /dev/md0      /data     xfs    defaults,nosuid,nodev    1 2

Mount it:

    sudo mount -a

All right, just double check everything is fine before going any further. You
should have something along these lines:

    mount | grep md0
    /dev/md0 on /data type xfs (rw,nosuid,nodev,relatime,seclabel,attr2,noquota)

<br>

    cat /proc/mdstat
    Personalities : [raid1]
    md0 : active raid1 sdd1[1]
          976759672 blocks super 1.2 [2/1] [_U]

    unused devices: <none>

<br>

    ls -lA /data
    total 0

<br>

    df -h /data
    Filesystem      Size  Used Avail Use% Mounted on
    /dev/md0        932G   33M  932G   1% /data

Now, we need a temporary mount point to copy data from `sde` to our freshly
formatted RAID:

    mkdir /tmp/data

Although we've changed the partition type of `sde1` to RAID, we can still mount
it as a regular file system.

    sudo mount /dev/sde1 /tmp/data

Don't forget this step. That is. __DO NOT FORGET THIS STEP!__
I wasted one whole weekend recovering my data because I RTFM'd too fast and
forgot this step. Sigh...

    sudo rsync -av --progress /tmp/data/ /data/

Depending of how big is your disk, it's going to take a while so you can monitor
it in another terminal:

    watch -d df -h /data /tmp/data # in another console

    Filesystem	Size  Used Avail Use% Mounted on
    /dev/md0        932G  5.9G  926G   1% /data
    /dev/sde1	932G  914G   18G  99% /tmp/data

Go make you a coffee...  If you have to interrupt the process half-way through,
just hit _Ctrl-C_ and you'll be able to run _rsync_ again later to finish
transferring the missing files.  _rsync_'s such a great tool! Personally, I had
to do it over two days to copy the whole 932 gigs...

<a href="https://www.flickr.com/photos/xbenek/2449405807/" title="Coffee LOL by Javier Benek, on Flickr"><img src="/images/posts/2012-03-28-how-to-set-up-a-raid-1-under-gnu-slash-linux/2449405807_1b0229da1a.jpg" width="448" height="394" alt="Coffee LOL"></a>

Finally all copied? Now you can unmount the partition.

    sudo umount /dev/sde1

We're going to add `sde1` to our RAID array, let's `cat /proc/mdstat` before:

    cat /proc/mdstat
    Personalities : [raid1]
    md0 : active raid1 sdd1[1]
          976759672 blocks super 1.2 [2/1] [_U]

    unused devices: <none>

As soon as you enter the following command, your RAID should switch to recovery
mode and start mirroring files to `sde1`:

    sudo mdadm --add /dev/md0 /dev/sde1

You can monitor it with `/proc/mdstat`. Once again, it can take ages (although
it should be slightly faster than the `rsync` step above). And once again, you
can reboot during the process as you wish, the recovery will resume
automagically until it reaches 100%.

    watch -d cat /proc/mdstat

    Personalities : [raid1]
    md0 : active raid1 sde1[2] sdd1[1]
          976759672 blocks super 1.2 [2/1] [_U]
          [==>..................]  recovery = 13.6% (133331328/976759672) finish=243.8min speed=57656K/sec

    unused devices: <none>

If you experience a terribly slow speed, like 1000K/sec and it says it'll take
years to complete, you can force the recovery process to be faster with:

    echo 100000 | sudo tee /proc/sys/dev/raid/speed_limit_min # 100M/sec

That way, the speed won't be throttled any more (unless your drive can write
faster than 100M/sec of course).

After a while, you should get something like this:

    cat /proc/mdstat
    Personalities : [raid1]
    md0 : active raid1 sdd1[1] sde1[2]
          976759672 blocks super 1.2 [2/2] [UU]

    unused devices: <none>

Your RAID is up and running. Enjoy!

Now, when you hard drive will eventually die: just power off, replace it with a
new one, reboot and wait for the recovery. You can simulate a disk failure with:

    sudo mdadm /dev/md0 --fail /dev/sdX1 --remove /dev/sdX1

Obviously, you can do it the hard way too by physically unplugging the drive (or
with a hammer and the like ;-)).

