PROJECT := voyance-main

.PHONY: dev build test check ship clean

dev:
	npm run dev

build:
	npm run build

test:
	npm test

check:
	npx tsc --noEmit
	npx eslint .

ship: check test build
	@echo "$(PROJECT) built successfully"

clean:
	rm -rf dist/ .next/ node_modules/.cache/
