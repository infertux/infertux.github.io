---
layout: post
title:  "How to install encrypted Linux with systemd-boot and Btrfs subvolumes"
date:   2023-05-05 13:37:00 +0000
categories: Linux systemd-boot Btrfs ArchLinux
---

I recently reinstalled my system and struggled to find the right configuration to use [systemd-boot](https://wiki.archlinux.org/title/Systemd-boot) with [Btrfs](https://en.wikipedia.org/wiki/Btrfs) as a root subvolume so here it is in case it helps someone.

```bash
# /boot/loader/loader.conf
default @saved
editor yes
timeout 3
```

```bash
# /boot/loader/entries/arch.conf
title   Arch Linux
linux   vmlinuz-linux
initrd  initramfs-linux.img
options rd.luks.name=<UUID>=root root=/dev/mapper/root rootflags=subvol=@
```

Replace `<UUID>` with the UUID of the physical disk partition.
The `rootflags=subvol=@` part is important and should not contain any slashes, i.e. `rootflags=subvol=/@` won't work. Don't ask me how much time I wasted on that...
