---
name: jev
description: Fast System One decision-making, classification, routing, and schema verification using Jev (TypeSafe AI) architecture patterns. Activate when designing agent decision loops, fast routing, intent classification, cultural taboo filtering, or sub-500ms structured decision policies.
---

# Jev — System One AI Decision Architecture

## Overview
**Jev** is a specialized "System One" AI architecture developed by **TypeSafe AI** (co-founded by former OpenAI researcher Diogo Almeida, released September 2026). 

Unlike traditional Large Language Models (LLMs) that generate text autoregressively (token-by-token), Jev evaluates a state against a set of predefined typed questions **in parallel**, returning deterministic, probabilistic values with ultra-low latency (70–500ms).

```
Traditional LLM (System 2):
Input ──────> [Autoregressive Token Generation] ──────> Text Stream (Slow, 1-10s)

Jev System 1:
Input ──────> [Parallel Typed Question Evaluator] ──────> Typed Schema { key: value, confidence } (Fast, 70-500ms)
```

---

## Core Mental Model: System 1 vs. System 2

| Feature | Traditional LLM (System 2) | Jev Architecture (System 1) |
|---|---|---|
| **Cognitive Mode** | Slow, deliberate, generative reasoning | Fast, automatic, intuitive decision-making |
| **Output Type** | Natural language prose, markdown, code tokens | Typed enums, booleans, floats, probabilities |
| **Execution** | Sequential token prediction | Parallel question evaluation |
| **Latency** | 1,000ms – 10,000ms | 70ms – 500ms |
| **Efficiency** | High compute & token cost | ~200x faster, ~400x cheaper |
| **Primary Role** | Creative writing, explanation, deep planning | Fast routing, gating, classification, moderation |

---

## When to Activate This Skill

Use the `jev` skill when:
1. **Agent Decision Loops**: An autonomous agent needs to make high-frequency control-flow decisions without stalling on slow LLM token streaming.
2. **Intent & Query Routing**: Instantly classifying user search intent into domain facets (e.g. *Deity Lore* vs. *Mela Calendar* vs. *Kinship Graph* vs. *Travel Navigation*).
3. **Cultural Taboo & Niyam Filtering**: Checking community contributions or user queries for temple etiquette violations, prohibited items, or offensive language at sub-second speeds.
4. **Schema & Verification Policy**: Validating submissions against strict types (e.g. valid Himachal coordinates, verified Kardar committees, image restrictions) before passing to heavy background processors.
5. **Linguistic Anomaly Detection**: Rapidly catching misspellings and homophone blunders (e.g., distinguishing *Gur/गूर* from *gud/गुड़*).

---

## Application in HIM GATHA

### 1. Fast Intent & Routing Matrix
When a user searches or interacts with the archive, Jev routes the query to the correct module in < 100ms:

```json
{
  "query": "when is Kamrunag sarahuli mela and can I carry leather belt?",
  "evaluations": {
    "target_district": "Mandi",
    "primary_intent": "MELA_SCHEDULE",
    "secondary_intent": "SACRED_ETIQUETTE_TABOOS",
    "deity_entity": "Dev Kamrunag",
    "requires_taboo_warning": true,
    "taboo_category": "LEATHER_PROHIBITION"
  }
}
```

### 2. Community Submission Gatekeeper
Before writing to the pending submission store:
- `is_himachal_bounds`: `true`
- `has_authentic_lineage_terms`: `true`
- `detected_governance_role`: `["Gur", "Kardar", "Pujari"]`
- `potential_vandalism_score`: `0.02`

### 3. Linguistic & Transliteration Normalization
Detects and auto-flags homophone corruptions:
- Input: `"gud of Hadimba"` → Flagged: `REPLACE_HOMOPHONE('gud', 'गूर', 'oracle')`

---

## Best Practices for Agent Workflows

1. **Pair System 1 (Jev) with System 2 (Claude / Gemini Pro)**:
   - Let Jev handle the fast gatekeeping, filtering, and classification.
   - Hand off to the full LLM only when creative narrative generation, archival synthesis, or code authoring is required.
2. **Strict Typings**: Always formulate Jev questions as explicit TypeScript-like schemas (Booleans, Enums, Number ranges) rather than open strings.
3. **Offline Fallback**: In offline-first PWA architectures like HIM GATHA, emulate Jev patterns locally using optimized regex/trie classifiers and WASM embeddings before network queries.
