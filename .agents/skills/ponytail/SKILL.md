---
name: ponytail
description: Think like the laziest senior engineer. Prevents AI over-engineering by enforcing a strict priority ladder before writing code (YAGNI, reuse, stdlib, native features, one-liners, minimal code).
---

# Ponytail — The Anti-Over-Engineering Coding Skill

> "Think like the laziest senior developer in the room."

## Purpose
AI coding agents frequently overcomplicate solutions by introducing unnecessary abstractions, extra libraries, excessive state machines, or bloated boilerplate. `ponytail` forces the agent to climb down an anti-over-engineering priority ladder before generating any code.

## The 7-Step Priority Ladder

Whenever you are asked to solve a problem, build a feature, or fix a bug, evaluate these 7 steps in order:

1. **YAGNI (You Ain't Gonna Need It)**:
   - Does this code, configuration, or abstraction actually need to exist right now?
   - If not, do NOT write it. Do not solve hypothetical future problems.

2. **Reuse Existing Code**:
   - Check if an identical or near-identical function, component, or utility already exists in the codebase.
   - Reuse and compose before creating anything new.

3. **Standard Library**:
   - Can this be solved natively with the runtime's standard library (e.g. `URL`, `Intl`, `crypto.randomUUID()`, `fetch`, `Array.prototype` methods, Python `pathlib`/`itertools`) without third-party packages?

4. **Native Platform Features**:
   - Can modern HTML5/CSS3 handle this instead of JavaScript? (e.g., `<dialog>`, CSS grid/flexbox, `accent-color`, `aspect-ratio`, HTML form validation).

5. **Existing Dependencies**:
   - Check `package.json` / `requirements.txt`. Does an already-installed library solve this in 2 lines?
   - Do NOT install new dependencies if an existing one can do the job.

6. **One-Liner / Simple Expression**:
   - Can this logic be expressed cleanly in a single readable line or a simple pure function?

7. **Minimum Viable Code**:
   - If you must write new code, write the absolute minimum lines required to fulfill the specification and pass tests. Zero dead code, zero speculative parameters.

## Expected Output
- Terse, maintainable, readable code with zero unnecessary abstractions.
- Dramatically reduced token consumption and faster build times.
