# angular-skills

[Claude Code](https://claude.com/claude-code) skills carrying Angular reference data. The reference material is generated from [angular/angular](https://github.com/angular/angular) sources, so an agent can read it directly instead of browsing the docs site.

**Unofficial.** This repository is not affiliated with, endorsed by, or supported by Google or the Angular team.

## Skills

| Skill | Scope |
|---|---|
| `angular-update-guide` | Breaking changes and migration items for every Angular major-to-major step from v6 to v22, generated from the [Angular Update Guide](https://angular.dev/update-guide) data. Reference data only — it does not describe how to run the update. |

## Install

This repository is consumed via [`skills`](https://www.npmjs.com/package/skills) (the open agent-skill installer by Vercel Labs):

```sh
# In your project (writes to ./.claude/skills/)
npx skills add lacolaco/angular-skills

# Or globally for your user (writes to ~/.claude/skills/)
npx skills add lacolaco/angular-skills -g

# Only this skill
npx skills add lacolaco/angular-skills -s angular-update-guide
```

`skills` records the install in `skills-lock.json`. Commit that lockfile so reproducible installs work for collaborators.

## Requirements

- Nothing at the install site. The skills are plain Markdown with no runtime dependency.
- To regenerate the reference data in this repository: Node.js v22 or newer and `pnpm` (`pnpm install`, then `pnpm run extract:github && pnpm run render`).

## Opinionated choices

- **Updates from versions older than v6 are out of scope.** Upstream draws the same boundary — the Update Guide hands anything below v6 to `renderPreV6Instructions()` instead of the recommendation list.
- **No pre-filtering by level or options.** Upstream's UI lets a human pick a complexity level and toggle Angular Material / ngUpgrade / Windows. The generated files keep every item, because an agent can read the target project's `package.json`, source, and platform and decide what applies more accurately than a filter set in advance.
- **Not published to npm; no tags, no CHANGELOG.** `npx skills add` resolves the default branch HEAD, so the branch itself is the release channel. Versioning the package would add a second source of truth that no consumer reads.

## License

[MIT](./LICENSE) © Suguru Inatomi

The generated reference content derives from [angular/angular](https://github.com/angular/angular), also MIT licensed.
