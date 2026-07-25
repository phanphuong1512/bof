```markdown
# bof Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns used in the `bof` repository, a TypeScript project built with the Next.js framework. You'll learn how to structure files, write imports and exports, follow commit message conventions, and implement tests according to the project's standards.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `userProfile.ts`, `getData.tsx`

### Import Style
- Use **relative imports** for referencing modules.
  - Example:
    ```typescript
    import userService from '../services/userService';
    ```

### Export Style
- Use **default exports** for modules.
  - Example:
    ```typescript
    const getData = () => { /* ... */ };
    export default getData;
    ```

### Commit Messages
- Commit messages are **freeform** (not strictly conventional).
- May include prefixes, but not required.
- Average commit message length: ~36 characters.
  - Example:
    ```
    Fix user profile loading issue
    ```

## Workflows

### Adding a New Feature
**Trigger:** When you need to implement a new feature.
**Command:** `/add-feature`

1. Create a new file using camelCase naming.
2. Implement the feature using TypeScript and Next.js conventions.
3. Use relative imports to include dependencies.
4. Export the main component or function as default.
5. Write a corresponding test file (`*.test.*`).
6. Commit changes with a clear, concise message.

### Fixing a Bug
**Trigger:** When you need to resolve a bug or issue.
**Command:** `/fix-bug`

1. Locate the relevant file(s) using camelCase naming.
2. Apply the fix, ensuring code style consistency.
3. Update or add tests in the corresponding `*.test.*` file.
4. Commit with a message describing the fix.

### Writing Tests
**Trigger:** When adding or updating tests.
**Command:** `/write-test`

1. Create or update a test file matching the pattern `*.test.*`.
2. Write tests for the relevant functionality.
3. Use the project's preferred (unknown) testing framework.
4. Run tests to verify correctness.

## Testing Patterns

- Test files follow the `*.test.*` naming convention.
  - Example: `userProfile.test.ts`
- The specific testing framework is **unknown**, but standard TypeScript/Next.js testing practices apply.
- Place test files alongside the modules they test or in a dedicated test directory.

## Commands
| Command        | Purpose                                 |
|----------------|-----------------------------------------|
| /add-feature   | Start the workflow for adding a feature |
| /fix-bug       | Begin the bug fixing workflow           |
| /write-test    | Guide for writing or updating tests     |
```