---
layout: post
title: "SELinux cheat sheet"
date: 2015-04-29 17:36:22 +0000
categories:
- SELinux
- security
- howto
- cheat sheet
- sysadmin
---

SELinux is quite powerful but I never remember how to create a new module off the top of my head so here's a cheat sheet for it.

First you might want to use `audit2allow` to help you getting started:

```bash
cat /var/log/audit/audit.log | audit2allow -m mymodulelocal > mymodulelocal.te
vim mymodulelocal.te
```

When you're happy with the rules in your `.te` file, it's time to compile it:

```bash
checkmodule -M -m -o mymodulelocal.mod mymodulelocal.te
semodule_package -m mymodulelocal.mod -o mymodulelocal.pp
```

And finally you can reload your `.pp` policy file:

```bash
semodule -r mymodulelocal && semodule -i mymodulelocal.pp
```

