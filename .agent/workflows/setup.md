---
description: How to set up the Nexus project for local development
---

Follow these steps to set up the entire project across all components.

1. **Install Dependencies**
   Run the following command at the root to install dependencies for all sub-projects:
   ```bash
   pnpm install --no-frozen-lockfile
   ```

2. **Set up Environment Variables**
   - Navigate to `analytic-site` and `commerce-site`.
   - Copy `.env.example` to `.env` (if available) or create a `.env` file based on the required variables in `analytic-site/config/env.ts`.

3. **Database Setup**
   Ensure you have a MongoDB instance running and provide the `MONGODB_URI` in the `analytic-site/.env` file.

4. **Initialize SDK Link**
   Ensure the `nexus-sdk` is built before use in other projects:
   ```bash
   cd nexus-sdk && pnpm build && cd ..
   ```
