---
allowed-tools: TodoWrite, TodoRead, Read, Write, MultiEdit, Bash(mkdir:*)
description: Start Specification-Driven Development workflow for the given task
---

## Context

- Task requirements: $ARGUMENTS

## Your task

Execute the complete Specification-Driven Development workflow:

### 1. Setup

- Create `.tmp` directory if it doesn't exist
- Create a new feature branch based on the task

### 2. Stage 1: Requirements

Execute `/requirements` command to create detailed requirements specification.

**MUST include code quality requirements (ESLint, Prettier, Tailwind CSS)**

**Present requirements to user for approval before proceeding**

### 3. Stage 2: Design

Execute `/design` command to create technical design based on requirements.

**MUST analyze existing components and Tailwind configuration**
**MUST include coding standards and quality checks**

**Present design to user for approval before proceeding**

### 4. Stage 3: Task List

Execute `/tasks` command to break down design into implementable tasks.

**MUST include quality checks for each task:**
- ESLint: `npm run lint` (0 errors)
- Prettier formatting
- Tailwind utility classes only
- Build verification: `npm run build`

**Present task list to user for approval before proceeding**

### 5. Quality Assurance Process

For EVERY implementation step:
1. Write code following existing patterns
2. Use only Tailwind utility classes for styling
3. Run `npm run lint` and fix all errors
4. Format with Prettier
5. Run `npm run build` to verify
6. Only mark task as complete when ALL checks pass

### 6. Report completion

Summarize what was created and inform user that they can now proceed with implementation using the generated specification documents.

## Important Notes

- Each stage output should be detailed and actionable
- Wait for user confirmation between stages
- Focus on clarity and completeness in documentation
- Consider edge cases and error scenarios in each stage
- **MUST enforce ESLint, Prettier, and Tailwind CSS standards throughout**
- **All code must pass quality checks before proceeding**

think hard
