# 0002: Three-Layer CSS Token Design System

We established a 3-layer CSS custom properties architecture (Primitive $\rightarrow$ Semantic $\rightarrow$ Component) defined directly in `src/index.css` instead of scattershot raw Tailwind hex utilities.

This ensures all UI elements adhere strictly to the Himalayan heritage palette (Sandstone `#FAF6F0`, Deodar Timber `#2C1E16`, Sacred Brass `#D4AF37`, Sindoor Crimson `#8E2800`, and Pine Forest `#1E3A2F`). It prevents the common AI failure mode of reverting to generic modern SaaS blue/purple themes and guarantees instant global theming control.
