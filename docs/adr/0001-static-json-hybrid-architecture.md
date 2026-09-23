# 0001: Hybrid Static-JSON and Firestore Architecture

HIM GATHA bundles all 222+ deity records into a verified, local client-side JSON archive (`src/data/deities.json`) with an optional Cloud Firestore synchronization layer. 

We chose this hybrid model because remote mountainous Himalayan travelers and field researchers frequently experience intermittent or zero mobile connectivity. Loading the archive locally guarantees instant (<50ms) search, zero latency filtering, and offline-first availability, while remote Firestore allows administrative updates when connected.
