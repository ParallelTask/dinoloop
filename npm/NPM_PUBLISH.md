# Publishing to NPM

### Steps to publish the package to NPM

1. Comment *express* imports and UnComment *locals* imports in `src/modules/types/express.ts`
2. Build the application `/src` to `/dist`, **npm run build**.
3. Copy *.npmignore*, *package.json* and *README.md* files from `/npm` to `/dist`.
4. Ensure package.json versioning matches with npm publishing version.
5. Login to your npm account, **npm login**.
6. After login, **npm publish**.

That's it!
