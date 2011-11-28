
0.4.0 / 2011-11-28 
==================

  * Merge branch 'feature/commonjs'
  * build using common js prefix/suffix
  * prefix checks for require function
  * build checks for changed prefix/suffix
  * var cleanup
  * no var self used in ioUnbind (model/collection)
  * build using prefix/suffix - testing ready
  * prefix/suffix in build tool
  * commonjs prefix/suffix
  * doc cleanup

0.3.1 / 2011-11-14 
==================

  * Merge branch 'feature/pull-3' (thanks @dodo)
  * build pull 3
  * update example
  * get socket from backbone objects as well so they all can have their own socket
  * Expanded comments in the example app.
  * readme updates
  * no comments model needed in example
  * server side socket.io comments for example app
  * Readme tweak.

0.3.0 / 2011-11-02 
==================

  * small readme changes … no runon sentences.
  * seed locked at 0.0.10 for now
  * example style tweaks - no extra lines
  * jake tool has serve option
  * readme typos
  * major readme update
  * Merge branch 'feature/example'
  * ignore c9 stuffs
  * cleanup
  * tasks can be completed :)
  * style changes, use buttons, not checkmarks
  * animated remove
  * template changes
  * cleaner styles for example
  * app supports add and delete
  * dev deeps for example app
  * git ignore
  * starting sample express app

0.2.4 / 2011-11-01 
==================

  * Merge branch 'bug/namespace'
  * include email in header notices
  * backbone#sync - if leading slash in url, ignore when getting as namespace. Closes #2
  * readme tweaks
  * readme updates for build cycle
  * renamed codex to folio in build cycle

0.2.3 / 2011-10-04 
==================

  * build at v 0.2.3
  * jakefile codex 0.0.4 compat
  * detects if io not passed, uses window.socket or Backbone.socket instead.
  * comment updates for new docs

0.2.2 / 2011-10-01 
==================

  * readme updates on how to build
  * rebuilt as 0.2.2 using new build tool
  * Jakefile build tool
  * removed version def from copyright.js
  * removed makefile
  * added package.json for node compilers

0.2.1 / 2011-10-01 
==================

  * Updated documentation comments

0.2.0 / 2011-10-01 
==================

  * Changelog init
  * makefile support for iosync
  * Merge branch 'feature/sync'
  * Added Backbone.sync replacement for socket.io
  * patch for events compact, version tick
  * compact is returned