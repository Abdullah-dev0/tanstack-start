<!-- intent-skills:start -->
## Skill Loading

Use the repository’s installed Intent. If it is unavailable, report the missing dependency instead of downloading a replacement.
Before editing files for a substantial task:
- Run `npm exec --no -- intent list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `npm exec --no -- intent load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

## Tailwind CSS

- When a utility takes a CSS variable as its value, use the Tailwind v4 shorthand `utility-(--var)`, not `utility-[var(--var)]`. Example: write `text-(--sea-ink)`, not `text-[var(--sea-ink)]`. This also applies with variants, such as `hover:bg-(--link-bg-hover)`. ([docs](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values))
- If the type is ambiguous (for example, `text-` can set a color or a font size), add a type hint: `text-(length:--my-var)` or `text-(color:--my-var)`.
- Keep square brackets for literal arbitrary values that aren't a bare variable, such as `w-[calc(100%-2rem)]` or `bg-[#bada55]`.
