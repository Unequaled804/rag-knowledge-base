# rag-knowledge-base

A Blueprint for the knowledge base for RAG

## 技术选型

- 工程化
    - 包管理：pnpm 11 + workspace，Monorepo 模式
    - 代码风格：ESLint
	- 代码格式化：Prettier + EditorConfig
    - Pre-Commit：Husky + lint-staged（对暂存文件生效）
- 前端：React 19 + Vite + TypeScript + Antd
- 后端：Fastify + TypeScript
- 数据库：PostgreSQL + pgvector（向量存储）+ Prisma（ORM）
- 部署：Docker Compose
