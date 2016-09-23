---
layout: post
title: "An introduction to the Ruby ecosystem"
date: 2012-10-19 14:47
categories:
- Ruby
- RVM
- RubyGems
- Bundler
- Rake
- Rails
- Sinatra
- RSpec
- Capybara
- IRB
---

> If you're not having fun with Ruby, you're doing it wrong.

I've noticed that many people coming into the Ruby world tend to be lost with all the things they need to grasp like RVM, RubyGems, Bundler, Rake, RSpec, etc.
This article aims to give you a better overall understanding of the Ruby ecosystem.
This is *not* about teaching the Ruby language but rather about introducing in a pragmatic way the tools you need to know to get along with Ruby.

As you might already know, Ruby moves fast and part of this post may become slightly out-of-date in a year's time. So here is the overview as of late 2012.

Let's get started!


## The interpreter

Just a few words about Ruby interpreters to help understanding the next part.

Ruby is an interpreted language which means it needs an... interpreter.
In a nutshell, his job is to take your source code as an input and to execute it.

The three most popular are:

- [Matz's Ruby Interpreter](http://www.ruby-lang.org/en/downloads/) (MRI): the reference implementation by [Matz](http://en.wikipedia.org/wiki/Yukihiro_Matsumoto)
- [Rubinius](http://rubini.us/): a well-known fast Ruby implementation of Ruby
- [JRuby](http://www.jruby.org/): a Java [<a id="fnl-2012-10-19-1" href="#fn-2012-10-19-1">1</a>] implementation


## RVM: the Ruby Version Manager

You may wonder why you have to use yet another tool to install Ruby and not simply use the one shipped with your system.
In short, the version shipped with your system may be outdated and most importantly there is only *one* version.
When you'll start to work on a couple of Ruby projects, you will ultimately end up working on a project which uses another version sooner or later.

![RVM logo](/images/posts/2012-10-19-an-introduction-to-the-ruby-ecosystem/rvm-logo.png)

There are two ways of installing RVM: system-wide (requires root) or in your home directory (recommended on development machines).

The recommended [installation procedure](https://rvm.io/rvm/install/) is to run this:

```
$ \curl -L https://get.rvm.io | bash -s stable
```

But I'm not a big fan of running remote scripts like that so I would recommend to double-check the script you've downloaded before running it as a good practice :).

Now, you need to install at least one Ruby interpreter. We'll chose to go with MRI 1.9.3 since it's the current stable release.

```
$ rvm install 1.9.3
```

This will download, compile and install Ruby 1.9.3 so it may take a while depending of your machine.


### RVM's .rvmrc

Quite often, you will find a file named `.rvmrc` located at the root of a project.
This is a special file used by RVM.
Basically, it contains RVM commands such as `rvm use 1.9.3`.

The first time you `cd` into a directory containing a `.rvmrc` file, RVM will ask you if you trust it and want to execute it.

```
$ cd $project
==============================================================================
= NOTICE                                                                     =
==============================================================================
= RVM has encountered a new or modified .rvmrc file in the current directory =
= This is a shell script and therefore may contain any shell commands.       =
=                                                                            =
= Examine the contents of this file carefully to be sure the contents are    =
= safe before trusting it! ( Choose v[iew] below to view the contents )      =
==============================================================================
Do you wish to trust this .rvmrc file? ($project/.rvmrc)
y[es], n[o], v[iew], c[ancel]> 
```

Unless you already know what's inside, you want to view its content by typing `v` and then `y` if there's no evil stuff.

RVM will keep track of it (into `$HOME/.rvm/user/rvmrcs`).
From now on, RVM will automatically execute this `.rvmrc` to set up the right environment each time you go into this directory.


## RubyGems: third party packages

RubyGems often shortened to Gems are programs and libraries that you can integrate into your application.
There are _heaps_ of Gems available doing all kinds of things.

The reference website for those is [rubygems.org](https://rubygems.org).

If you're not familiar with the big names out there, you should go to [ruby-toolbox.com](https://www.ruby-toolbox.com/).
This website allows you to find the most used Gems in various categories.
Suppose you want to learn which Gems could help you with background jobs.
Heading to [ruby-toolbox.com/categories/Background_Jobs](https://www.ruby-toolbox.com/categories/Background_Jobs) will tell you that [Resque](https://www.ruby-toolbox.com/categories/Background_Jobs#resque) seems to be a good pick.

This [video](http://railscasts.com/episodes/384-exploring-rubygems?autoplay=true) gives you a good insight into choosing the right Gem for your project [<a id="fnl-2012-10-19-2" href="#fn-2012-10-19-2">2</a>].


### Managing Gems

You can install Gems using the `gem` command.

- `gem list` will list the installed Gems
- `gem list rails -r` will list the available remote Gems starting with "rails"
- `gem install resque` will download and install the _resque_ Gem

But in fact, most projects have quite a lot of Gems required as dependencies and installing them one at a time would be really tedious -- not even to mention version constraints.
Thankfully, there is a tool to avoid the hassle: Bundler.


## Bundler: the Gems manager

![Bundler logo](/images/posts/2012-10-19-an-introduction-to-the-ruby-ecosystem/bundler-logo.png)

Bundler is a tool which maintains a consistent environment installing all the required Gems you need with your application.

It uses a file named [Gemfile](http://gembundler.com/gemfile.html) which stands in the root directory of your project.

```ruby
source :rubygems

gem "nokogiri"
gem "rails", "3.0.0.beta3"
gem "rack",  ">=1.0"
gem "thin",  "~>1.1"

gem "thor", path: "../thor"

group :test do
  gem "rspec"
end
```

This is pretty self-explanatory, you simply list the Gems you need.
For each Gem, you can specify options like version, path, group and so on.

One very interesting thing to note though is the `~>` operator.
For instance, `'~>2.2'` is equivalent to `'>=2.2.0', '<3.0'` and `'~>2.0.3'` is equivalent to `'>=2.0.3', '< 2.1'`.
It is called the "pessimistic operator" that you can read as "approximately greater than".

This is supposed to permit minor updates like security fixes but won't break your application because of a non-backward compatible API change -- which would be a major release.

You can learn more about rational versioning policy [there](http://docs.rubygems.org/read/chapter/16#page74).


### Using Bundler

Bundler is itself a Gem so you generally install it by running `gem install bundler`.

_Bundler_ is the name of the tool but the command is `bundle` without the final "r".
Here are the two commands you need to know to get started with `bundle`:

- `bundle install` (or simply `bundle`) will resolve all the dependencies, download then install all the Gems listed in the `Gemfile`
- `bundle update` will update every Gem that can be updated respecting version constraints

An automatically-generated file named `Gemfile.lock` will contain the exact Gem versions and their dependencies.
You should not edit this file by hand.


## Rake: Ruby's `make`

Basically, [Rake](http://rake.rubyforge.org/) allows you to run tasks that are defined in a file named `Rakefile`.
It is really useful to quickly call recurrent tasks used in a project.

```ruby
task :default => [:test]

task :test do
  # do what you want here
end
```

The most common use cases are:

- `rake -T` will list all available tasks
- `rake mrproper` will run the task _mrproper_
- `rake mytask[param]` -- you can also pass in arguments like that

One thing you need to bare in mind if you use [zsh](http://www.zsh.org/) is escaping brackets, i.e. `[` becomes `\[`.


## Ruby on Rails: the Ruby web framework

I'm not going to explain how to use Rails here since there are tons of very good tutorials on the web like [learning Rails the zombie way](http://railsforzombies.org/).
Rails was created by [DHH](http://david.heinemeierhansson.com/) in 2005 and helped a lot in popularizing the Ruby language since then.
The current version is Rails 3 but the eagerly awaited forth release might pop out around Christmas -- stay tuned.


## Sinatra: make a RESTful app in ten minutes

[Sinatra](http://www.sinatrarb.com/) is a DSL [<a id="fnl-2012-10-19-3" href="#fn-2012-10-19-3">3</a>] for quickly creating web applications in Ruby with minimal effort.
It is particularly useful for prototyping and making simple APIs in a breeze.

```ruby
require 'sinatra'

get '/' do
  'Hello world!'
end
```


## RSpec: the unit testing framework

Some folks would talk about [TestUnit](http://test-unit.rubyforge.org/) but I would recommend using [RSpec](http://rspec.info/) since it comes with a nice DSL, tons of helpers and makes writing tests more enjoyable.

If you're not familiar with testing your code, you should really give it a try.
It is definitely not a waste of time and will help you in many ways keeping a clean working code base on the long run.
Ruby makes it very easy to do [TDD](http://en.wikipedia.org/wiki/Test-driven_development) and [BDD](http://en.wikipedia.org/wiki/Behavior-driven_development).

```ruby
describe "User"
  describe ".top" do
    before { 3.times { Factory(:user) } }
    it { User.top(2).should have(2).item }
  end
end
```

Writing tests is easy.
But writing good _relevant_ tests in order to keep a coherent and fast test suite requires a bit of experience and to think twice before typing.
A very good resource to teach you RSpec good practices is [betterspecs.com](http://betterspecs.org/).


## Capybara: the integration testing framework

[Capybara](https://github.com/jnicklas/capybara) is an integration testing framework.
In other words, it helps you test web applications by simulating how a real user would interact with your app.

Here's what it looks like:

```ruby
describe "the signup process" do
  before :each do
    User.make(email: 'user@example.com', password: 'pass')
  end

  it "signs me in" do
    within("#session") do
      fill_in 'Login', with: 'user@example.com'
      fill_in 'Password', with: 'pass'
    end
    click_link 'Sign in'
  end
end
```

Internally, Capybara uses a headless browser -- a "driver" -- which can be [Selenium](http://seleniumhq.org/), [Webkit](https://github.com/thoughtbot/capybara-webkit), etc.

Likewise, you may hear about [Cucumber](http://cukes.info/) too [<a id="fnl-2012-10-19-4" href="#fn-2012-10-19-4">4</a>].


## IRB: Interactive RuBy

`irb` is an interactive Ruby shell.
You can use it run small snippets of code for example.

```ruby
1.9.3p286 :001 > x = 42
 => 42 
1.9.3p286 :002 > (x - 37).times { puts "Ruby is great!" }
Ruby is great!
Ruby is great!
Ruby is great!
Ruby is great!
Ruby is great!
 => 5 
1.9.3p286 :003 > x.methods
 => [:to_s, :-, :, :-, :, :, :div, :, :modulo, :divmod, :fdiv, :, :abs, :magnitude, :, :, :=>, :, :, :, :, :, :, :, :, :[], :, :, :to_f, :size, :zero?, :odd?, :even?, :succ, :integer?, :upto, :downto, :times, :next, :pred, :chr, :ord, :to_i, :to_int, :floor, :ceil, :truncate, :round, :gcd, :lcm, :gcdlcm, :numerator, :denominator, :to_r, :rationalize, :singleton_method_added, :coerce, :i, :, :eql?, :quo, :remainder, :real?, :nonzero?, :step, :to_c, :real, :imaginary, :imag, :abs2, :arg, :angle, :phase, :rectangular, :rect, :polar, :conjugate, :conj, :pretty_print_cycle, :pretty_print, :between?, :po, :poc, :pretty_print_instance_variables, :pretty_print_inspect, :nil?, :, :!, :hash, :class, :singleton_class, :clone, :dup, :initialize_dup, :initialize_clone, :taint, :tainted?, :untaint, :untrust, :untrusted?, :trust, :freeze, :frozen?, :inspect, :methods, :singleton_methods, :protected_methods, :private_methods, :public_methods, :instance_variables, :instance_variable_get, :instance_variable_set, :instance_variable_defined?, :instance_of?, :kind_of?, :is_a?, :tap, :send, :public_send, :respond_to?, :respond_to_missing?, :extend, :display, :method, :public_method, :define_singleton_method, :object_id, :to_enum, :enum_for, :pretty_inspect, :ri, :equal?, :!, :!, :instance_eval, :instance_exec, :__send__, :__id__]
1.9.3p286 :004 > quit
```

## Going further

I hope this article has given you a better understanding of the Ruby world.
I tried to present the most common tools but there are plenty of other greats things you may want to explore:

- [RVM gemsets](https://rvm.io/gemsets/basics/): compartmentalized independent per-project Ruby setups
- [rbenv](https://github.com/sstephenson/rbenv): a RVM-like
- [Github's Ruby styleguide](https://github.com/styleguide/ruby) will teach you Ruby idioms and recommended coding style
- [factory_girl](https://github.com/thoughtbot/factory_girl) allows you to build objects easily in your tests (because fixtures suck)
- [Mocking](https://www.ruby-toolbox.com/categories/mocking) helps you to speed up your specs using mocks and stubs
- [guard](https://github.com/guard/guard) handles events on file system modifications, typically to automatically run your specs when you edit a file -- helping you to get a instantaneous feedback
- [spork](https://github.com/sporkrb/spork) pre-loads Rails environment enabling you to run your tests right off
- [foreman](https://github.com/ddollar/foreman) is especially useful when you have a complex app that needs other software to run, such as Redis, a Sinatra web service, etc.
- [SimpleCov](https://github.com/colszowka/simplecov) is a sweet code coverage tool that can merge coverage across multiple test suites like RSpec and Capybara
- [Travis-CI](https://travis-ci.org/) is a marvelous hosted continuous integration service for the open source community
- [brakeman](http://brakemanscanner.org/) is a static analysis security scanner for Ruby on Rails that will help you finding potential vulnerabilities in your app
- [Ruby5](http://ruby5.envylabs.com) is a 5-min podcast released on Tuesdays and Fridays
- [Ruby Rogues](http://rubyrogues.com/) is 1-hour weekly podcast
- [pry](https://github.com/pry/pry) is IRB on steroids
- the [Benchmark](http://ruby-doc.org/stdlib-1.9.3/libdoc/benchmark/rdoc/Benchmark.html) module provides methods to measure and report the time used to execute pieces of code
- `ri` is the equivalent of `man` for Ruby -- never forget to [RTFM](https://xkcd.com/293/) :)
- Wow, this list is getting quite long...
- ???
- Profit!


## Feedback

If you wish, you can discuss and improve this at [Hacker News](https://news.ycombinator.com/item?id=4673363).


## Footnotes

[<a id="fn-2012-10-19-1" href="#fnl-2012-10-19-1">1</a>]
If you're a Java programmer, well I'm sorry for you.
You may consider stop debugging that infamous <abbr title="NullPointerException">NPE</abbr> of the day and go watch [this](http://www.youtube.com/watch?v=fDIEq92Mh6c) :).

[<a id="fn-2012-10-19-2" href="#fnl-2012-10-19-2">2</a>]
By the way, [railscasts.com](https://railscasts.com) is managed by [Ryan Bates](https://github.com/ryanb) who makes awesome screencasts about Ruby on Rails.
You should definitely check them out if you're new to Ruby.
[Update: unfortunately, railscasts.com is pretty much dead nowadays.]

[<a id="fn-2012-10-19-3" href="#fnl-2012-10-19-3">3</a>]
DSL stands for _Domain Specific Language_, which means you have a custom language dedicated to a particular domain with specific keywords.
Ruby's [metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming) ability makes it easy to build really neat DSLs.

[<a id="fn-2012-10-19-4" href="#fnl-2012-10-19-4">4</a>]
Although it sounds like a nice idea at first glance, _I_ think the trade-off of spending a lot of time implementing [step definitions](https://github.com/cucumber/cucumber/wiki/Step-Definitions) to be able to get _somewhat_ human-readable specs is not worth it.
That's why I prefer Capybara.

