# Angular 8 → 9

Generated from angular/angular @ 5ad823139758b4d3a8a021d378b008c3457f8689

## Before the update

- **[Advanced]** Anywhere you use Renderer, now use Renderer2
  `Renderer`

- **[Basic] [Angular Material only]** Instead of importing from `@angular/material`, you should import deeply from the specific component. E.g. `@angular/material/button`. `ng update` will do this automatically for you.
  `deep imports`

- **[Basic]** For lazy loaded modules via the router, make sure you are [using dynamic imports](https://angular.io/guide/deprecations#loadchildren-string-syntax). Importing via string is removed in v9. `ng update` should take care of this automatically. Learn more on [angular.io](https://angular.io/guide/deprecations#loadchildren-string-syntax).
  `new loadChildren`

- **[Advanced]** We are deprecating support for `@angular/platform-webworker`, as it has been incompatible with the CLI. Running Angular's rendering architecture in a web worker did not meet developer needs. You can still use web workers with Angular. Learn more in our [web worker guide](https://v9.angular.io/guide/web-worker). If you have use cases where you need this, let us know at devrel@angular.io!
  `platform deprecated`

- **[Advanced]** Support for web tracing framework in Angular was deprecated in version 8. You should stop using any of the `wtf*` APIs. To do performance tracing, we recommend using [browser performance tools](https://developers.google.com/web/tools/lighthouse/audits/user-timing).
  `wtf`

- **[Medium]** Remove any `es5BrowserSupport` flags in your `angular.json` and set your `target` to `es2015` in your `tsconfig.json`. Angular now uses your browserslist to determine if an ES5 build is needed. `ng update` will migrate you automatically.
  `es5browser`

## During the update

- **[Basic]** Make sure you are using [Node 10.13 or later](https://www.hostingadvice.com/how-to/update-node-js-latest-version/).
  `node 10.13`

- **[Basic] [non-Windows only]** Run `NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@8 update @angular/core@8 @angular/cli@8` in your workspace directory to update to the latest 8.x version of `@angular/core` and `@angular/cli` and commit these changes.
  `cli v8 latest`

- **[Basic] [Windows only]** Run `cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@8 update @angular/cli@8 @angular/core@8"` in your workspace directory to update to the latest 8.x version of `@angular/core` and `@angular/cli` and commit these changes.
  `cli v8 latest`

- **[Medium]** You can optionally pass the `--create-commits` (or `-C`) flag to [ng update](https://angular.io/cli/update) commands to create a git commit per individual migration.
  `create commits`

- **[Basic] [non-Windows only]** Run `NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@9 update @angular/core@9 @angular/cli@9` which should bring you to version 9 of Angular.
  `ng update v9`

- **[Basic] [Windows only]** Run `cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@9 update @angular/cli@9 @angular/core@9"` which should bring you to version 9 of Angular.
  `ng update v9`

- **[Basic]** Your project has now been updated to TypeScript 3.8, read more about new compiler checks and errors that might require you to fix issues in your code in the [TypeScript 3.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html) or [TypeScript 3.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html) announcements.
  `typescript 3.8`

- **[Basic] [Angular Material only] [non-Windows only]** Run `NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@9 update @angular/material@9`.
  `update @angular/material`

- **[Basic] [Angular Material only] [Windows only]** Run `cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@9 update @angular/material@9"`.
  `update @angular/material`

- **[Advanced] [non-Windows only]** If you use Angular Universal, run `NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@9 update @nguniversal/hapi-engine@9` or `NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@9 update @nguniversal/express-engine@9` depending on the engine you use. This step may require the `--force` flag if any of your third-party dependencies have not updated the Angular version of their peer dependencies.
  `update @nguniversal/hapi-engine`

- **[Advanced] [Windows only]** If you use Angular Universal, run `cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@9 update @nguniversal/hapi-engine@9"` or `cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@9 update @nguniversal/express-engine@9"` depending on the engine you use. This step may require the `--force` flag if any of your third-party dependencies have not updated the Angular version of their peer dependencies.
  `update @nguniversal/hapi-engine`

- **[Basic]** If your project depends on other Angular libraries, we recommend that you consider updating to their latest version. In some cases this update might be required in order to resolve API incompatibilities. Consult `ng update` or `npm outdated` to learn about your outdated libraries.
  `dependencies update`

- **[Basic]** During the update to version 9, your project was transformed as necessary via code migrations in order to remove any incompatible or deprecated API calls from your code base. You can now review these changes, and consult the [Updating to version 9 guide](https://v9.angular.io/guide/updating-to-version-9) to learn more about the changes.
  `ivy update`

- **[Medium]** Bound CSS styles and classes previously were applied with a "last change wins" strategy, but now follow a defined precedence. Learn more about [Styling Precedence](https://angular.io/guide/attribute-binding#styling-precedence).
  `stylesUpdate`

- **[Advanced]** If you are a library author and you had a method returning `ModuleWithProviders`  (typically via a method named `forRoot()`), you will need to specify the generic type. Learn more [angular.io](https://v9.angular.io/guide/deprecations#modulewithproviders-type-without-a-generic)
  `ModuleWithProviders`

- **[Medium]** If you use `ngForm` element selector to create Angular Forms, you should instead use `ng-form`.
  `ngForm selector`

- **[Advanced]** We have updated the `tsconfig.app.json` to limit the files compiled. If you rely on other files being included in the compilation, such as a `typings.d.ts` file, you need to manually add it to the compilation.
  `typings compilation`

- **[Advanced]** If you use Angular Universal with  `@nguniversal/express-engine` or `@nguniversal/hapi-engine`, several backup files will be created. One of them for `server.ts`. If this file defers from the default one, you may need to copy some changes from the `server.ts.bak` to `server.ts` manually.
  `express-universal-server`

## After the update

- **[Medium]** With Angular 9 Ivy is now the default rendering engine, for any compatibility problems that might arise, read the [Ivy compatibility guide](https://v9.angular.io/guide/ivy-compatibility).
  `debug`

- **[Basic]** Angular 9 introduced a global `$localize()` function that needs to be loaded if you depend on Angular's internationalization (i18n). Run `ng add @angular/localize` to add the necessary packages and code modifications. Consult the [$localize Global Import Migration guide](https://v9.angular.io/guide/migration-localize) to learn more about the changes.
  `ivy i18n`

- **[Medium]** In your application projects, you can remove `entryComponents` NgModules and any uses of `ANALYZE_FOR_ENTRY_COMPONENTS`. They are no longer required with the Ivy compiler and runtime. You may need to keep these if building a library that will be consumed by a View Engine application.
  `entryComponents`

- **[Medium]** If you use `TestBed.get`, you should instead use `TestBed.inject`. This new method has the same behavior, but is type safe.
  `testbed-get`

- **[Medium]** If you use [Angular's i18n support](https://angular.io/guide/i18n), you will need to begin using `@angular/localize`. Learn more about the [$localize Global Import Migration](https://v9.angular.io/guide/migration-localize).
  `$localize`

- **[Medium]** In version 10, classes that use Angular features and do not have an Angular decorator are no longer supported.  [Read more](https://v10.angular.io/guide/migration-undecorated-classes).  `ng update` will migrate you automatically.
  `classes-without-decorators`

- **[Medium]** As of Angular 9, enforcement of @Injectable decorators for DI is stricter and incomplete provider definitions behave differently. [Read more](https://v9.angular.io/guide/migration-injectable). `ng update` will migrate you automatically.
  `injectable-definitions`
