---
layout: post
title: "File descriptor inheritance with Ruby"
date: 2013-03-04 01:02
categories:
- Ruby
- fork
- file descriptor
---

While working on [one of my pet projects of the moment](https://github.com/infertux/bashcov), I struggled a bit to use file descriptors in a sub-process.
I blindly assumed they would be inherited by child processes, which is not the case.

Here's an example:

```ruby
$ cat fd.rb
file = File.open 'file', 'w+'
fd = file.fileno
cmd = "date >&#{fd}"
pid = Process.spawn cmd
Process.wait pid
file.rewind
p file.read
```

```bash
$ ruby fd.rb
sh: 5: Bad file descriptor
""
```

The solution is to redirect the file descriptor opened in the parent process to the child process in `Process.spawn` options:

```ruby
pid = Process.spawn cmd, {fd => fd}
```

```bash
$ ruby fd.rb
"Mon Mar 04 01:02:04 CET 2013\n"
```

Hopefully this will save some time for others :).

