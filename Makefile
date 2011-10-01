
IOSYNC = lib/copyright.js lib/sync.js
IOBIND = lib/copyright.js lib/model.js lib/collection.js

all: backbone.iosync.js backbone.iosync.min.js backbone.iobind.js backbone.iobind.min.js

backbone.iosync.js: $(IOSYNC)
	cat $^ > $@

backbone.iosync.min.js: backbone.iosync.js
	uglifyjs --no-mangle $< > $@

backbone.iobind.js: $(IOBIND)
	cat $^ > $@

backbone.iobind.min.js: backbone.iobind.js
	uglifyjs --no-mangle $< > $@