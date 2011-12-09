---
  title: Example App
  weight: 50
  render-file: false
---

## Overview

*Done.* is a task application that keeps itself synchronized across all browser instances.
This app was built to demonstrate the basic usage of Backbone.ioBind and ioSync. The code is
intended to be  easy to follow and is heavily commented.

![Done. An Example App](http://f.cl.ly/items/3d2l1D1W34311s2O3p1Q/backbone-iobind-example.png)

## Installation

To start off, you are going to need to clone the repo.

    $ git clone https://github.com/logicalparadox/backbone.iobind.git

Before you can run anything you need to install the dev dependancies, such as Express, Seed, and Socket.io.

    $ cd backbone.iobind
    $ npm install

Optionally, you should install the build tool, should you want to make changes to backbone.iobind or backbone.sync for socket.io. The tool used is `jake` and it should be installed in the global npm space.

    $ [sudo] npm -g install jake

If you installed jake, then simply run the following command to start up the example app.

    $ jake serve

*Note: `jake -T` shows you a list of all available commands.*

If you did not install jake, then start up the example app using node.

    $ node example/app.js
