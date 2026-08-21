---
trigger: glob
description: Strict security hardening rules for GitHub Actions workflows (Zizmor, injections, permissions).
globs: ".github/workflows/*.yml, .github/workflows/*.yaml"
---

# GitHub Actions Security Hardening

This repository enforces strict CI/CD security standards to prevent supply-chain attacks, command injections, and credential leakage. We use [Zizmor](https://github.com/woodruffw/zizmor) for automated security scanning.

Whenever you modify or create files in `.github/workflows/`, you **must** adhere to the following security guidelines.

## 1. Prevent Template Injections

**Never** use raw GitHub expression expansion (`${{ }}`) directly inside a `run:` block if the expression contains untrusted input (e.g., PR titles, branch names, or step outputs). 

**Insecure:**
```yaml
run: echo "Branch is ${{ github.event.pull_request.head.ref }}"
```

**Secure:** Map the variable to an intermediate `env` variable first. Bash will securely handle the environment variable without risking command injection.
```yaml
env:
  HEAD_REF: ${{ github.event.pull_request.head.ref }}
run: echo "Branch is $HEAD_REF"
```

## 2. Pin Actions to Commit SHAs

To prevent upstream supply-chain attacks, all third-party actions MUST be pinned to an immutable commit SHA rather than a mutable tag (e.g., `@v4`).

**Insecure:**
```yaml
uses: actions/checkout@v4
```

**Secure:**
```yaml
uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
```

## 3. Safe Multiline Conditions

When writing multiline `if:` conditions, you must use the YAML block scalar strip indicator (`|-`) rather than the clip indicator (`|`). The standard `|` retains trailing newlines, which GitHub Actions evaluates as a non-empty string (which is truthy), potentially causing skipped steps to run unintentionally.

**Insecure:**
```yaml
if: |
  github.event_name == 'push' ||
  github.event_name == 'pull_request'
```

**Secure:**
```yaml
if: |-
  github.event_name == 'push' ||
  github.event_name == 'pull_request'
```

## 4. Least Privilege & Credential Management

- **Explicit Permissions:** Every workflow must declare baseline permissions at the top level to override default excessive privileges.
  ```yaml
  permissions:
    contents: read
  ```
- **Checkout Credentials:** When using `actions/checkout`, explicitly disable credential persistence to prevent the `GITHUB_TOKEN` from lingering in local `.git/config` artifacts unless strictly necessary for a subsequent `git push`.
  ```yaml
  uses: actions/checkout@<sha>
  with:
    persist-credentials: false
  ```

## 5. Zizmor Overrides

If Zizmor flags a finding that is intentional or a known false positive, suppress it using the `# zizmor: ignore[rule-name]` comment flag directly above the offending line.

**Example: Intentional dependabot triggers**
```yaml
on:
  # zizmor: ignore[dangerous-triggers]
  pull_request_target:
```
