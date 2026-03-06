---
name: sveltekit-website-build
description: Builds SvelteKit pages inside src/routes with clean structure, modern CSS, media/container queries, keyframes, and maintainable JS. Use when user asks to create or refactor a page/route, and verify quality before marking work complete.
---

# SvelteKit Route Page Builder

## When To Use
Use this skill when the user asks to:
- build a new page in `src/routes`
- update/refactor an existing route page
- improve page quality, structure, styling, or responsiveness
- confirm a page is truly finished

## Required Build Standard
For every route page, the agent must make the result:
- readable in one pass
- semantic and accessible
- responsive across viewport sizes
- easy to maintain and extend
- verified before claiming done

## Route Implementation Rules
1. Create route in `src/routes/<route>/+page.svelte`.
2. If server/client load is needed, add `+page.ts` or `+page.server.ts`.
3. Keep `+page.svelte` focused on composition and page-level layout.
4. Move reusable sections to `src/lib/components/...`.
5. Use explicit, minimal props and safe null handling.

## Page Construction Order (Do In This Sequence)
1. Define intent and states
   - Identify page purpose in one sentence.
   - Cover states: loading, empty, success, error.
2. Build semantic markup
   - Prefer `main`, `section`, `article`, `header`, `nav`, `form`, `footer`.
   - Ensure heading hierarchy starts at one `h1`.
3. Add Svelte logic
   - Keep script small and clear.
   - Derive values instead of duplicating state.
   - Guard against undefined/null data.
4. Add styles
   - Mobile-first layout.
   - Use project CSS variables/tokens.
   - Keep selectors shallow and understandable.
5. Add responsiveness
   - Add viewport `@media` rules for layout changes.
   - Use container queries when component width drives behavior.
6. Add motion only where useful
   - Use subtle transitions/keyframes.
   - Add reduced-motion fallback.

## CSS Quality Rules
- Prefer maintainable class naming by role (example: `profile-card`, `details-grid`).
- Avoid deep selector chains and one-off hacks.
- Keep spacing consistent via tokens.
- Prefer `transform`/`opacity` animations over layout-thrashing properties.

## Media Query and Keyframes Rules
- Breakpoints must be minimal and intentional.
- Avoid many custom breakpoints for tiny differences.
- Name keyframes by behavior (`fade-in-up`, `slide-in`).
- Respect user preference:

```css
@media (prefers-reduced-motion: reduce) {
  .animated {
    animation: none;
    transition: none;
  }
}
```

## JavaScript / Svelte Rules
- Keep business logic out of dense inline markup expressions.
- Use clear state names (`isLoading`, `hasError`, `filteredItems`).
- Ensure forms and actions have visible feedback.
- Keep event handlers focused and readable.

## Must-Run Verification Before Finish
Agent must run and pass these checks before saying the page is complete:

```bash
npm run lint
npm run format
npm run build
```

Also verify manually:
- keyboard navigation works
- focus is visible
- responsive layout at mobile/tablet/desktop
- empty and error states render correctly

If any check fails, fix first, then re-run checks.

## Completion Gate
Do not mark task finished until all are true:
- route page created/updated in correct `src/routes/...` path
- code is clean and modular
- accessibility basics handled
- lint/format/build successful
- no known broken states remain

## Response Template (Use After Building)
```markdown
## Built Route
- Path: `src/routes/...`
- Purpose: ...

## What Was Implemented
- Structure: ...
- Styling: ...
- Responsiveness: ...
- Motion: ...
- Behavior: ...

## Verification
- `npm run lint`: pass/fail
- `npm run format`: pass/fail
- `npm run build`: pass/fail
- Manual checks: ...

## Final Status
- Ready / Not ready
- Remaining issues (if any): ...
```
