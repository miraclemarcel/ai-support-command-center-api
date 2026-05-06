# API Testing Guide

Use Swagger at `/docs` or Postman/Thunder Client.

## 1. Login

```http
POST http://localhost:4000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@demo.com",
  "password": "Password123!"
}
```

Copy `accessToken` and use it as:

```txt
Authorization: Bearer YOUR_TOKEN
```

## 2. Create Customer

```http
POST /api/v1/customers
{
  "fullName": "John Buyer",
  "email": "john@example.com",
  "phone": "+2348000000000",
  "country": "Nigeria"
}
```

## 3. Create Conversation

```http
POST /api/v1/conversations
{
  "customerId": "CUSTOMER_ID",
  "channel": "WEB_CHAT",
  "subject": "Payment failed",
  "firstMessage": "My payment failed but I was debited."
}
```

## 4. Generate AI Reply

```http
POST /api/v1/conversations/CONVERSATION_ID/ai-reply
```

## 5. Create Ticket

```http
POST /api/v1/tickets
{
  "customerId": "CUSTOMER_ID",
  "conversationId": "CONVERSATION_ID",
  "title": "Payment dispute",
  "description": "Customer says they were debited but payment failed.",
  "priority": "HIGH"
}
```
