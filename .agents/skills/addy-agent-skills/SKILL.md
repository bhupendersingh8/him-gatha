---
name: addy-agent-skills
description: Production-grade software development lifecycle (SDLC) workflows from Addy Osmani for AI agents. Enforces structured Spec -> Plan -> Build -> Verify -> Review -> Ship quality gates.
---

# Addy Osmani's Agent Skills Framework

## Overview
A curated collection of production engineering workflows by Addy Osmani designed to elevate AI coding assistants from raw prompt-responders to disciplined engineering partners.

## The 6 SDLC Quality Gates

### 1. Define (`/spec` or `to-spec`)
- Always anchor changes in a specification or issue description before coding.
- Clarify ambiguous requirements, boundary conditions, and non-goals.

### 2. Plan (`/plan`)
- Break complex tasks into bite-sized, sequentially verifiable steps.
- Identify dependencies, potential risks, and fallback scenarios.

### 3. Build (`/build` or `incremental-implementation`)
- Make focused, atomic code changes.
- Avoid multi-file scope creep during a single step.

### 4. Verify (`/test` or `tdd`)
- Write tests first (Red-Green-Refactor) or immediately verify with automated tests.
- Ensure 100% test passing and zero regressions.

### 5. Review (`/review` or `code-review`)
- Evaluate against codebase standards, security best practices, and spec fidelity.
- Check bundle size impact and performance implications.

### 6. Ship (`/ship` or `pr`)
- Clean commit messages following conventional commits.
- Structured pull request summaries with before/after comparisons and verification receipts.

## How to Install the Full Global Package
```bash
npx skills add addyosmani/agent-skills
```
