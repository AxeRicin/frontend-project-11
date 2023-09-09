install:
	npm ci

lint:
	npx eslint .

wpServer:
	npm run serve

wpBuild:
	npm run build

wpBuildDev:
	npm run build:dev