<!--
SYNC IMPACT REPORT
===================
Version Change: [UNVERSIONED] → 1.0.0
Rationale: Initial constitution establishment with core development principles

Modified Principles: N/A (initial creation)
Added Sections:
  - I. Descriptive Naming
  - II. Test-Driven Development (TDD)
  - III. Clean Function Design
  - Development Standards
  - Code Review & Quality Gates

Removed Sections: N/A

Templates Status:
  ✅ plan-template.md - Constitution Check section aligned
  ✅ spec-template.md - Requirements framework compatible
  ✅ tasks-template.md - TDD workflow integrated (tests-first pattern)
  ✅ Command files - Generic guidance maintained

Follow-up TODOs: None
===================
-->

# shape-guesser Constitution

## Core Principles

### I. Descriptive Naming

All code identifiers (variables, functions, classes, modules) MUST use human-readable, descriptive names that clearly communicate intent and purpose.

**Rules:**
- Variable names MUST describe the data they hold (e.g., `userAccountBalance` not `uab` or `x`)
- Function names MUST describe the action they perform using verbs (e.g., `calculateTotalPrice`, `validateUserInput`)
- Class names MUST describe the entity they represent using nouns (e.g., `ShapeDetector`, `UserProfile`)
- Avoid abbreviations except for universally understood terms (e.g., `url`, `id`, `html`)
- Prefer longer, clear names over brevity

**Rationale:** Code is read far more often than written. Descriptive naming eliminates the need for comments to explain "what" the code does, reduces cognitive load during maintenance, and enables new contributors to understand the codebase quickly.

### II. Test-Driven Development (TDD) (NON-NEGOTIABLE)

All feature development MUST follow the Test-Driven Development methodology: write tests first, verify they fail, then implement code to make them pass.

**Rules:**
- Tests MUST be written before implementation code
- Initial test run MUST show failures (Red phase)
- Implementation MUST make tests pass (Green phase)
- Code MUST be refactored for quality while maintaining passing tests (Refactor phase)
- No production code without corresponding tests
- Red-Green-Refactor cycle is strictly enforced

**Rationale:** TDD ensures comprehensive test coverage, drives better design through testability requirements, provides living documentation of expected behavior, and creates a safety net for refactoring. Non-negotiable status reflects that quality and maintainability are foundational to the project.

### III. Clean Function Design

Functions MUST be small, focused, and adhere to the Single Responsibility Principle (SRP). Each function performs one clear task with proper separation of concerns.

**Rules:**
- Each function MUST have a single, well-defined responsibility
- Function length SHOULD be kept minimal (typically under 20 lines; exceptions must be justified)
- Functions MUST operate at a single level of abstraction
- Side effects MUST be clearly indicated (e.g., function name includes verb like `update`, `save`, `send`)
- Complex logic MUST be decomposed into smaller, named helper functions
- Avoid deep nesting (prefer early returns and guard clauses)

**Rationale:** Small, focused functions are easier to understand, test, debug, and reuse. Separation of concerns reduces coupling, improves maintainability, and makes the codebase more resilient to change. Clear abstraction levels prevent mixing business logic with implementation details.

## Development Standards

### Code Organization
- Source code structure MUST match the project type defined in plan.md
- Related functions MUST be grouped into cohesive modules
- Modules MUST have clear, singular purposes

### Documentation
- Complex algorithms or business rules SHOULD include explanatory comments describing "why" (not "what")
- Public APIs MUST include docstrings/documentation comments
- Function signatures MUST be self-documenting through descriptive naming

### Error Handling
- Error messages MUST be descriptive and actionable
- Functions MUST validate inputs and handle edge cases explicitly
- Failure modes MUST be tested

## Code Review & Quality Gates

### Constitution Compliance
- All pull requests MUST verify adherence to naming conventions
- All pull requests MUST confirm TDD workflow was followed (tests exist and were written first)
- All pull requests MUST verify function design meets SRP and size requirements

### Review Checklist
1. **Naming**: Are all identifiers clearly descriptive?
2. **Tests**: Were tests written first? Do they cover the implementation?
3. **Function Size**: Are functions focused and appropriately sized?
4. **Separation of Concerns**: Does each unit of code have a single responsibility?

### Exceptions & Complexity
- Any deviation from these principles MUST be documented in plan.md Complexity Tracking table
- Justification MUST include why the deviation is necessary and what simpler alternatives were considered
- Repeated deviations trigger architectural review

## Governance

This constitution supersedes all other development practices and conventions. All code contributions must align with these principles.

**Amendment Process:**
1. Proposed changes MUST be documented with rationale
2. Changes require explicit approval and discussion
3. Version number MUST be updated following semantic versioning:
   - **MAJOR**: Removing or fundamentally redefining principles
   - **MINOR**: Adding new principles or materially expanding guidance
   - **PATCH**: Clarifications, wording improvements, non-semantic refinements

**Enforcement:**
- All PRs/reviews must verify constitution compliance
- Complexity and deviations must be explicitly justified in plan.md
- Regular reviews ensure principles remain practical and effective

**Version**: 1.0.0 | **Ratified**: 2025-10-22 | **Last Amended**: 2025-10-22
