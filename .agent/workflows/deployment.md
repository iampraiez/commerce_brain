---
description: Deployment instructions for Nexus components
---

### Analytic Site (Next.js)
Deploy to Vercel or any Next.js compatible host:
```bash
cd analytic-site && pnpm build
```

### SDK Distribution
The SDK is built into `dist/` and can be published to npm:
1. Build the SDK: `cd nexus-sdk && pnpm build`
2. Update version in `package.json`.
3. Run `npm publish`.

### Environment Variables
Ensure all production secrets are set in your deployment environment as defined in `analytic-site/config/env.ts`.
