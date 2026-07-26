# angular-skills

Agent skills carrying Angular reference data. The material is generated from [angular/angular](https://github.com/angular/angular) sources, so an agent can read it directly instead of browsing the docs site.

**Unofficial.** This repository is not affiliated with, endorsed by, or supported by Google or the Angular team.

## Skills

| Skill | Scope |
|---|---|
| `angular-update-guide` | Breaking changes and migration items for every Angular major-to-major step from v6 to v22, generated from the [Angular Update Guide](https://angular.dev/update-guide) data. Reference data only — it does not describe how to run the update. |

## Install

This repository is consumed via [`skills`](https://www.npmjs.com/package/skills) (the open agent-skill installer by Vercel Labs):

```sh
# In your project
npx skills add lacolaco/angular-skills

# Or globally for your user
npx skills add lacolaco/angular-skills -g

# Only this skill
npx skills add lacolaco/angular-skills -s angular-update-guide
```

Skills land in `.agents/skills/`, and the installer links them into whichever agent-specific directories your setup uses. The install is recorded in `skills-lock.json`; commit that lockfile so collaborators resolve the same content.

Nothing here depends on the installer. Each skill is a plain directory (`SKILL.md` plus `references/`), so vendoring it by hand works just as well.

## Requirements

- Nothing at the install site. The skills are plain text files with no runtime dependency.
- To work on this repository: Node.js v22 or newer and `pnpm`.

## Repository layout

```
skills/<name>/         what `npx skills add` installs — SKILL.md and references/
tools/<name>/          the build for that skill
upstream/angular/      git submodule pinned to angular/angular, shared by Angular skills
```

Everything that belongs to one skill is scoped under its name, so a second skill can be added without disturbing the first.

`upstream/angular` is a git submodule pinned to a specific angular/angular commit — the repository declares exactly which upstream commit it was built from. It's checked out sparse (only `adev/src/app/features/update`) since angular/angular is a large monorepo; see `.gitmodules`.

A skill's build reads the Update Guide sources out of the submodule and writes its reference files, by way of an intermediate JSON under `data/` that is a build artifact and stays out of git. A daily workflow advances the submodule, regenerates, and opens a pull request only when the references actually change; rendering is deterministic, so a diff means upstream moved.

```sh
git submodule update --init                # first time only, populates upstream/angular
pnpm install
pnpm run extract:angular-update-guide      # read the submodule, rebuild the intermediate JSON
pnpm run render:angular-update-guide       # rewrite references/ and the generated regions of SKILL.md
pnpm test
```

## Opinionated choices

- **Updates from versions older than v6 are out of scope.** Upstream draws the same boundary — the Update Guide hands anything below v6 to `renderPreV6Instructions()` instead of the recommendation list.
- **No pre-filtering by level or options.** Upstream's UI lets a human pick a complexity level and toggle Angular Material / ngUpgrade / Windows. The generated files keep every item, because an agent can read the target project's `package.json`, source, and platform and decide what applies more accurately than a filter set in advance.
- **Not published to npm; no tags, no CHANGELOG.** `npx skills add` resolves the default branch HEAD, so the branch itself is the release channel. Versioning the package would add a second source of truth that no consumer reads.

## License

[MIT](./LICENSE) © Suguru Inatomi

The generated reference content derives from [angular/angular](https://github.com/angular/angular), also MIT licensed.
