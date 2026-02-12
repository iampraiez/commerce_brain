---
description: common development commands for Nexus
---

### Starting Development Servers

To run the projects locally, use the following commands:

**Analytic Site**
```bash
cd analytic-site && pnpm dev
```

**Commerce Site**
```bash
cd commerce-site && pnpm dev
```

**SDK Development**
To watch for changes in the SDK:
```bash
cd nexus-sdk && pnpm dev
```

### Centralized Config
All environment variables are managed in `analytic-site/config/env.ts`. Ensure you add new variables there and validate them with Zod.

### SDK Playground
Access the local SDK tester at `http://localhost:3000/sdk-test` when the analytic site is running.
