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

The files under `references/` are generated from `adev/src/app/features/update/recommendations.ts` in [angular/angular](https://github.com/angular/angular) (MIT), commit <!-- SOURCE:START -->`5ad823139758b4d3a8a021d378b008c3457f8689`<!-- SOURCE:END -->. The authoritative interactive version is [angular.dev/update-guide](https://angular.dev/update-guide).

## How to use

1. Read `@angular/core` in the project's `package.json` to determine the current major version.
2. Determine which conditions the project meets, so that conditional items can be resolved without asking: `@angular/material` in its dependencies, `@angular/upgrade` for ngUpgrade, and whether the host platform is Windows.
3. Plan **one major at a time**. Upstream: "You can't run `ng update` to update Angular applications more than one major version at a time." Going from v16 to v19 is three separate steps, each with its own reference file.
4. For each step, read `references/v{N}-to-v{N+1}.xml` and decide what applies. Items carrying no condition attribute apply to every project. Beyond that, **keep an item unless you can say why it is 100% irrelevant to this project.** A condition the project does not meet is such a reason. `level` is never one, and neither is a change looking too small to matter. Where the call is not clear-cut, keep the item and present it as one that may apply. Report a dropped item only if asked for the full list.

Each file is an `<update-guide>` document; each item is a `<step>` element. Its `phase` attribute (`before` / `during` / `after`) says when it applies, in that document order. Its `id` attribute is upstream's identifier for it — use it when referring to a specific item.

```xml
<update-guide from="21.0" to="22.0">
  <unreleased-warning>
    Plans for releases after the current major release are not finalized and may change. ...
  </unreleased-warning>

  <step id="22.0.0_ng_update" level="Basic" phase="during">
    In the application's project directory, run `ng update @angular/core@22 @angular/cli@22` ...
  </step>

  <step id="update @angular/material" level="Basic" phase="during" material="true">
    Run `ng update @angular/material@22`.
  </step>

  <step id="v8 update" level="Basic" phase="during" windows="false">
    Update Angular Material to version 8 by running `NG_DISABLE_VERSION_CHECK=1 npx ...` in your terminal.
  </step>
</update-guide>
```

A step's text is upstream's own wording, carried over verbatim; it may contain Markdown and occasionally escaped HTML. Conditions stack, so a step can carry more than one — `material="true" windows="true"` applies only to an Angular Material project on Windows. `<unreleased-warning>` appears only in the file for a major that upstream has not shipped yet.

## Attributes

`level` is upstream's vocabulary. It is **a dial for how much detail to show, not a measure of how hard the work is**:

- `Basic` — "Shows information for all Angular developers."
- `Medium` — "Shows information that's of interest to more advanced Angular developers."
- `Advanced` — "Shows all the information we have about this update."

So `level="Basic"` means *everyone needs to see this*, not *this is easy*. A `Basic` item can be a large migration, and an `Advanced` item can be a one-line change that happens to affect few projects. Because the level says nothing about whether an item applies to a given project, it is never grounds for dropping one: a `Medium` or `Advanced` item whose relevance is uncertain stays in, listed as a change that may affect the project.

`ngUpgrade`, `material`, and `windows` mark items that apply only under a condition; they're absent otherwise. `windows` is the exception where the negative case is also written out: `windows="true"` applies only on Windows, `windows="false"` applies only on platforms other than Windows (the same instruction often appears twice, once per value, with different shell syntax).

**These files are not pre-filtered.** Every item is present at every level and for every option; deciding what applies is the job of steps 2 and 4, resolved against the project itself rather than an assumption about which items matter.

## Available references

<!-- REFERENCES:START -->
- `references/v6-to-v7.xml`
- `references/v7-to-v8.xml`
- `references/v8-to-v9.xml`
- `references/v9-to-v10.xml`
- `references/v10-to-v11.xml`
- `references/v11-to-v12.xml`
- `references/v12-to-v13.xml`
- `references/v13-to-v14.xml`
- `references/v14-to-v15.xml`
- `references/v15-to-v16.xml`
- `references/v16-to-v17.xml`
- `references/v17-to-v18.xml`
- `references/v18-to-v19.xml`
- `references/v19-to-v20.xml`
- `references/v20-to-v21.xml`
- `references/v21-to-v22.xml`
<!-- REFERENCES:END -->

Updates from versions older than v6 are out of scope.
