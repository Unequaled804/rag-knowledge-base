# rag-knowledge-base

A blueprint for building a RAG-based knowledge base.

## 🛠️ Tech Stack

### Frontend

- **Architecture:** React 19 + Vite + TypeScript + Ant Design
- **Monorepo & Package Management:** pnpm 11 with pnpm workspaces
- **React Ecosystem:**
    - **Data Fetching & Caching:** _TBC_
    - **Error Handling:** `react-error-boundary`
    - **Routing:** _TBC_
    - **State Management:** _TBC_
- **Linting & Formatting:** ESLint + Prettier + EditorConfig
- **Git Hooks:** Husky + lint-staged

### Backend

- **Framework:** Fastify + TypeScript
- **Database & ORM:** PostgreSQL 18 + `pgvector` (for vector storage) + Prisma ORM

### DevOps/CI/CD

- **Containerization:** Docker Compose
