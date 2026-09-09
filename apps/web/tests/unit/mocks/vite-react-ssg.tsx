// vite-react-ssg is ESM-only (its package.json "exports" has no CJS entry),
// which ts-jest's CommonJS transform can't require. Real behavior (per-page
// <title>/<meta> injection into prerendered HTML) is exercised by the build
// output instead — see docs/PHASE_CHECKLIST.md Phase 7. This stub just lets
// components that import `Head` render in tests without crashing.
import type { ReactNode } from 'react'

export const Head = ({ children }: { children: ReactNode }) => <>{children}</>
