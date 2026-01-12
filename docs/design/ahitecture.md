# System Architecture & Design Decisions

## Overview
The Nobel Prize Explorer is designed as a service-oriented web application
that integrates semantic web technologies (RDF, SPARQL) with a modern
single-page application frontend.

The system is structured around a clear separation of concerns between:
- Presentation layer (React SPA)
- Application layer (Flask REST API)
- Data & knowledge layer (SPARQL endpoints + local RDF store)

## Backend Design
The backend follows a layered architecture:

- **Controllers**: HTTP request handling, authentication, validation
- **Services**: business logic and orchestration of SPARQL queries
- **Repositories**: interaction with external SPARQL endpoints
- **Stores**: local RDF persistence (ActivityStreams Likes)
- **Utils**: shared helpers (pagination, SPARQL building, serialization)

This structure improves testability, maintainability, and extensibility.

## Frontend Design
The frontend is implemented as a React single-page application:
- Zustand is used for lightweight global state management
- Tailwind CSS ensures responsive and consistent UI design
- Feature modules are organized around views (Prizes, Laureates, Statistics)

## Plugin-Oriented Statistics
The statistics module is designed to be extensible via a plug-in approach.
Each statistic is computed independently and exposed through a uniform API,
allowing future extensions without impacting existing logic.

## Design Patterns Used
- Separation of Concerns
- Repository Pattern
- Service Layer Pattern
- Facade pattern for SPARQL access
- Client–Server architecture

## Security Considerations
- Session-based authentication (Flask-Login)
- Email confirmation workflow
- User-scoped RDF data (favorites)
