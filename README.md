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
# In your project
npx skills add lacolaco/angular-skills

# Or globally for your user
npx skills add lacolaco/angular-skills -g

# Only this skill
npx skills add lacolaco/angular-skills -s angular-update-guide
```

Skills land in `.agents/skills/`, with `.claude/skills/` symlinked to them so Claude Code picks them up. `skills` records the install in `skills-lock.json` next to them; commit that lockfile so collaborators resolve the same content.

## Requirements

- Nothing at the install site. The skills are plain Markdown with no runtime dependency.
- To work on this repository: Node.js v22 or newer and `pnpm`.

## Repository layout

```
skills/angular-update-guide/   what `npx skills add` installs — SKILL.md and references/
tools/                         extraction and rendering
data/                          intermediate JSON, committed so upstream diffs are readable
evals/                         skillgrade harness — not distributed
```

`tools/` reads the Update Guide sources out of angular/angular and writes both `data/recommendations.json` and the reference files. A daily workflow reruns it and opens a pull request when upstream has moved; rendering is deterministic, so a diff means the source changed.

```sh
pnpm install
pnpm run extract:github   # fetch upstream at a pinned commit and rebuild the intermediate JSON
pnpm run render           # rewrite references/ and the generated regions of SKILL.md
pnpm test
```

## Evaluating the skill

`evals/` holds a [skillgrade](https://github.com/mgechev/skillgrade) harness that checks whether an agent handed this skill produces the right answer. Each task pins a fixture project to one Angular major and asks for the breaking changes of the single step to the next one. Two things are graded: whether every item of that step is present, and whether items of the *adjacent* steps leaked in. The second is the point — an agent that reads all sixteen reference files would satisfy the first check on its own, so the leak check is what verifies the one-step-one-file shape.

```sh
cd evals
skillgrade --eval=v8-to-v9 --trials=1   # single trial, for checking the harness
skillgrade --ci                         # 3 tasks × 15 trials
```

Requires the Claude Code CLI on the host — the harness shells out to `claude -p`, which uses its local credentials. There is no API key to set, but a full run makes 45 agent calls.

The harness lives outside `skills/` deliberately. `npx skills add` copies a skill directory whole, so anything kept next to `SKILL.md` ships to every consumer. It also keeps the measurement honest: skillgrade copies the eval directory into the workspace root, so a harness living inside the skill would put `references/` there too and let the agent read it without going through skill discovery — the very thing under test.

Run it after editing `SKILL.md`. It is not wired into CI: the generated data changes daily, but the parts of the skill that decide behaviour do not.

## Opinionated choices

- **Updates from versions older than v6 are out of scope.** Upstream draws the same boundary — the Update Guide hands anything below v6 to `renderPreV6Instructions()` instead of the recommendation list.
- **No pre-filtering by level or options.** Upstream's UI lets a human pick a complexity level and toggle Angular Material / ngUpgrade / Windows. The generated files keep every item, because an agent can read the target project's `package.json`, source, and platform and decide what applies more accurately than a filter set in advance.
- **Not published to npm; no tags, no CHANGELOG.** `npx skills add` resolves the default branch HEAD, so the branch itself is the release channel. Versioning the package would add a second source of truth that no consumer reads.

## License

[MIT](./LICENSE) © Suguru Inatomi

The generated reference content derives from [angular/angular](https://github.com/angular/angular), also MIT licensed.
