```markdown
# bof Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill outlines the core development patterns and conventions used in the `bof` repository, a TypeScript project built on the Next.js framework. You'll learn how to structure code, write imports and exports, follow naming conventions, and understand the project's approach to testing. This guide is ideal for onboarding new contributors or standardizing team practices.

## Coding Conventions

### File Naming
- Use **camelCase** for all file names.
  - Example: `userProfile.ts`, `apiHandler.tsx`

### Imports
- Use **relative imports** for modules within the project.
  - Example:
    ```typescript
    import userService from '../services/userService';
    ```

### Exports
- Use **default exports** for modules.
  - Example:
    ```typescript
    const userProfile = () => { /* ... */ };
    export default userProfile;
    ```

### Commit Messages
- Commit messages are **freeform** and may include prefixes, but there is no strict pattern.
- Average commit message length: ~36 characters.

## Workflows

_No automated workflows detected in this repository._

## Testing Patterns

- Test files follow the pattern: `*.test.*`
  - Example: `userProfile.test.ts`
- The specific testing framework is **unknown** from the analysis, but tests are colocated with source files or in the same directory.

## Commands
| Command | Purpose |
|---------|---------|
| /new-file | Create a new camelCase-named file with default export |
| /import-module | Add a relative import statement |
| /run-tests | Run all test files matching *.test.* |
```