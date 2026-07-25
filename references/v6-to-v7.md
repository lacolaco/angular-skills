# Angular 6 → 7

Generated from angular/angular @ 28d59e8d6357b6f5015657f06ecd7b543f00aba0

## Before the update

- **[Advanced]** Anywhere you use Renderer, now use Renderer2
  `Renderer`

- **[Basic]** If you use the legacy `HttpModule` and the `Http` service, switch to `HttpClientModule` and the `HttpClient` service. HttpClient simplifies the default ergonomics (you don't need to map to JSON anymore) and now supports typed return values and interceptors. Read more on [angular.dev](https://angular.dev/guide/http).
  `Http`

- **[Advanced]** Support for using the ngModel input property and ngModelChange event with reactive form directives has been deprecated in v6 and removed in v7.
  `ngModel on form control`

- **[Basic]** Remove deprecated RxJS 5 features using [rxjs-tslint auto update rules](https://github.com/ReactiveX/rxjs-tslint)<br/><br/>For most applications this will mean running the following two commands:<br/><br/>`npx rxjs-tslint`<br/>`rxjs-5-to-6-migrate -p src/tsconfig.app.json`
  `update to RxJS 6`

- **[Medium]** Once you and all of your dependencies have updated to RxJS 6, remove `rxjs-compat`.
  `remove rxjs-compat`

## During the update

- **[Basic]** Angular now uses TypeScript 3.1, read more about [any potential breaking changes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-1.html).
  `TypeScript 3.1`

- **[Basic]** Angular has now added support for [Node 10](https://nodejs.org/en/blog/release/v10.0.0/).
  `Node 10`

- **[Basic] [non-Windows only]** Update to v7 of the core framework and CLI by running `NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@7 update @angular/cli@7 @angular/core@7` in your terminal.
  `v7 update`

- **[Basic] [Windows only]** Update to v7 of the core framework and CLI by running `cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@7 update @angular/cli@7 @angular/core@7"` in your terminal.
  `v7 update`

- **[Basic] [Angular Material only] [non-Windows only]** Update Angular Material to v7 by running `NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@7 update @angular/material@7` in your terminal. You should test your application for sizing and layout changes.
  `v7 material update`

- **[Basic] [Angular Material only] [Windows only]** Update Angular Material to v7 by running `cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@7 update @angular/material@7"` in your terminal. You should test your application for sizing and layout changes.
  `v7 material update`

- **[Medium] [Angular Material only]** If you use screenshot tests, you'll need to regenerate your screenshot golden files as many minor visual tweaks have landed.
  `v7 material changes`

## After the update

- **[Medium]** If you use the Angular Service worker, migrate any `versionedFiles` to the `files` array. The behavior is the same.
  `use files instead of versionedFiles`

- **[Advanced] [Angular Material only]** Stop using `matRippleSpeedFactor` and `baseSpeedFactor` for ripples, using Animation config instead.
  `v7 material deprecations`
