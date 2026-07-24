# Google Maps Samples - AI Agent Roadmap

Welcome to the `js-api-samples` repository! This document serves as the high-level roadmap and entry point for all AI agents contributing to this monorepo. 

This repository contains hundreds of JavaScript and TypeScript samples demonstrating the Google Maps Platform APIs. It relies on a centralized build system, strict linting, and modern Web Component architectures.

## Agent Knowledge Base

To keep the agent context window efficient, fine-grained technical rules and instructions have been modularized. **Always defer to the specific instructions located in the `.agents/` directory:**

### 1. Agent Rules (`.agents/rules/`)
Granular, file-specific constraints and style guidelines are located here. The system will automatically trigger these rules based on the files you are editing. They cover:
- **TypeScript & JavaScript Conventions**: Strict namespace requirements (`importLibrary`), `init()` function naming, and non-null assertions (`!`).
- **CI Pipeline & Linting Constraints**: Prettier formatting constraints, inline loader requirements (`// prettier-ignore`), and async build checks.
- **Modern Maps API Patterns**: The mandatory use of `<gmp-map>` Web Components, `AdvancedMarkerElement`, and modern Places implementations.
- **Design & UI**: Guidelines for achieving premium aesthetics (glassmorphism, Inter font, micro-animations).

### 2. Agent Skills (`.agents/skills/`)
Specialized Standard Operating Procedures (SOPs) for complex repository tasks. You can invoke these skills to perform systematic updates:
- `migration`: Runbooks for migrating legacy samples into this repository's modern scaffolding.
- `refactor` / `refactor-3d`: Focused patterns for migrating standard 2D and 3D samples to declarative Web Components.

## Essential Repository Workflows

While granular rules govern the code, follow these high-level workflow scripts when managing samples:

- **Creating New Samples**: Never write boilerplate manually. Always use `./new-sample.sh [sample-name]` in the `samples/` directory to generate the standard modern boilerplate (Vite config, TS config, package.json).
- **Building and Testing**: Always validate your changes by running `bash ../build-single.sh` from within the specific sample's directory. This script acts as the local CI gate, automatically applying Prettier and running ESLint, and will catch TS errors, namespace violations, and formatting issues.
- **Dependencies**: Any dependency changes or additions must include the updated `package-lock.json` in the commit to pass CI.
