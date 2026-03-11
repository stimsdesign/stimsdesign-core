# 🟣 @stimsdesign/core

The `@stimsdesign/core` package is the foundational architecture layer for STIMS Design web projects. It is a strictly isolated, framework-agnostic NPM package designed to handle low-level infrastructure dependencies without creating circular references.

**The Golden Rule:** The Core package must *never* import logic from the Frontend application or the Backend Dashboard package. It sits at the very bottom of the dependency chain.

## 📦 Features
- **Database Connection (`db.ts`):** A pre-configured Serverless PostgreSQL connection utility using `@neondatabase/serverless` and standard `pg`. It uses connection pooling to handle Edge/Serverless deployments gracefully on platforms like Netlify.
- **Global Logging (`logger.ts`):** A standardized development logging utility that respects the `ENABLE_DEBUG_LOGGING` environment variable to ensure production consoles remain clean.

## 🚀 Installation & Setup

When utilizing the STIMS Design Monorepo architecture via Git Submodules, this package will automatically be placed into `packages/core/` and linked via the root `package.json` workspaces array.

To install this standalone in a new project:
```bash
npm install git+ssh://git@github.com:stimsdesign/stimsdesign-core.git
```

### Environment Variables
The core package requires the following environment variables to function:
```env
# Database Configuration
DATABASE_URL="postgres://user:password@hostname/dbname"

# Debugging (Set to "true" to print logs in development)
ENABLE_DEBUG_LOGGING="true"
```

## 🛠️ Usage

### Database Queries
Instead of creating new database instances, globally import the `db` pool object from this package into any of your frontend or backend files.

```typescript
import { db } from "@stimsdesign/core/db";

// Example Query
export async function getUsers() {
    const result = await db.query('SELECT * FROM users');
    return result.rows;
}
```

### Logging
To prevent noisy production environments, replace instances of `console.log()` with the core logger.

```typescript
import { logger } from "@stimsdesign/core/logger";

logger.info("Application started successfully");
logger.error("Failed to connect to the database");
logger.warn("Deprecated API usage");
```

## 🤝 Development
1. **Adding Utilities:** New utilities added to this package must be strictly related to foundational structure (e.g., caching, core networking). Business logic belongs in the `backend` package.
2. **Exports:** If you add a new file (e.g., `src/cache.ts`), you **must** export it in `packages/core/package.json` under the `"exports"` map so the TypeScript language server can resolve it across workspace bounds!
