# Architecture Notes

## Design Goal

This backend is built to look and behave like a real enterprise SaaS API, not a tutorial chatbot.

## Main Domains

- Auth
- Users
- Customers
- Conversations
- Messages
- Tickets
- AI
- Knowledge Base
- Analytics
- Integrations
- Realtime

## AI Flow

1. Customer sends message.
2. API stores message.
3. AI service analyzes sentiment.
4. If message is dangerous/escalation-worthy, conversation moves to human handling.
5. If safe for automation, AI generates reply using recent conversation context and knowledge base context.
6. Agent can take over manually.

## RAG Flow

1. Admin creates knowledge article.
2. Article is chunked.
3. Each chunk gets an embedding.
4. User query searches related chunks.
5. Matched context can be passed into AI reply generation.

The current implementation keeps search simple for easy local setup. Production should use pgvector similarity search.

## Realtime Flow

- Backend emits events when messages, tickets, or takeover states change.
- Frontend listens through Socket.IO namespace `/support`.

## Multi-Tenant Boundary

Every major entity has `organizationId`. Controllers use the JWT user organization ID to isolate data.
