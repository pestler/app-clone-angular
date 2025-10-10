# Main Task Rationale

This document provides a brief rationale for the technical choices and architectural decisions made in this project.

## Signals vs RxJS Rationale

We chose signals for component state management (watchlist, UI state) due to their simplicity and better integration with Angular's change detection. RxJS remains for HTTP streams and complex async operations where its operators provide more flexibility. This creates clear boundaries: signals for reactive UI state, RxJS for data streams.

## Core Focus Areas

- **Signals**: Utilized for managing UI state and reactive data flows, enhancing performance and developer experience.
- **New Router**: Implemented with lazy loading, guards, and resolvers for efficient and secure navigation.
- **Strict TypeScript**: Enforced throughout the codebase to ensure type safety and reduce runtime errors.
- **Testing**: Comprehensive unit and E2E tests are in place to ensure reliability and maintainability.
