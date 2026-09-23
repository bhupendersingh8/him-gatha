# HIMGATHA - Development Sprint & Refactoring Roadmap

This document outlines the step-by-step engineering roadmap to elevate Himgatha from a high-fidelity prototype to an academic-grade Digital Humanities registry for NCIKS-2026.

---

## 🏃 Sprint 1: UX Polish & Form Optimization (Current)
- [x] **Fix Card Title Truncation:** Apply `line-clamp-2` with `min-h-[3.25rem]` to prevent layout fragmentation across deity rows.
- [x] **Card Image Support:** Enable dynamic rendering of `deity.imageUrl` with a visual letter fallback.
- [x] **Stats Panel Injection:** Mount content-trust indicators (180+ Deities, 12 Districts, 1000+ Years of Oral History) below the slideshow.
- [/] **Interactive Coordinate Picker:** Replace manual GPS text inputs in `ContributionForm.jsx` with a map-based selection preview.

---

## 🏃 Sprint 2: Cultural Preservation Features (Upcoming)
- [ ] **Oral Narrative Audio Recorder/Player:** Integrate dynamic audio uploads to fulfill the "Orality" schema constraints.
- [ ] **Dual Language Toggle Integration:** Map translation maps via `LanguageContext.jsx` to switch between English and Devanagari text.
- [ ] **Geospatial Obfuscation Enforcer:** Double-check client filtering to ensure restricted coordinates are never exposed to standard viewers.

---

## 🏃 Sprint 3: Academic Credibility & Connectivity
- [ ] **PDF Data Sheet Export:** Enable researchers to download offline metadata sheets for scholarly citations.
- [ ] **PWA Offline Asset Caching:** Set up service workers to cache layouts for mountain areas with zero cellular reception.
