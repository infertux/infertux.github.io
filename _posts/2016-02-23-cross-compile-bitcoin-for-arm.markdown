---
layout: post
title: "Cross-compile Bitcoin for ARM"
date: 2016-02-23 23:21:39 +0000
categories:
- bitcoin
- ARM
- g++
- crosstool-ng
---

## Introduction

So you want to cross-compile Bitcoin (or any C/C++ program in fact) from your x86_64 host machine for an ARM "target" machine.

This little howto aims to help you with that.
It's intended for intermediate level, i.e. you should be familiar with the `./configure` and `make` commands but you don't need to have earlier  experience with cross-compilation.

The first step is to identify what's called the [target triplet](https://wiki.osdev.org/Target_Triplet).
An easy way to do so is to run `gcc -dumpmachine` on the target machine.
If you don't have `gcc` installed, you can install it to run that command then uninstall it right away.

In my case, I have:

```bash
$ gcc -dumpmachine
arm-linux-gnueabihf
```

You'll have to replace _arm-linux-gnueabihf_ with whatever you get for the rest of this howto.

## Install a cross-compiler for our target platform

If you're running Arch Linux, there might be an [AUR](https://aur.archlinux.org/) package for you.
If you're not running Arch or you want to use a more generic method, you can skip to the next paragraph which explains how to use crosstool-ng.

### On Arch Linux using AUR

```bash
$ yaourt -S arm-linux-gnueabihf-gcc # pulls all dependencies, compiles for several hours on a quad-core...

$ yaourt -Q | grep arm-linux
local/arm-linux-gnueabihf-binutils 2.25.1-3
local/arm-linux-gnueabihf-gcc 5.3.0-2
local/arm-linux-gnueabihf-glibc 2.22-3
local/arm-linux-gnueabihf-linux-api-headers 4.1.4-1

$ arm-linux-gnueabihf-g++ -v # should be working and in the $PATH
```

### On any distro using crosstool-ng

First, you need to [install crosstool-ng](https://crosstool-ng.org/#download_and_usage), the executable is named `ct-ng` and should be available to a non-root user.

Then we check if `ct-ng` knows our target architecture:

```bash
$ ct-ng list-samples | grep arm-linux-gnueabihf
```

If you can't find an exact match, just run `ct-ng list-samples` and pick the closest one, like _arm-unknown-linux-gnueabi_ or maybe _armv7-rpi2-linux-gnueabihf_.
To select it, simply run:

```bash
$ ct-ng arm-unknown-linux-gnueabi
```

Now we need to build the actual toolchain.
This will take a long while as it downloads a copy of the Linux kernel, binutils, gcc, etc. then builds gcc itself, etc.
That will require a few gigs of disk space and burn your CPU for a while...

If you're in a rush, you can skip building some of the tools such as gdb, etc.
You can do that with `ct-ng menuconfig` then unselect what you don't need.

```bash
$ ct-ng build
```

When it's finally done, you should have a new directory named _~/x-tools/_:

```bash
$ ls ~/x-tools/arm-unknown-linux-gnueabi/bin
arm-unknown-linux-gnueabi-addr2line  arm-unknown-linux-gnueabi-ct-ng.config  arm-unknown-linux-gnueabi-gcc-nm      arm-unknown-linux-gnueabi-ld.gold   arm-unknown-linux-gnueabi-size
arm-unknown-linux-gnueabi-ar         arm-unknown-linux-gnueabi-dwp           arm-unknown-linux-gnueabi-gcc-ranlib  arm-unknown-linux-gnueabi-nm        arm-unknown-linux-gnueabi-strings
arm-unknown-linux-gnueabi-as         arm-unknown-linux-gnueabi-elfedit       arm-unknown-linux-gnueabi-gcov        arm-unknown-linux-gnueabi-objcopy   arm-unknown-linux-gnueabi-strip
arm-unknown-linux-gnueabi-c++        arm-unknown-linux-gnueabi-g++           arm-unknown-linux-gnueabi-gprof       arm-unknown-linux-gnueabi-objdump
arm-unknown-linux-gnueabi-cc         arm-unknown-linux-gnueabi-gcc           arm-unknown-linux-gnueabi-ld          arm-unknown-linux-gnueabi-populate
arm-unknown-linux-gnueabi-c++filt    arm-unknown-linux-gnueabi-gcc-4.9.4     arm-unknown-linux-gnueabi-ld.bfd      arm-unknown-linux-gnueabi-ranlib
arm-unknown-linux-gnueabi-cpp        arm-unknown-linux-gnueabi-gcc-ar        arm-unknown-linux-gnueabi-ldd         arm-unknown-linux-gnueabi-readelf
```

Add the _bin_ sub-directory to your `$PATH` with `export PATH=~/x-tools/arm-unknown-linux-gnueabi/bin:$PATH`

```bash
$ export CXX=arm-unknown-linux-gnueabi-cpp
$ $CXX -v
arm-unknown-linux-gnueabi-gcc (crosstool-NG crosstool-ng-1.22.0) 5.2.0
```

Great! We now have a working cross-compiler.

## Compiling Bitcoin

We're on the home stretch!
Getting a cross-compiler to work was probably harder than compiling Bitcoin itself.
Let's start by fetching the source code and checking out the latest tagged release (_v0.12.0_ at the time of this writing):

```bash
$ git clone https://github.com/bitcoin/bitcoin
$ cd bitcoin
$ git checkout v0.12.0
$ cd depends
$ less README.md # the following is inspired from this README
```

Now we need to pull all the dependencies to compile Bitcoin.
I don't need a GUI -- `NO_QT=1` -- nor wallet support nor UPNP but adapt the next line to your needs:

```bash
$ make HOST=arm-linux-gnueabihf NO_QT=1 NO_WALLET=1 NO_UPNP=1 -j4
```

This will also take a while since it downloads a bunch of dependencies including the fat libboost.
When it's done let's go back to the root directory and generate the `configure` file:

```bash
$ cd ..
$ ./autogen.sh
```

Once again, I pass in a few flags to `./configure` but you can adapt them to your needs.
Run `./configure --help` for more details about the flags.

```bash
$ ./configure --prefix=`pwd`/depends/arm-linux-gnueabihf --with-gui=no --disable-wallet --without-miniupnpc --disable-zmq --enable-reduce-exports
$ make -j4 # takes about 5 minutes
```

Awesome! Let's check out our freshly compiled binaries and strip them to save some size.

```bash
$ find src -maxdepth 1 -type f -executable
src/bitcoind
src/bitcoin-cli
src/bitcoin-tx

$ find src -maxdepth 1 -type f -executable -exec arm-linux-gnueabihf-strip {} \;

$ find src -maxdepth 1 -type f -executable -exec ls -lh {} \;
-rwxr-xr-x 1 infertux infertux 4.8M Feb 24 22:27 src/bitcoind
-rwxr-xr-x 1 infertux infertux 1.6M Feb 24 22:27 src/bitcoin-cli
-rwxr-xr-x 1 infertux infertux 2.0M Feb 24 22:27 src/bitcoin-tx

$ find src -maxdepth 1 -type f -executable -exec file {} \; | grep -Eo "^([^,]+,){6}"
src/bitcoind: ELF 32-bit LSB shared object, ARM, EABI5 version 1 (GNU/Linux), dynamically linked, interpreter /lib/ld-linux-armhf.so.3, for GNU/Linux 2.6.32,
src/bitcoin-cli: ELF 32-bit LSB shared object, ARM, EABI5 version 1 (GNU/Linux), dynamically linked, interpreter /lib/ld-linux-armhf.so.3, for GNU/Linux 2.6.32,
src/bitcoin-tx: ELF 32-bit LSB shared object, ARM, EABI5 version 1 (GNU/Linux), dynamically linked, interpreter /lib/ld-linux-armhf.so.3, for GNU/Linux 2.6.32,
```

The last step is to copy these three files to your ARM machine then run `./bitcoind --help` to make sure it works.

Enjoy!

## Troubleshooting

### Wrong libstdc++ version

After copying my binary to the target machine and running it, I get a message like __version `GLIBCXX_3.4.21' not found (required by ./bitcoind)__.

```bash
$ ./bitcoind --help
./bitcoind: /usr/lib/arm-linux-gnueabihf/libstdc++.so.6: version `GLIBCXX_3.4.21' not found (required by ./bitcoind)

$ strings /usr/lib/arm-linux-gnueabihf/libstdc++.so.6 | grep GLIBCXX
GLIBCXX_3.4
GLIBCXX_3.4.1
GLIBCXX_3.4.2
GLIBCXX_3.4.3
GLIBCXX_3.4.4
GLIBCXX_3.4.5
GLIBCXX_3.4.6
GLIBCXX_3.4.7
GLIBCXX_3.4.8
GLIBCXX_3.4.9
GLIBCXX_3.4.10
GLIBCXX_3.4.11
GLIBCXX_3.4.12
GLIBCXX_3.4.13
GLIBCXX_3.4.14
GLIBCXX_3.4.15
GLIBCXX_3.4.16
GLIBCXX_3.4.17
GLIBCXX_3.4.18
GLIBCXX_3.4.19
GLIBCXX_3.4.20

$ ls -l /usr/lib/arm-linux-gnueabihf/libstdc++.so.6 # on target machine (Debian)
lrwxrwxrwx 1 root root     19 Dec 27  2014 /usr/lib/arm-linux-gnueabihf/libstdc++.so.6 -> libstdc++.so.6.0.20

$ ls -l /usr/arm-linux-gnueabihf/lib/libstdc++.so.6 # on host machine (Arch)
lrwxrwxrwx 1 root root 19 Feb 24 21:00 /usr/arm-linux-gnueabihf/lib/libstdc++.so.6 -> libstdc++.so.6.0.21

$ # Dammit, our host machine was using a newer version of libstdc++ than our target machine...
$ # Let's copy the old version to our host machine and recompile Bitcoin with that lib...

$ scp target:/usr/lib/arm-linux-gnueabihf/libstdc++.so.6 /tmp/lib/
$ ./configure ... LDFLAGS=-L/tmp/lib
configure: error: No working boost sleep implementation found.

$ # Using libstdc++.so.6.0.20 seems to be breaking boost sleep implementation for some reason... :/
$ # Let's try something else by copying the newer lib to the target and set LD_LIBRARY_PATH instead

$ scp /usr/arm-linux-gnueabihf/lib/libstdc++.so.6.0.21 target:~/libstdc++.so.6
$ LD_LIBRARY_PATH=. ./bitcoind --version
Bitcoin Core Daemon version v0.12.0

$ # Success!
```
