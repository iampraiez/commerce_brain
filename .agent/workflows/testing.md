---
description: How to run tests and linting
---

### Type Checking
Run TypeScript checks across the projects:

**Analytic Site**
```bash
cd analytic-site && pnpm tsc --noEmit
```

### Linting
Run ESLint to catch common issues:

**Analytic Site**
```bash
cd analytic-site && pnpm lint
```

### SDK Verification
When updating the SDK, ensure it builds correctly:
```bash
cd nexus-sdk && pnpm build
```
