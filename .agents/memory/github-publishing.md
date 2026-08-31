---
name: GitHub publishing
description: Durable workflow lesson for publishing repository changes from Replit.
---

When connected GitHub API writes are rejected by the Replit/Cloudflare proxy, use the Replit Git panel for the final push instead of repeatedly retrying API mutations.

**Why:** Authenticated reads and an initial file creation succeeded, but subsequent Git database and Contents API writes were blocked even though the local branch and commit were valid.

**How to apply:** Keep the complete local commit intact, avoid exposing or handling personal access tokens, and let the user push through the connected Git UI when the integration write path is unavailable.