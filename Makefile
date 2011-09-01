
SRC = lib/copyright.js lib/model.js lib/collection.js

all: backbone.iobind.js backbone.iobind.min.js

backbone.iobind.js: $(SRC)
	cat $^ > $@

backbone.iobind.min.js: backbone.iobind.js
	uglifyjs --no-mangle $< > $@