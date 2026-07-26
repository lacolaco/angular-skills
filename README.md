# angular-skills

[日本語](./README.ja.md)

Agent skills for working with Angular.

These do not replace the official [`angular/skills`](https://github.com/angular/skills). They cover ground the official skills leave open.

**Unofficial.** This repository is not affiliated with, endorsed by, or supported by Google or the Angular team.

## Skills

| Skill | Scope |
|---|---|
| `angular-update-guide` | Breaking changes and migration items for every Angular major-to-major step from v6 to v22, generated from the [Angular Update Guide](https://angular.dev/update-guide) data in [angular/angular](https://github.com/angular/angular) so an agent can read it directly instead of browsing the docs site. Reference data only — it does not describe how to run the update. |

## Install

```sh
# In your project
npx skills add lacolaco/angular-skills

# Or globally for your user
npx skills add lacolaco/angular-skills -g

# Only this skill
npx skills add lacolaco/angular-skills -s angular-update-guide
```

Skills land in `.agents/skills/`, and the installer links them into whichever agent-specific directories your setup uses. The install is recorded in `skills-lock.json`; commit that lockfile so collaborators resolve the same content.

Nothing here depends on the installer. Each skill is a plain directory rooted at `SKILL.md`, so vendoring it by hand works just as well.

## Asking for an upgrade

The skill carries what changes, not how to change it, so it does its work inside whatever you were already going to ask. Nothing needs to name it:

> Upgrade this project to Angular 21.

> We're on v18 and want to get to v21. Walk me through it one major at a time, and tell me what breaks at each step.

Reference data is also useful before committing to anything:

> What breaks between Angular 20 and 21 for this codebase? Don't change anything yet — I want to see the list first.

If the agent is going to run the upgrade rather than just describe it, pair this with whatever procedure you already trust for `ng update`. That part is deliberately not here.

## Requirements

- Nothing at the install site. The skills are plain text files with no runtime dependency.
- To work on this repository: Node.js v22 or newer and `pnpm`.

## Repository layout

```
skills/<name>/         what `npx skills add` installs — SKILL.md and any files beside it
tools/<name>/          the build for that skill, when it has one
upstream/angular/      git submodule pinned to angular/angular, read by builds that need upstream sources
```

Everything that belongs to one skill is scoped under its name, so a second skill can be added without disturbing the first.

`upstream/angular` is a git submodule pinned to a specific angular/angular commit — the repository declares exactly which upstream commit the generated files were built from. It's checked out sparse (only `adev/src/app/features/update`) since angular/angular is a large monorepo; see `.gitmodules`.

`angular-update-guide`'s build reads the Update Guide sources out of the submodule and writes its reference files in one pass. A daily workflow advances the submodule, rebuilds, and opens a pull request only when the references actually change; the build is deterministic, so a diff means upstream moved.

```sh
git submodule update --init              # first time only, populates upstream/angular
pnpm install
pnpm run build:angular-update-guide      # rewrite references/ and the generated regions of SKILL.md
pnpm test
```

## Opinionated choices

- **`angular-update-guide` leaves out versions older than v6.** Upstream draws the same boundary — the Update Guide hands anything below v6 to `renderPreV6Instructions()` instead of the recommendation list.
- **`angular-update-guide` drops upstream's complexity level.** `Basic` / `Medium` / `Advanced` is a dial for how many items to put in front of a human at once, and an agent reading the whole file has no such limit. Kept as an attribute, it would serve only as grounds for dropping items upstream still counts as part of the update.
- **`angular-update-guide` does not pre-filter by option.** The Angular Material, ngUpgrade, and Windows conditions stay on the items. Which ones apply is decided by reading the target project's `package.json`, source, and platform, which is more accurate than a filter set in advance.

## License

[MIT](./LICENSE) © Suguru Inatomi

The generated reference content derives from [angular/angular](https://github.com/angular/angular), also MIT licensed.
