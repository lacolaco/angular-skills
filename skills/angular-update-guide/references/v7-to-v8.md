# Angular 7 → 8

Generated from angular/angular @ 28d59e8d6357b6f5015657f06ecd7b543f00aba0

## Before the update

- **[Advanced]** Anywhere you use Renderer, now use Renderer2
  `Renderer`

- **[Basic]** If you use the legacy `HttpModule` and the `Http` service, switch to `HttpClientModule` and the `HttpClient` service. HttpClient simplifies the default ergonomics (you don't need to map to JSON anymore) and now supports typed return values and interceptors. Read more on [angular.dev](https://angular.dev/guide/http).
  `Http`

- **[Medium]** Once you and all of your dependencies have updated to RxJS 6, remove `rxjs-compat`.
  `remove rxjs-compat`

- **[Medium]** If you use the Angular Service worker, migrate any `versionedFiles` to the `files` array. The behavior is the same.
  `use files instead of versionedFiles`

- **[Advanced] [Angular Material only]** Stop using `matRippleSpeedFactor` and `baseSpeedFactor` for ripples, using Animation config instead.
  `v7 material deprecations`

## During the update

- **[Basic] [non-Windows only]** Update to version 8 of the core framework and CLI by running `NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@8 update @angular/cli@8 @angular/core@8` in your terminal and review and commit the changes.
  `v8 update`

- **[Basic] [Windows only]** Update to version 8 of the core framework and CLI by running `cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@8 update @angular/cli@8 @angular/core@8"` in your terminal and review and commit the changes.
  `v8 update`

- **[Basic]** Replace `/deep/` with `::ng-deep` in your styles, [read more about angular component styles and ::ng-deep](https://angular.io/guide/component-styles#deprecated-deep--and-ng-deep). `/deep/` and `::ng-deep` both are deprecated but using `::ng-deep` is preferred until the shadow-piercing descendant combinator is [removed from browsers and tools](https://chromestatus.com/feature/5045542597951488) completely.
  `use ::ng-deep instead of /deep/`

- **[Basic]** Angular now uses TypeScript 3.4, [read more about errors that might arise from improved type checking](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html).
  `TypeScript 3.4`

- **[Basic]** Make sure you are using [Node 10 or later](https://www.hostingadvice.com/how-to/update-node-js-latest-version/).
  `node 10`

- **[Basic]** The CLI's build command now automatically creates a modern ES2015 build with minimal polyfills and a compatible ES5 build for older browsers, and loads the appropriate file based on the browser.  You may opt-out of this change by setting your `target` back to `es5` in your `tsconfig.json`. Learn more on [angular.io](https://angular.io/guide/deployment#differential-loading).
  `Differential Loading`

- **[Basic]** When using new versions of the CLI, you will be asked if you want to opt-in to share your CLI usage data. You can also add your own Google Analytics account. This lets us make better decisions about which CLI features to prioritize, and measure the impact of our improvements. Learn more on [angular.io](https://angular.io/analytics).
  `CLI Telemetry`

- **[Basic]** If you use `ViewChild` or `ContentChild`, we're updating the way we resolve these queries to give developers more control. You must now specify that change detection should run before results are set. Example: `@ContentChild('foo', {static: false}) foo !: ElementRef;`. `ng update` will update your queries automatically, but it will err on the side of making your queries `static` for compatibility. Learn more on [angular.io](https://angular.io/guide/static-query-migration).
  `static query timing`

- **[Basic] [Angular Material only] [non-Windows only]** Update Angular Material to version 8 by running `NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@8 update @angular/material@8` in your terminal.
  `v8 material update`

- **[Basic] [Angular Material only] [Windows only]** Update Angular Material to version 8 by running `cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@8 update @angular/material@8"` in your terminal.
  `v8 material update`

- **[Advanced]** We have switched from the native Sass compiler to the JavaScript compiler. To switch back to the native version, install it as a devDependency: `npm install node-sass --save-dev`.
  `node-sass`

- **[Advanced]** If you are building your own Schematics, they have previously been *potentially* asynchronous. As of 8.0, all schematics will be asynchronous.
  `schematics async`

## After the update

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
