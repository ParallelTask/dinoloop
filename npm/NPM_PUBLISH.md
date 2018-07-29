# Publishing to NPM

### Steps to publish the package to NPM

1. Comment *express* imports and Uncomment *local* imports in `src/modules/types/express.ts`
2. Build the application `/src` to `/dist`, **npm run build**.
3. Copy *.npmignore*, *package.json* and *README.md* files from `/npm` to `/dist`.
4. Ensure package.json versioning matches with npm publishing version.
5. Login to your npm account, **npm login**.
6. After login, **npm publish**.
7. After publishing to npm registry, create git tag having the npm version say `vx.x.x` on `master:@latest` commit.
(*You can do it from git prompt or visual studio*).
8. Push the tag (*git push origin tag_name*) to github repo.

That's it!
