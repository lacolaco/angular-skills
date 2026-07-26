# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
pnpm install
git submodule update --init                  # populates upstream/angular, which the build reads

pnpm run build:angular-update-guide          # regenerate skills/angular-update-guide/
pnpm test                                    # node:test through tsx
pnpm exec tsc --noEmit
```

Run one test file, or one test by name:

```sh
pnpm exec tsx --test tools/angular-update-guide/render.test.ts
pnpm exec tsx --test --test-name-pattern="computeMajorPairs" tools/angular-update-guide/*.test.ts
```

The `test` script globs `tools/**/*.test.ts`, which the shell expands to one directory deep. A test file placed directly in `tools/` is silently not run.

The build is deterministic. Running it twice and finding `git status` clean is the check that a change to it did not break that property.

## What is generated and what is written

`skills/<name>/` is what `npx skills add` installs. For `angular-update-guide` almost all of it is build output:

- **Generated:** every file under `skills/angular-update-guide/references/`, plus the regions of its `SKILL.md` between the `<!-- REFERENCES:START -->` and `<!-- SOURCE:START -->` marker pairs.
- **Written by hand:** the rest of `SKILL.md`, and both READMEs.

Editing generated content directly is lost on the next build. Change `tools/angular-update-guide/render.ts` instead.

## The build

`upstream/angular` is a git submodule pinned to a specific `angular/angular` commit and sparse-checked-out to `adev/src/app/features/update`. Pinning it is how the repository records which upstream revision the output was built from. If you move the pin while working, put it back.

`tools/angular-update-guide/` is a two stage pipeline with nothing written to disk between the stages:

- `main.ts` reads `recommendations.ts` and `update.component.ts` out of the submodule as text and resolves the submodule's HEAD SHA.
- `extract.ts` parses that text with the TypeScript compiler API. It never executes it and never runs a type checker: it walks the AST for the `Step` object literals and the `ApplicationComplexity` enum, resolving each `level` through the enum. Validation is deliberately brittle. An unrecognised field, a populated dead field (`angularCLI`, `pwa`), or a level outside the enum throws, so a change in upstream's shape fails the build rather than quietly dropping data.
- `render.ts` sorts each step into a `before` / `during` / `after` bucket per major pair via `classify()`, a port of upstream's `showUpdatePath()` with its level and options filter removed, then writes one XML file per pair and patches the marker regions of `SKILL.md`.

`level` is extracted and validated but never rendered. The validation is the canary described above, not dead code.

The upstream SHA lives only in `SKILL.md`, never in the reference files, so those files change only when the guide data itself changes. The daily `sync-upstream` workflow depends on that: it advances the submodule, rebuilds, and opens a pull request only when `git status --porcelain` on the references directory is non-empty. It uses `status` rather than `diff` because a newly released major produces an untracked file, which `diff` cannot see.

## Constraints on changes

- **Keep each `skills/<name>/` subtree liftable on its own.** These skills are meant to be proposable for adoption upstream, which the naming, the MIT license, and the layout all follow from. Shipped files must not depend on anything outside their own directory.
- **Do not take TypeScript 7.** `extract.ts` imports the compiler API as `import ts from 'typescript'`. In v7 the package root exports only `lib/version.cjs` and the AST surface moved to `typescript/unstable/ast`, which its own name says is not settled. Staying on the 6.x line keeps the classic API. Note that 6.x no longer pulls in `@types/*` automatically, which is why `tsconfig.json` names `node` explicitly.
- **Commit hand edits before running anything that can revert them.** Both the build and `git checkout -- <path>` destroy uncommitted work under `skills/`.
- **Verify a change to the output format against the previous output, not by eye.** Take the old files from git history, strip only the attribute you meant to change, and confirm the result matches in order. Confirm the item count (currently 378) is unchanged.

## Decisions to preserve

Each is stated with its reasoning under "Opinionated choices" in the README. Reversing one means editing the README in the same change.

- The complexity level (`Basic` / `Medium` / `Advanced`) is not emitted. It exists to limit how much is put in front of a human at once, which does not apply to an agent reading the whole file, and keeping it would only supply grounds for dropping items.
- Option conditions (`material` / `ngUpgrade` / `windows`) stay on the items rather than being pre-filtered. Which apply is decided by reading the target project.
- Updates from before v6 are out of scope, matching upstream's own boundary.
- `SKILL.md` carries what changes between two majors, never how to perform the update.

## Writing

- **No em dash (U+2014).** Use a colon, a semicolon, a comma, parentheses, or a second sentence. Hyphens are unaffected.
- **Do not document the `skills` CLI.** Where it installs files and what it writes to its lockfile belong to its own documentation.
- **Do not present one skill's properties as the repository's.** The repository is a collection of agent skills for Angular that does not replace the official `angular/skills`; anything narrower than that belongs to a skill. Per-skill content goes under `## Usage` in a heading named for the skill.
- Block quotes in the README stand in for requests a person would actually type. Keep them spoken rather than written.
- `README.ja.md` is a peer of the English one, not a translation of it. Japanese prose there uses です/ます, one sentence per line, commas rather than `・` for enumerations, and `：` between a term and its description in a list.
