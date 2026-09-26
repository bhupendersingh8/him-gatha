---
name: jev
description: Fast System One decision-making, classification, routing, and schema verification using Jev (TypeSafe AI) architecture patterns. Automatically classifies user requests, selects the minimal development skill, enforces WCAG 2.2 AA accessibility quality gates, and prevents over-engineering.
---

# Jev — Automatic Skill Router & System One Decision Architecture

## Overview
**Jev** is a high-speed "System One" decision engine. Within Antigravity, it serves as the **Automatic Skill Router**, instantly classifying user requests, evaluating task complexity, and selecting the optimal development-side skill(s) without requiring manual forms or explicit user prompting.

```
User Request
     │
     ▼
[Jev System 1 Classifier] ──> Determine Primary Task Type & Complexity Level
     │
     ▼
[Skill Match Engine]     ──> Match with Installed Development Skills
     │
     ├── UI / Frontend?        ──> Apply UI tooling + Mandatory WCAG 2.2 AA Quality Gate
     ├── Over-Engineering?    ──> Apply Ponytail (YAGNI / minimal code)
     ├── Complex Multi-File?  ──> Apply Graphify (AST symbol navigation)
     └── Major Build/Refactor? ──> Apply Addy Agent Skills (Spec → Plan → Test → Ship)
     │
     ▼
[Execution & Verification] ──> Smallest Correct Fix → npm test → npm run lint → npm run build
     │
     ▼
[Report & STOP]           ──> Report Skills Used / Considered / Missing
```

---

## 1. Automatic Task Classification

Every incoming user prompt is instantly categorized into one primary task type:

| Primary Task Type | Trigger Keywords / Intent | Primary Route |
|---|---|---|
| **UI / Frontend** | "design", "make premium", "layout", "cards", "hero", "header", "modal", "css", "theme" | UI Development + WCAG Quality Gate |
| **Accessibility** | "contrast", "keyboard nav", "focus", "aria", "screen reader", "touch target", "wcag" | WCAG 2.2 AA Rule + Minimal Code Fix |
| **Refactoring** | "clean up", "restructure", "simplify", "reduce complexity", "modularize" | Ponytail (YAGNI) or Refactor skill |
| **Multi-File Architecture** | "trace imports", "dependencies across files", "call hierarchy", "ast", "20+ files" | Graphify |
| **Major Feature Build** | "new module", "new sub-system", "end-to-end flow", "architect feature" | Addy Agent Skills (SDLC) |
| **Bug Fix** | "broken", "fix error", "crash", "undefined", "fails" | Diagnosing-bugs / Direct Fix |
| **Performance** | "slow", "bundle size", "lag", "optimize" | Performance audit / Minimal native fixes |
| **Testing / Verification** | "verify", "run tests", "audit", "lint", "check" | Native test runner / ESLint 9 |

---

## 2. Complexity Threshold & Hierarchy

We choose the **lightest workflow capable of safely completing the task**:

- **Level 1 — Simple (Direct Implementation)**:
  - Text, spacing, single CSS fix, simple component patch.
  - *Action:* Execute directly. No heavy workflow ceremonies.
- **Level 2 — Moderate (Specialized Skill)**:
  - New UI section, interactive component, responsive redesign, color adjustments.
  - *Action:* Activate relevant UI skill + WCAG 2.2 AA accessibility check.
- **Level 3 — Major (Structured Workflow)**:
  - Multi-file feature, deep refactoring, architectural shift.
  - *Action:* Activate Graphify (if symbol dependencies are intricate) or Addy Agent Skills (Spec $\to$ Plan $\to$ Test).

---

## 3. Mandatory Secondary Quality Gates

1. **Accessibility Override (WCAG 2.2 AA)**:
   - If a task modifies colors, typography, buttons, links, navigation, forms, animations, SVGs, images, responsive layouts, or themes:
   - **Automatically verify**: Contrast $\ge 4.5:1$ (Light & Dark), touch targets $\ge 24\times 24\text{px}$, visible focus rings, and valid ARIA.
   - Do not wait for a separate audit request.

2. **Ponytail Complexity Filter**:
   - Before adding any new package, component layer, or abstraction, ask: *"Can modern CSS, standard runtime utilities, or existing functions solve this?"*
   - Default to YAGNI and write the minimum viable lines of code.

3. **Graphify Rule**:
   - Activate only when analyzing relationships across $>5$ interconnected files.
   - Never activate for single-file or isolated UI tweaks.

---

## 4. Strict Safety & Installation Guardrails

- **Automatic USE** of already-installed skills is permitted.
- **Automatic INSTALLATION** of new skills is **STRICTLY FORBIDDEN**.
- If a required capability is missing:
  1. STOP execution before downloading anything.
  2. Explain what is missing and why existing skills are insufficient.
  3. Provide the recommended tool and exact installation command.
  4. Wait for explicit user approval.
- **Development-Only**: Skills never leak into the React web bundle, Firebase, or runtime endpoints.
- **Preserve Core HIM GATHA Guardrails**:
  - 222 offline deities in `src/data/deities.json`.
  - Zero paid/AI runtime APIs.
  - Zero heavy 3D/animation bloat.
  - Zero automatic production deployments.

---

## 5. Standardized Reporting Format

At the conclusion of substantial tasks, summarize:

```markdown
### Skills Used
- **<Skill Name>**: <Concrete reason why it materially improved this task>

### Skills Considered but Not Used
- **<Skill Name>**: <Reason why it was intentionally skipped to keep execution lightweight>

### Missing Skills
- None (or description of missing capability if approval was needed)
```
