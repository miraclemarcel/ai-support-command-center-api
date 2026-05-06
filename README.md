# AI Customer Support Command Center API

Enterprise-grade backend system for an AI-powered support platform: **Intercom + Zendesk + AI + analytics**.

This Project contains the API side only. It is designed so the frontend can later consume clean REST endpoints and realtime Socket.IO events.

---

## What this backend includes

### Core Product Features

1. **Authentication & RBAC**
   - JWT login/register.
   - Roles: `ADMIN`, `MANAGER`, `AGENT`, `VIEWER`.
   - Tenant-ready organization model.

2. **Customers**
   - Create/list/update customers.
   - Track channels, email, phone, country, notes, and metadata.

3. **Conversations**
   - Multi-channel support conversations.
   - Channels supported in the data model: `WEB_CHAT`, `WHATSAPP`, `EMAIL`, `VOICE`, `API`.
   - Customer/operator messages.
   - Live takeover support.

4. **AI Chatbot Layer**
   - AI-generated replies.
   - Sentiment analysis.
   - Ticket escalation recommendation.
   - Provider abstraction ready for OpenAI first, Claude/Gemini later.

5. **Ticketing**
   - Create/list/update tickets.
   - Assign tickets to agents.
   - Status and priority tracking.
   - AI-created ticket summaries.

6. **Knowledge Base RAG**
   - Knowledge articles.
   - Chunking service.
   - Embedding service abstraction.
   - Prisma model for vector-ready chunks.
   - pgvector SQL migration notes included.

7. **Voice Note Transcription**
   - Upload endpoint placeholder.
   - AI transcription service abstraction.
   - Stores transcript as a message.

8. **Analytics**
   - Dashboard summary endpoint.
   - Ticket counts by status/priority.
   - Conversation volume.
   - Average response-time placeholder.
   - Sentiment distribution placeholder.

9. **Realtime Operator Dashboard**
   - Socket.IO gateway.
   - Events for new messages, ticket updates, and live takeover.

10. **Integration Stubs**
   - WhatsApp webhook controller.
   - Email inbound webhook controller.
   - Outbound notification service stub.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** NestJS + TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Vector Search:** pgvector-ready schema
- **Cache/Queue:** Redis + BullMQ-ready setup
- **AI:** OpenAI service implementation with provider abstraction
- **Realtime:** Socket.IO
- **Security:** Helmet, CORS, validation pipes, JWT guards, throttling
- **Docs:** Swagger/OpenAPI at `/docs`

---

## Folder Structure

```txt
ai-support-command-center-api/
├── prisma/
│   ├── schema.prisma          # Full DB schema
│   └── seed.ts                # Demo organization, users, customer, article
├── src/
│   ├── main.ts                # App bootstrap, Swagger, security setup
│   ├── app.module.ts          # Root module
│   ├── common/                # Shared decorators, guards, filters, utils
│   ├── config/                # Environment validation/config
│   ├── database/              # Prisma service/module
│   ├── auth/                  # Register/login/JWT/RBAC
│   ├── users/                 # User endpoints and service
│   ├── customers/             # Customer CRM endpoints
│   ├── conversations/         # Chat/conversation APIs
│   ├── tickets/               # Ticketing APIs
│   ├── ai/                    # AI provider, sentiment, reply generation, transcription
│   ├── knowledge-base/        # Articles, chunks, embeddings/RAG
│   ├── analytics/             # Dashboard stats
│   ├── realtime/              # Socket.IO gateway
│   └── integrations/          # WhatsApp/email webhook stubs
├── docker-compose.yml         # Postgres + Redis local services
├── .env.example               # Required environment variables
└── README.md
```

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the values if needed.

### 3. Start Postgres and Redis

```bash
docker compose up -d
```

### 4. Generate Prisma client

```bash
npm run prisma:generate
```

### 5. Run migration

```bash
npm run prisma:migrate
```

### 6. Seed demo data

```bash
npm run seed
```

### 7. Run the API

```bash
npm run dev
```

API base URL:

```txt
http://localhost:4000/api/v1
```

Swagger docs:

```txt
http://localhost:4000/docs
```

---

## Demo Login

After seeding:

```txt
Email: admin@demo.com
Password: Password123!
```

---

## Important API Endpoints

### Auth

```txt
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

### Customers

```txt
POST /api/v1/customers
GET  /api/v1/customers
GET  /api/v1/customers/:id
PATCH /api/v1/customers/:id
```

### Conversations

```txt
POST /api/v1/conversations
GET  /api/v1/conversations
GET  /api/v1/conversations/:id
POST /api/v1/conversations/:id/messages
POST /api/v1/conversations/:id/ai-reply
POST /api/v1/conversations/:id/takeover
```

### Tickets

```txt
POST /api/v1/tickets
GET  /api/v1/tickets
GET  /api/v1/tickets/:id
PATCH /api/v1/tickets/:id
```

### Knowledge Base

```txt
POST /api/v1/knowledge-base/articles
GET  /api/v1/knowledge-base/articles
POST /api/v1/knowledge-base/search
```

### Analytics

```txt
GET /api/v1/analytics/dashboard
```

### Integrations

```txt
POST /api/v1/integrations/whatsapp/webhook
POST /api/v1/integrations/email/inbound
```

---

## Realtime Events

Connect frontend to:

```txt
ws://localhost:4000/support
```

Recommended events:

```txt
conversation:new-message
conversation:ai-reply
conversation:takeover
conversation:updated
ticket:created
ticket:updated
```

---

## Environment Variables

See `.env.example`.

Main ones:

```txt
DATABASE_URL
REDIS_URL
JWT_SECRET
OPENAI_API_KEY
OPENAI_MODEL
OPENAI_EMBEDDING_MODEL
```

---

## pgvector Note

The Prisma schema stores embeddings in a JSON field by default to keep the project easy to run anywhere.

For real production vector search, enable pgvector in Postgres and change the `KnowledgeChunk.embedding` field to a vector column via SQL migration.

Example SQL:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
ALTER TABLE "KnowledgeChunk" ADD COLUMN IF NOT EXISTS embedding_vector vector(1536);
CREATE INDEX IF NOT EXISTS knowledge_chunk_embedding_idx
ON "KnowledgeChunk" USING ivfflat (embedding_vector vector_cosine_ops);
```

---

## Next Frontend Build

The frontend should consume this backend with:

- Next.js + TypeScript
- Zustand or React Query
- Tailwind/shadcn
- Socket.IO client
- Auth token stored securely
- Dashboard pages for conversations, tickets, analytics, customers, and knowledge base

---

## Production Hardening Checklist

Before real deployment:

- Add refresh tokens and token rotation.
- Add organization subscription/billing checks.
- Move file uploads to S3/R2.
- Add audit logs for all admin actions.
- Add webhook signature verification for WhatsApp/email.
- Add rate limits per organization.
- Add background workers for embeddings/transcription.
- Add tests for critical services.
- Add structured logging and error tracking.
- Add proper pgvector migration.
```
