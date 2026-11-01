<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# cat-hermione-client

Client-only Next.js 16 app (App Router, `src/`). No tests, no backend code in this repo.

## Commands

- `npm run dev` — dev server on http://localhost:3000 (Turbopack)
- `npm run build` — production build (Turbopack; flags experimental config issues)
- `npm run lint` — ESLint flat config (`eslint.config.mjs`), no args needed
- `npx tsc --noEmit` — typecheck (not part of any npm script)
- Verify changes with `npx tsc --noEmit` + `npm run lint` before finishing. There is no test suite.

## Next.js config quirks (`next.config.ts`)

- `cacheComponents: true` — dynamic/async data must be wrapped in `<Suspense>` or cached with `use cache`; runtime errors otherwise. The `runtime` route segment export is unsupported.
- `reactCompiler: true` — don't add `useMemo`/`useCallback`/`React.memo` for memoization; the compiler handles it.
- Everything builds through Turbopack, including CSS (Tailwind v4 is wired via `turbopack.rules`, not PostCSS).

## shadcn / styling

- shadcn style `base-nova` (see `components.json`): primitives come from **`@base-ui/react`, not Radix** — don't add Radix packages or Radix-style props (`onOpenChange`, ...). Prop names differ; check an existing component in `src/components/ui/` before writing custom code.
- Add new UI components with the shadcn CLI (`npx shadcn add <name>`) instead of hand-writing them.
- Components import `cn` from the standalone `cn` package (also re-exported by `src/lib/utils.ts`); follow the existing `import { cn } from "cn"` pattern.
- Tailwind v4: no `tailwind.config` file — theme tokens live in `src/app/globals.css`.

## Conventions

- Path alias `@/*` → `src/*`.
- No API routes or data fetching yet; layout/pages currently use mock/static content.
