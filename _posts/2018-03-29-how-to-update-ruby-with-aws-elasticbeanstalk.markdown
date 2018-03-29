---
layout: post
title:  "How to update Ruby with AWS ElasticBeanstalk"
date:   2018-03-29 09:44:00 +0000
categories: Ruby AWS update
---

The AWS web interface for [ElasticBeanstalk](https://aws.amazon.com/elasticbeanstalk/) doesn't let you update Ruby.
Thankfully there is a way to do it via the command line using the [`aws` utility](https://aws.amazon.com/cli/).

First, we need to identify the so-called "solution stack name" we want to use:

```bash
$ aws --profile foo elasticbeanstalk list-available-solution-stacks | grep -E "SolutionStackName.+ Ruby 2\.5"
            "SolutionStackName": "64bit Amazon Linux 2017.09 v2.7.1 running Ruby 2.5 (Puma)",
            "SolutionStackName": "64bit Amazon Linux 2017.09 v2.7.1 running Ruby 2.5 (Passenger Standalone)",
```

Then we need to retrieve the environment name:

```bash
aws --profile foo elasticbeanstalk describe-environments | grep "EnvironmentName"
            "EnvironmentName": "foobar-rails",
```

Finally, we can update the environment:

```bash
aws --profile foo elasticbeanstalk update-environment --solution-stack-name "64bit Amazon Linux 2017.09 v2.7.1 running Ruby 2.5 (Puma)" --environment-name foobar-rails
```

Done!

It will take a few minutes to redeploy your app.
I like to monitor it using `eb health --refresh`.
