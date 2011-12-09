
docs: clean-docs
	@./node_modules/.bin/codex build docs \
		--out docs/out
	@./node_modules/.bin/codex serve \
		--out docs/out --static /backbone.iobind

clean-docs:
	@rm -rf docs/out

.PHONY: clean-docs docs