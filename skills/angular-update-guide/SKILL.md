---
name: angular-update-guide
description: |
  Reference data for Angular major-version updates: the breaking changes and migration items for every major-to-major step from v6 to v22, generated from the official Angular Update Guide. Use when raising an Angular major version, when `ng update` crosses a major boundary, or when investigating what breaks between two Angular majors.

  This is data, not a procedure. It supplies *what* changes between two Angular majors, not *how* to carry out the update — pair it with whatever update procedure you already follow. A question that is only about the procedure does not need this skill.

  Do NOT use for non-Angular dependency updates, for minor/patch bumps, or for source edits that don't change the Angular version.

  Unofficial. Not affiliated with or endorsed by Google or the Angular team.
---

# Angular Update Guide reference

**Unofficial.** This skill is not affiliated with, endorsed by, or supported by Google or the Angular team.

The files under `references/` are generated from `adev/src/app/features/update/recommendations.ts` in [angular/angular](https://github.com/angular/angular) (MIT), commit <!-- SOURCE:START -->`28d59e8d6357b6f5015657f06ecd7b543f00aba0`<!-- SOURCE:END -->. The authoritative interactive version is [angular.dev/update-guide](https://angular.dev/update-guide).

## How to use

1. Read `@angular/core` in the project's `package.json` to determine the current major version.
2. Plan **one major at a time**. Upstream: "You can't run `ng update` to update Angular applications more than one major version at a time." Going from v16 to v19 is three separate steps, each with its own reference file.
3. For each step, read `references/v{N}-to-v{N+1}.md`.

Each file groups its items into **Before the update** / **During the update** / **After the update**, in that order. The backticked string under each item is upstream's identifier for it — use it when referring to a specific item.

## Tags

Every item begins with a level tag, optionally followed by option tags.

`[Basic]` / `[Medium]` / `[Advanced]` are upstream's vocabulary. They are **a dial for how much detail to show, not a measure of how hard the work is**:

- `[Basic]` — "Shows information for all Angular developers."
- `[Medium]` — "Shows information that's of interest to more advanced Angular developers."
- `[Advanced]` — "Shows all the information we have about this update."

So `[Basic]` means *everyone needs to see this*, not *this is easy*. A `[Basic]` item can be a large migration, and an `[Advanced]` item can be a one-line change that happens to affect few projects.

Option tags mark items that apply only under a condition:

- `[Angular Material only]` — only if the project uses Angular Material.
- `[ngUpgrade only]` — only if the project uses ngUpgrade.
- `[Windows only]` — only on Windows.
- `[non-Windows only]` — only on platforms other than Windows. Mutually exclusive with `[Windows only]`; the same instruction often appears twice with different shell syntax.

**These files are not pre-filtered.** Every item is present at every level and for every option. Decide what applies by inspecting the actual project — its `package.json`, its source, the host platform — rather than by trusting an assumption about which items matter.

## Available references

<!-- REFERENCES:START -->
- `references/v6-to-v7.md`
- `references/v7-to-v8.md`
- `references/v8-to-v9.md`
- `references/v9-to-v10.md`
- `references/v10-to-v11.md`
- `references/v11-to-v12.md`
- `references/v12-to-v13.md`
- `references/v13-to-v14.md`
- `references/v14-to-v15.md`
- `references/v15-to-v16.md`
- `references/v16-to-v17.md`
- `references/v17-to-v18.md`
- `references/v18-to-v19.md`
- `references/v19-to-v20.md`
- `references/v20-to-v21.md`
- `references/v21-to-v22.md`
<!-- REFERENCES:END -->

Updates from versions older than v6 are out of scope.
