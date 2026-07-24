---
trigger: always_on
---

# TypeScript Configuration Management for Samples

Standardized approach for managing `tsconfig.json` files across multiple samples in a monorepo.

## Strategy for Mass-Updates

- **Target Identification**: Identify samples based on their project type (e.g., non-react samples) and apply configuration templates selectively.
- **Template-Based Management**: Use a standardized JSON template to overwrite configuration files for consistency.
- **Verification Workflow**: Ensure each `tsconfig.json` correctly extends the base configuration and points to the appropriate output directory (e.g., `dist/`).

## Standard `tsconfig.json` Template (Non-React)

A typical template for a non-react sample should include:
- Extension from a base configuration (`extends: "../../tsconfig.base.json"`).
- Specific compiler options for the sample environment.
- Explicit `include` and `exclude` paths.

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "."
  },
  "include": ["./*.ts"]
}
```

## Maintenance & Verification
- Regularly check that all samples have a clean, deployable state.
- Validate that the local workspace is clean before pushing changes to the repository.
- Use a script or automated check to verify that all samples follow the configuration standards.
