---
name: code-review
description: >-
  Reviews Google Maps JS API sample changes for API design, TypeScript quality, architecture, performance, testing, readability, and DRY principles. Use when reviewing pull requests, self-reviewing local branch changes before sending for review, or analyzing API compatibility of Maps JS changes.
---

# Maps JS Code Reviewer Skill

This skill provides guidelines, inspection commands, and checklists for
reviewing changes in the js-api-samples codebase,
supporting both **Peer Code Review** and **Pre-Submission Self-Review**.

## CRITICAL: Code Reviewer Behavior

**CODE REVIEWER TASK:** Act as an expert open-source maintainer for the Google Maps JS API samples repository. Thoroughly review local branch changes or Pull Requests against Maps JS API design philosophy, performance, type safety, and architectural standards.
Call out any bugs, edge cases, flaws, or areas for improvement. Be detailed and provide concrete code examples where helpful.

When acting as a reviewer, you may be reviewing local workspace changes before they are committed, or you may be reviewing a branch/PR.
-   **Self-Review (Local Workspace)**: Report findings directly in chat as actionable feedback for the user to fix before committing.
-   **Peer Review (Pull Requests)**: Review the diff of the branch/PR and provide constructive feedback.

## When to Use

Use this skill when:

-   Conducting a code review on a branch or Pull Request.
-   Self-reviewing local workspace changes before committing or pushing for review.
-   Analyzing potential side effects, performance impact, or architectural compatibility of changes.

## Step 1: Inspect the Changes

Identify the target state and inspect the full description and diff:

### A. Local Workspace (Self-Review):

```bash
# Check working directory status
git status

# View uncommitted changes in local workspace
git diff

# View staged changes
git diff --cached
```

### B. Remote / Branch (Peer Review):

```bash
# View the commit history for the branch
git log main..HEAD

# View the full diff of the branch against main
git diff main...HEAD
```

### C. Validation (Linting & Formatting):

When self-reviewing local changes, you can verify that the code complies with prettier and eslint standards by running the single-build script (adjust the path based on your current working directory):

```bash
# Replace <sample-name> with the directory name of the modified sample
./build-single.sh <sample-name>
```

---

## Step 2: Review Checklist

Review the changes using the perspective of an expert maintainer on the Maps JS Platform team:

### 1. Scope & Granularity

- **Scope Audit:** Check if the changes are too large or mix unrelated concerns (e.g., refactoring base components while adding unrelated feature logic or test demos).
- **Decomposition Recommendation:** If the changes contain multiple architectural concerns, recommend splitting them into smaller, self-contained commits.

### 2. Code Readability & Clarity

- **Flow Understandability:** Verify that code paths and execution flow are intuitive and easy to trace.
- **Refactoring Hierarchy:** If readability is poor, recommend improvements in the following strict order of preference:
  1. **Extract Helper Functions:** Break down long or nested methods into small, focused, single-responsibility helper functions.
  2. **Descriptive Naming:** Rename variables, parameters, and methods to be self-documenting (avoid abbreviations or generic names like `data`, `res`, `obj`).
  3. **Explanatory Comments (Last Resort):** Add inline comments or JSDoc `@desc` annotations *only* when complex algorithms, domain constraints, or non-obvious workarounds cannot be expressed clearly through clean code alone.

### 3. DRY Principle (Don't Repeat Yourself)

- **Duplication Audit:** Search for copy-pasted code blocks, redundant validation checks, or duplicated configuration objects.
- **Consolidation:** Recommend extracting shared helper methods, shared templates, or common base class behaviors to avoid logic duplication.

### 4. API Design & Compatibility

- **Backward Compatibility**: Ensure no breaking changes are introduced to public APIs unless explicitly planned.
- **Naming Conventions**: Follow existing Maps JS naming patterns (`camelCase` for properties/methods, `PascalCase` for classes/types).
- **Geo AIP Best Practices**: Ensure the sample aligns with modern Google Maps Platform patterns (e.g., dynamic `importLibrary` loading, avoiding global variables).

### 5. TypeScript & JavaScript Quality

- **Type Safety**: Avoid using `any` where possible. Require precise types or generics so API consumers benefit from compile-time type guarantees.
- **Strict Null Checks**: Ensure code handles `null` and `undefined` safely without unsafe type assertions (`!`).
- **Modern Standards**: Ensure adherence to the repository rules. You MUST read `.agents/rules/javascript-conventions.md` to refresh your knowledge of local architectural anti-patterns (e.g. no floating promises, strict dynamic `importLibrary` loading, avoiding global variables) before providing feedback.

### 6. Testing

- **Automated Tests**: Ensure any visual or logic changes don't break the Playwright CI/CD tests. Check if tests should be updated to assert new behaviors.
- **Minimal Test Churn**: Ensure test edits are deliberate and preserve existing test coverage.

### 7. Feedback Execution

-   **Local Review**: Report issues directly in chat organized by severity (Must-Fix, Should-Fix, Nitpicks) with proposed refactorings.
-   **PR Review**: Post constructive feedback explaining *why* changes are suggested with concrete code examples.

---

## Output Format

### Review Report (Chat):

1.  **High-Level Summary**: Overview of the changes.
2.  **Critical Findings & Recommendations**: Grouped into Must-Fix, Should-Fix, and Nits with code examples.
3.  **Scope Assessment**: Recommendations for splitting commits or updating tests.