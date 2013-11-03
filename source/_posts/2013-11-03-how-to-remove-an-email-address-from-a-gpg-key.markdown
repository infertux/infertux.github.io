---
layout: post
title: "How to remove an email address from a GPG key"
date: 2013-11-03 12:15
categories:
- GPG
- PGP
---

This is a quick _howto_ to explain how to remove one of the identities of your GPG key.
This is particularly useful if this email address is longer yours for some reason.

Unless you've never published your key to a public server (unlikely!), you can't _delete_ an email address from your GPG key, but you can _revoke_ it.

Here are the few steps you'll need to take:

1. Edit your key with `gpg --edit-key <KEY_ID>`
1. Select the sub-key to revoke with `uid <ID>`
1. Revoke it with `revuid`
1. Save your changes with `save`
1. Publish your updated key with `gpg --send-keys <KEY_ID>`

You can also have a look at the example output below to see what is looks like:

    $ gpg --edit-key 01234567
    pub  2048R/01234567  created: 2010-01-01  expires: 2015-01-01  usage: SCA
                         trust: ultimate      validity: ultimate
    sub  2048R/FEDCBA98  created: 2010-01-01  expires: 2015-01-01  usage: E
    [ultimate] (1). John Doe <john@doe.tld>
    [ultimate] (2)  John Doe (Corp) <john.doe@corp.tld>

    gpg> uid 2

    pub  2048R/01234567  created: 2010-01-01  expires: 2015-01-01  usage: SCA
                         trust: ultimate      validity: ultimate
    sub  2048R/FEDCBA98  created: 2010-01-01  expires: 2015-01-01  usage: E
    [ultimate] (1). John Doe <john@doe.tld>
    [ultimate] (2)* John Doe (Corp) <john.doe@corp.tld>

    gpg> revuid
    Really revoke this user ID? (y/N) y
    Please select the reason for the revocation:
      0 = No reason specified
      4 = User ID is no longer valid
      Q = Cancel
    (Probably you want to select 4 here)
    Your decision? 4
    Enter an optional description; end it with an empty line:
    >
    Reason for revocation: User ID is no longer valid
    (No description given)
    Is this okay? (y/N) y

    You need a passphrase to unlock the secret key for
    user: "John Doe <john@doe.tld>"
    2048-bit RSA key, ID 01234567, created 2010-01-01


    pub  2048R/01234567  created: 2010-01-01  expires: 2015-01-01  usage: SCA
                         trust: ultimate      validity: ultimate
    sub  2048R/FEDCBA98  created: 2010-01-01  expires: 2015-01-01  usage: E
    [ultimate] (1). John Doe <john@doe.tld>
    [ revoked] (2)  John Doe (Corp) <john.doe@corp.tld>

    gpg> save

    $ gpg --send-keys 01234567
    gpg: sending key 01234567 to hkp server keys.gnupg.net

    $ gpg --list-keys 01234567
    pub   2048R/01234567 2010-01-01 [expires: 2015-01-01]
    uid                  John Doe <john@doe.tld>
    sub   2048R/FEDCBA98 2010-01-01 [expires: 2015-01-01]

