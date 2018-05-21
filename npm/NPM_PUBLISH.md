# Publishing to NPM

### How to publish the package to NPM?
Before you publish the package to NPM consider the following guidelines:

1. Build the application `/src` to `/dist`, **npm run build**.
2. Copy the .npmignore and package.json files from `/npm` to `/dist`.
3. Ensure package.json versioning matches with npm publishing version.
4. Login to your npm account, **npm login**.
5. After login, **npm publish**.

That's it!