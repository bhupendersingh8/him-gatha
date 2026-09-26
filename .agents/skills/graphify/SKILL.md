---
name: graphify
description: Codebase knowledge graph navigation and structural relation engine. Use when you need to understand cross-file dependencies, call hierarchies, AST symbols, or high-level architecture without burning tokens re-reading files.
---

# Graphify — Deterministic Codebase Knowledge Graph

## Purpose
`graphify` (by Graphify Labs) solves agent context limits by parsing codebases into a queryable knowledge graph using `tree-sitter`. Instead of repeatedly reading raw files into the context window, it exposes AST symbols, callers, callees, definitions, and dependencies.

## When to Use
- Navigating massive codebases (>10k lines of code) with complex dependency webs.
- Finding all usages, imports, and downstream impacts of a symbol before refactoring.
- Auditing architectural layers, Circular dependencies, or dead exports.

## How It Works
1. **Local Tree-Sitter AST**: Parses code locally without LLM calls, ensuring zero token waste and complete privacy.
2. **Graph Model**: Generates a graph containing Nodes (Files, Classes, Functions, Schemas) and Edges (Imports, Calls, Implements, Inherits).
3. **Query Engine**: Allows the agent to query the relationship graph directly.

## Installation & Setup
```bash
# Using uv (recommended)
uv tool install graphifyy
graphify install

# Or using pipx
pipx install graphifyy
```

## Usage
```bash
# Generate graph for current repository
graphify build

# Query relationship of a function or class
graphify query "functionName"
```
