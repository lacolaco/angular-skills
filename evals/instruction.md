This project is being prepared for its next Angular major version.

1. Read `package.json` to determine which Angular major version the project is on today.
2. Write `BREAKING.md` listing every breaking change and migration item involved in raising it by **one** major version.

`BREAKING.md` is read by a checker, so it must follow these rules:

- Cover exactly one major step. Items belonging to any other major step must not appear.
- Write one bullet per item.
- End each bullet with that item's upstream identifier, verbatim, as an inline code span — for example `20.0.0-example-identifier`.
- Do not put identifiers inside fenced code blocks.
- List every item, including ones that are conditional or that look irrelevant to this project.

Do not install packages, run `ng update`, or edit any other file.
