---
layout: post
title: "How to install a vanilla Debian on a Kimsufi"
date: 2012-11-05 11:05
categories:
- Xen
- OVH
- Kimsufi
- debootstrap
- sysadmin
---

A few weeks back, I installed a vanilla Debian Wheezy on an [OVH](https://en.wikipedia.org/wiki/OVH)'s [Kimsufi](https://www.kimsufi.com/).
OVH is a large web hosting company that provides dedicated servers called Kimsufis.
This explains how to proceed using debootstrap and then setting up Xen for virtualization.

## Thoughts

These are some preliminary examinations, you can jump straight to the _(Re)install_ part to get your hands dirty.

### Installation strategy

There are some ways I've thought to install Debian Wheezy on a Kimsufi:

- via the [manager](https://www.ovh.com/manager/) ("Wheezy ALPHA" being available now):
  I'm not sure if we can make our very own custom partitioning keeping some existing data.
  Moreover, your distro will be tainted with OVH's stuff like [RTM](https://help.ovh.com/RealTimeMonitoring) and their SSH keys.
  &rarr; _Nah_.

- via qemu:
  the plan would be to download the latest Wheezy ISO and boot it on qemu with VNC enabled.
  But this would install Debian over emulated hardware which is no good.
  &rarr; _Messy_.

- via rescue mode:
  OVH provides what they call a "rescue mode" which boots on a live CD giving you access to your server hard drive.
  So the plan is to `debootstrap` to `/dev/sda`, set up minimal functioning network and _sshd_ then reboot on the real system.
  &rarr; _Sounds good to me :)_.

### Custom kernel

Why and why not using a custom kernel.

- why
    - Does Debian's stock kernel support OVH hardware? Probably. Is it optimized for their hardware? Unlikely.
    - Debian's kernel includes a _lots_ of exotic hardware support -- both as `m` (module) or `y` (included)
    - [OVH's kernel](https://ftp.ovh.net/made-in-ovh/bzImage/3.2-config-xxxx-std-ipv6-64) disables all useless stuff like Bluetooth, WiFi, touchscreen and so on
- why not
    - What about kernel updates?

OVH's kernels are static, i.e. no `modprobe`.

### Why no PV

[Paravirtualization](https://wiki.xen.org/wiki/Paravirtualization_%28PV%29) drawbacks:

- Requires Wheezy (Linux >= 3) or patched kernel -- current Lenny VMs must be upgraded.
- Sharing kernels on the dom0 is annoying.
- 2-partition scheme seems to be mandatory? Does it work with block partitions like `/dev/sdaNN`?
- HVM _full_ isolation is better since it gives total freedom to guests who want to run BSD, etc.

## (Re)install

### Backup!

If you've got existing data, backup them all before going any further -- just in case.

You can use OVH's FTP if 100 Gio is enough for you or use `rsync` to backup things locally.

### `debootstrap`

If you have running VMs ("domU" in Xen wording), don't forget to shut them gracefully with `xm shutdown <ID>`.

Then enable the "rescue mode" in the manager and reboot your server.

Once you got the prompt on the live CD, you can start the fresh install.
Here are the steps I used but YMMV :).

```bash
$ mkfs.ext3 /dev/sda1
$ mkfs.ext4 /dev/sda2

$ mount /dev/sda2 /mnt
$ mkdir /mnt/boot
$ mount /dev/sda1 /mnt/boot

$ debootstrap --verbose --arch amd64 --variant minbase --include dialog,vim,resolvconf,ifupdown,netbase,net-tools,ssh wheezy /mnt https://mir1.ovh.net/debian

$ cat > /mnt/etc/fstab <<CONF
# <file system> <mount point> <type> <options> <dump> <pass>
/dev/sda1   /boot   ext3    errors=remount-ro   0   1
/dev/sda2   /       ext4    errors=remount-ro   0   1
/dev/sda3   swap    swap    defaults            0   0
/dev/sda5   /srv    ext3    errors=remount-ro   0   1
proc        /proc   proc    defaults            0   0
sysfs       /sys    sysfs   defaults            0   0
CONF

$ cat > /mnt/etc/network/interfaces <<CONF
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

auto lo
iface lo inet loopback

auto eth0
iface eth0 inet static
  address 188.165.X.Y
  netmask 255.255.255.0
  gateway 188.165.X.254
  dns-nameservers 213.186.33.99

# FIXME: IPv6 support
CONF

$ cat > /mnt/etc/hosts <<CONF
127.0.0.1 localhost.localdomain localhost
188.165.X.Y ks123456.kimsufi.com ks123456

# The following lines are desirable for IPv6 capable hosts
::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
ff02::3 ip6-allhosts
CONF

$ echo 'ks123456' > /mnt/etc/hostname

$ cat > /mnt/etc/apt/sources.list <<CONF
deb https://mir1.ovh.net/debian wheezy main

deb https://security.debian.org/ wheezy/updates main
CONF

$ vim /mnt/etc/ssh/sshd_config # `PermitRootLogin yes` should be there

$ echo "root:super_password" | chroot /mnt chpasswd

$ mount --rbind /dev /mnt/dev

$ LANG=C chroot /mnt /bin/bash

# from inside chroot

$ mount -a

$ dpkg-reconfigure tzdata # 13 (Etc) then 33 (UTC)

$ apt-get update
$ apt-cache search linux-image
$ apt-get install linux-image

$ apt-get install grub
$ grub-install --no-floppy --recheck /dev/sda
$ update-grub
$ ls /boot/grub/grub.cfg # should be happy
```

Finally! Now disable the "rescue mode" then reboot.
If you're stuck with Grub rescue prompt (it happened to me on a test machine but not the actual Kimsufi), type in `configfile /boot/grub/grub.cfg` and reinstall Grub once booted.

## Xen

### Install the hypervisor and tools

To get Xen support, simply install those three packages (_xen-hypervisor_ provides `/boot/xen-4.1-amd64.gz`):

```bash
apt-get install xen-hypervisor xen-tools xen-utils
```

### Prioritize Xen

Prioritize the Xen kernel over native ([more info](https://wiki.debian.org/Xen_Installation_on_lenny)):

```bash
dpkg-divert --divert /etc/grub.d/08_linux_xen --rename /etc/grub.d/20_linux_xen
update-grub
```

<img style="float: right" src="/images/posts/2012-11-05-how-to-install-a-vanilla-debian-on-a-kimsufi/xen_panda.png" width="300" alt="Xen">

### Select the `xl` toolstack

Xen toolstacks, in short:

- Old toolstack: _xm_ based on _xend_
- New one: _xl_ based on _libxl_
- New bloated one: _xe_ based on _xapi_

You may want to look at this [comparison](https://wiki.xen.org/wiki/XL_vs_Xend_Feature_Comparison).

#### Why `xl` and not `xe`?

_xe_/_xapi_ seemed neat, especially the [RRD](https://wiki.xen.org/wiki/XAPI_RRDs) bit which provides nice graphs about your VMs.
But _xapi_ requires _openvswitch_.
When I tried to install it, _apt-get_ was stuck in an infinite loop because of a missing kernel module :/.
Besides, _openvswitch_ helps with things like [QoS](https://openvswitch.org/support/config-cookbooks/qos-rate-limiting/) -- _iptables_' _limit_ module already does that.

It bloats your distro because it launches at least three more daemons, needs custom kernel modules, relies on some experimental Java stuff.
All that to provide things like QoS that I either can do using _iptables_ or that I don't need.

Apparently, you can tell _xapi_ to use Linux bridging capability instead of _OVS_ but it doesn't work either for me since I'll need to use routing and not bridging to set up the network.
_ebtables_ is fine but it's not as powerful as _iptables_ to do amazing things and fine-tuning (see below).

And for the graphs, I guess it's possible to retrieve data from _xl_ and send it through _Munin_ to get some nice graphs...

> "xl is very lightweight and is a great choice for developers or users who are most comfortable with Unix like CLI tools." -- [Choice of Toolstacks](https://wiki.xen.org/wiki/Choice_of_Toolstacks)

Here we go!
One thing though: [Python support](https://wiki.xen.org/wiki/PythonInXlConfig) has been dropped from _xm_ -- annoying but not a big deal.

#### How to set the toolstack

Edit `/etc/default/xen` and set `TOOLSTACK=xl` then reboot.
_xend_ will not start any more (see `/etc/init.d/xen` for more info).

### dom0 important tweaking

#### Disable Xen ballooning & set dom0 dedicated RAM

Use `free -m` to see how much RAM you're using and set a fair amount of [dedicated memory](https://wiki.xen.org/wiki/Xen_Best_Practices#Xen_dom0_dedicated_memory_and_preventing_dom0_memory_ballooning) by adding the two lines into `/etc/default/grub`:

```bash
# Xen boot parameters for all Xen boots
GRUB_CMDLINE_XEN="dom0_mem=256M,max:256M"
```

After reboot, you may blurt out a little "dafuq" seeing this:

- `free -m` reports 176M
- `xl list 0` reports 256M

This is fine -- well, sort of -- the missing memory seems to be marked as "reserved" according to `/var/log/dmesg`.

Then disable auto ballooning in `/etc/xen/xl.conf`:

    autoballoon=0

And in `/etc/xen/xend-config.sxp`:

    (dom0-min-mem 256)
    (enable-dom0-ballooning no)

#### Disable domU save/restore

Unless you have room to save VMs states, disable it in `/etc/default/xendomains`:

    XENDOMAINS_SAVE=
    XENDOMAINS_RESTORE=false

#### Enough CPU time

Add these two lines into `/etc/rc.local` ([more info](https://wiki.xen.org/wiki/Xen_Best_Practices#Xen_credit_scheduler_domain_weights_and_making_sure_dom0_gets_enough_CPU_time_to_serve_IO_requests_.28disk.2Fnet.29)):

```bash
# Give dom0 two times more CPU time than guests
xl sched-credit -d Domain-0 -w 512
```

Xen is now all set up, you need to `update-grub` then **reboot** to apply all the changes!

### domU config

Here is a example config file to get you started with a HVM guest:

```ruby
hostname = "test"
kernel = "hvmloader"
device_model = "qemu-dm"
builder = "hvm"
boot = "c"
memory = "1024"
vcpus = "2"
disk = ["phy:/dev/sda6,xvda,w"]
pae = "1"
apic = "1"
on_poweroff = "destroy"
on_crash = "restart"
on_reboot = "restart"
```

### Network

What about VMs' networking? This will be discussed in another post -- how to set up a _routed_ network with Xen 4 using a dual-stack IPv4 and IPv6.

