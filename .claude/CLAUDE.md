# CLAUDE.md

Instructions for working on `lacolaco/angular-skills`. Only what is specific to this repository; general working norms live elsewhere.

Package manager is pnpm. Node.js v22 or newer.

## What this repository is, and what constrains it

A public repository distributing agent skills for Angular. It does not replace the official `angular/skills`; it covers ground those skills leave open.

**Keep each `skills/<name>/` subtree liftable on its own.** There is an intention to propose these for adoption upstream, and the naming, the MIT license, and the directory layout all follow from that. The moment a skill's shipped files depend on anything outside `skills/<name>/`, it can no longer be moved.

## Do not hand-edit generated files

These are output of the build under `tools/angular-update-guide/`, and a rebuild discards anything written by hand:

- all of `skills/angular-update-guide/references/*.xml`
- the regions of `skills/angular-update-guide/SKILL.md` between the `<!-- REFERENCES:START -->` and `<!-- SOURCE:START -->` markers

The rest of SKILL.md is authored prose and is meant to be edited directly. To change the shape of the output, change `tools/angular-update-guide/render.ts` and rebuild.

```sh
git submodule update --init              # first time only
pnpm install
pnpm run build:angular-update-guide
```

## Definition of done

All of these pass before a change is finished:

```sh
pnpm exec tsc --noEmit
pnpm test
pnpm run build:angular-update-guide      # deterministic if git status is clean afterwards
```

If the shape of the generated output changed, add a comparison against the previous version. Take the old files out of git history, strip only the attribute you meant to change, and confirm the result matches the new files in order, not just as a set. Confirm the item count (currently 378) is unchanged. **Reading the diff by eye does not count.**

## Traps this repository sets

- **Commit an edit before running anything that can revert it.** `git checkout -- <path>` and the build both destroy uncommitted hand edits. This has already cost work twice.
- **Restore the submodule pin after touching `upstream/angular`.** Rebuilding while the pin has moved mixes unrelated upstream churn into the output.
- **A new file does not appear in `git diff`.** That is why the sync workflow gates on `git status --porcelain`. When changing that gate, exercise the cases it exists for: upstream SHA moved but data did not, and a new reference file appeared. Not just the no-change case.
- **`level` is extracted but never rendered.** The validation in `extract.ts` is a canary that fails the build if upstream restructures its `ApplicationComplexity` enum. It is not dead code. Leave it.

## Decisions that should not be quietly reversed

Each is recorded with its reasoning under "Opinionated choices" in the README. Changing one means changing the README too.

- The complexity level (`Basic` / `Medium` / `Advanced`) is not emitted. It is a dial for how much to put in front of a human at once, which an agent reading the whole file does not need, and keeping it only supplies grounds for dropping items.
- Option conditions (`material` / `ngUpgrade` / `windows`) stay on the items and are not pre-filtered. Which ones apply is decided by reading the target project.
- Updates from before v6 are out of scope. Upstream draws the same boundary.
- SKILL.md carries what changes, never how to carry out the update.

## Writing

- **No em dash (U+2014).** Use a colon, a semicolon, a comma, parentheses, or a second sentence. Hyphens are unaffected; compounds like `major-to-major` are fine.
- **Do not document the `skills` CLI itself.** Where it puts files and what it writes to its lockfile belong to its own documentation.
- **Do not state one skill's properties as the repository's.** Per-skill content goes under `## Usage`, in a heading named after the skill (`### <name> : short description`).
- Block quotes in the README stand in for requests a person would actually type. Keep them spoken, not written.
- README.ja.md follows the `tech-writing` skill's norms for Japanese prose. It is not a translation of the English one, and should not read like one.

## Where the reasoning is recorded

Design decisions, their rationale, and the options that were rejected live in Linear. Do not copy them here.

- Decision map: [LACO-232](https://linear.app/lacolaco/issue/LACO-232)
- Implementation tree: [LACO-243](https://linear.app/lacolaco/issue/LACO-243)

The resolving comment on each issue holds the decision and why. If a question comes up that the map does not cover, raise it there rather than settling it alone.
