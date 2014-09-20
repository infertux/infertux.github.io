---
layout: post
title: "Fast Bitcoin blockchain synchronization"
date: 2014-09-20 12:59:34 +0000
categories:
- bitcoin
- blockchain
- rsync
- mirror
- server
- download
---

I got tired of waiting hours or even days to perform the initial Bitcoin blockchain synchronization.
Indeed, every time you install [Bitcoin Core](https://bitcoin.org/en/download) on a new machine, you have to download [over 25GB](https://blockchain.info/charts/blocks-size) via P2P.
To make it worse, it rarely uses all your available bandwidth to avoid putting too much pressure on the Bitcoin network.
This is particularly annoying when you want to set up new [full nodes](https://getaddr.bitnodes.io/) quickly.

To avoid this issue, you can use this [bootstrap.dat](https://bitcointalk.org/index.php?topic=145386.0) torrent file to speed things up.
But it isn't ideal since the file isn't updated often so there are enough seeders to make it valuable.
This means you'll still have to download a good chunk of the blockchain through P2P.

That's why I'm offering a [Rsync](https://rsync.samba.org/) server as an alternative. Here's how it works:

1. Download [Bitcoin Core](https://bitcoin.org/en/download)
1. You can now run either the QT wallet (`bitcoin-qt`) or the CLI version (`bitcoind`).
   Run it for the first time so it creates all the directories in `~/.bitcoin` with the right permissions.
1. Stop it - either close Bitcoin QT or run `./bitcoind stop`.
1. Synchronize the blockchain with `rsync -avh --progress rsync://bitcoin.infertux.com/bitcoin-blocks-x86_64/ ~/.bitcoin/blocks/`
   This will download the blockchain using all your bandwidth and you can obviously stop and resume the process at any moment.
1. Once the download is complete, start Bitcoin Core again and you should have very little data to download before being fully in sync.

The nice thing is that you don't have to trust me about the data since Bitcoin will automatically reindex and verify the blocks on startup.

Note that the blockchain files are [*not* platform-independent](https://github.com/bitcoin/bitcoin/issues/2293).
This means using this mirror will work only for x86_64 machines.
I'm planning to add an ARM mirror soon - please [let me know](mailto:hi@infertux.com) if this is something you're interested in.

Hope that helps you set up more full nodes out there! :)

