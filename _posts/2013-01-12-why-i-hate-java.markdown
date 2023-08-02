---
layout: post
title: "Why I hate Java"
date: 2013-01-12 22:46
categories:
- programming
- Java
- rant
- troll
---

Today at school, I had to present a demo of a basic sort of game simulator -- sounds great right?
Well, not so much. The programming language had to be Java.

I try to avoid this language as much as I can but unfortunately schools think Java is the only language out there to teach OOP.

So I thought it would be a good occasion to rant&circ;Wexplain why I hate Java.

## Takes 10 <abbr title="Line Of Code">LOC</abbr> when other languages require just one

Java is verbose in the sense that you need to write a bunch of lines of code to achieve very basic things.

This is especially true with Swing and even the language syntax is redundant, like this line:

```java
HashMap<String, Thing> allTheThings = new HashMap<String, Thing>();
```

Here's an issue I ran into: there is no way to pick a random item from a collection in Java.

In Java example from Stack Overflow:

```java
int size = myHashSet.size();
int item = new Random().nextInt(size);
int i = 0;
for(Object obj : myhashSet)
{
    if (i == item)
        return obj;
    i = i + 1;
}
```

In [Ruby](https://ruby-doc.org/core-1.9.3/Array.html#method-i-sample):

```ruby
my_collection.sample
```

## Can't code without a bloated IDE like Eclipse or Netbeans

To mitigate the abovementioned point, IDEs help you typing all those pointless redundant lines of code thanks to "Generate getters/setters", CTRL+Space and that kind of features.

But those IDEs have serious drawbacks:

- Want to use them on small Eee PC 10" screens? You get a 200x150 px box left for your code, very handy...
- Want to launch them in less than ten seconds? No way.
- Want to type efficiently using a Vim-like behaviour editor? You can't.
- Want to perform a simple text search through all your codebase? You can't, really?!

I spent two minutes looking for this feature in Eclipse with no luck.
Either it's seriously well hidden or simply missing!
I ended up using `ack`...

## Everything is broken and nobody cares

The are _heaps_ of flawed design decisions which have been made in the Java API.
But it's all right, no need to fix it.
Let's just stick with this shitty design for backward compatibility...

### Observer

Want to use the Observer pattern for your Swing UI?
Well, be aware that your class to observe can't be inherited since [Observable](https://docs.oracle.com/javase/6/docs/api/java/util/Observable.html) is a class and not an interface!
And Java does not have multiple inheritance to help you here (though I don't advocate multiple inheritance).

### InternalFrameInternalFrameTitlePaneInternalFrameTitlePaneMaximizeButtonPainter

No, this is not a crazy typo, look at the [doc](https://javadoc.bugaco.com/com/sun/java/swing/plaf/nimbus/InternalFrameInternalFrameTitlePaneInternalFrameTitlePaneMaximizeButtonPainter.html).

Seriously, how would you get it right the first time?
Oh wait, CTRL+Space, we meet again.

There is a whole [thread](https://news.ycombinator.com/item?id=4770861) on it by the way.

### Cloning an object

`object.clone()` just doesn't work as it should and is strongly deprecated.

### Date/time and calendar

Working with dates and time is messy and [SimpleDateFormatter](https://docs.oracle.com/javase/6/docs/api/java/text/SimpleDateFormat.html) is convinced weeks start on Sunday and you can't change it.
But hey, it's called "simple" for a reason I guess.


### No heredoc

You end up using [StringBuilder](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/StringBuilder.html) when you could avoid it.

## Obscure errors

I just added a new static field in a class, compiled, run again and it all blew up in my face:

    A fatal error has been detected by the Java Runtime Environment:

     SIGSEGV (0xb) at pc=0x0000000000000000, pid=24019, tid=140302240622336

    JRE version: 7.0_09
    Java VM: OpenJDK 64-Bit Server VM (23.2-b09 mixed mode linux-amd64 compressed oops)
    Problematic frame:
    C  0x0000000000000000

    Failed to write core dump. Core dumps have been disabled. To enable core dumping, try "ulimit -c unlimited" before starting Java again

    An error report file with more information is saved as:
    /home/infertux/workspace/project/hs_err_pid24019.log

    If you would like to submit a bug report, please include
    instructions on how to reproduce the bug and visit:
      https://icedtea.classpath.org/bugzilla

What a lovely segfault!
Why???

## *Not* portable

![XKCD 801](/images/posts/2013-01-12-why-i-hate-java/golden_hammer.png)

Java is supposed to be portable thanks to the great JVM.

This is a lie:

- If your system (OS or architecture) doesn't have a JVM, nothing runs ; which happens quite often with embedded hardware.
- If your JRE is too old, it won't work either.
- It's not really portable anymore once your app gets complex.

Not to mention encoding issues on user inputs from switching between Linux and Mac (and probably Windows I suppose).

## User interface

### Ugly

Applications in Java don't use your system's UI but this ugly Java interface that makes you feel like running on Windows 95.

### Painful to code

Have you ever tried to make a decent UI with Swing?
Then you should know what I'm talking about.

## Security

Last but not least (I left this one for the end since it's an obvious one).

Just today, I saw
[so](https://thenextweb.com/apps/2013/01/11/following-active-exploits-mozilla-adds-all-recent-versions-of-java-to-its-firefox-add-on-blocklist/)
[many](https://www.nbcnews.com/technology/technolog/us-warns-java-software-security-concerns-escalate-1B7938755)
[posts](https://9to5mac.com/2013/01/11/apple-blocks-java-7-mac-plugin-in-os-x-following-discovered-security-vulnerability/)
on Hacker News about recent critical exploits found in Java.
Worst thing about it: Oracle doesn't seem to care at all and no upcoming patches are announced...

## Anything else?

Yeah sure, plenty of them.
Those above are just the ones on the top of my head that I had to deal with for this tiny MVC project.

Here's a [few](https://www.jwz.org/doc/java.html) [links](https://duckduckgo.com/?q=java+sucks).

That's why I think Java is one of the worst programming languages ever and I avoid it like the plague.
I wonder if there is polyglot programmers (who have tried other languages) who actually still _enjoy_ to code in Java.

