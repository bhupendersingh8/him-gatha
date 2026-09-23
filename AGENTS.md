# AGENTS.md — HIM GATHA Repository Guidelines

## Project Overview
HIM GATHA is an offline-first digital cultural archive dedicated to preserving the living folk heritage, deities, traditions, and sacred architecture of Himachal Pradesh.

## Agent Skills Configuration
- **Issue Tracker**: [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md) (Local markdown tickets in `.scratch/tickets/`)
- **Triage**: [docs/agents/triage.md](docs/agents/triage.md)
- **Domain Docs**: [docs/agents/domain-docs.md](docs/agents/domain-docs.md)
- **Domain Modeling**: [CONTEXT.md](CONTEXT.md) and [docs/adr/](docs/adr/)

## Core Architectural Guardrails
1. **Offline-First Resilience**: All 222 deity records are statically bundled in `src/data/deities.json`. The site must remain fully operational without network connectivity or Firebase credentials.
2. **Cultural Integrity**: Protect the Himalayan design tokens (warm stone `#FAF6F0`, crimson `#8E2800`, deodar timber, brass gold `#D4AF37`) against generic SaaS homogenization.
3. **Strict Validation**: All external links must pass WHATWG `new URL()` validation with `http:`/`https:`. Community submissions must enforce 5MB file limits and image MIME restrictions.
4. **Lean Bundle**: Do not install heavy 3D or redundant animation dependencies into the production web bundle.

## Verification Commands
- `npm test`: Runs pure unit tests in Node native test runner (`tests/deityEngine.test.js`).
- `npm run lint`: Verifies ESLint 9 rules with 0 errors and 0 warnings.
- `npm run build`: Executes production bundling with Vite.
- `npm audit`: Scans for dependency vulnerabilities.
