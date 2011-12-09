---
  title: For Contributors
  weight: 60
  render-file: false
---

Please avoid making changes to the `dist` versions of backbone.iobind. All changes to the library are to be
made to `lib/*.js` and then packaged for the browser using the build tools.

### Building

Build tool is built in [jake](https://github.com/mde/jake).

`[sudo] npm install jake -g`

Clone this repo:

`git clone https://github.com/logicalparadox/backbone.iobind`

Install development/build dependancies (Ie: [folio](https://github.com/logicalparadox/folio)).:

`npm install`

Run jake

`jake` for detailed information, `jake build:all` to build all files.