# Expense Tracker API Documentation

All frontend API requests are routed through the Nginx gateway.

Base gateway URL:

```text
http://localhost
```

## Authentication

Protected endpoints require:

```http
Authorization: Bearer <JWT>
```

# Auth Service

Gateway prefix:

```text
/api/auth
```

## GET /

Health check.

```http
GET /api/auth/
```

Response:

```json
{
  "service": "auth-service",
  "status": "running"
}
```

## POST /signup

Creates a new user and returns a JWT.

### Request

```http
POST /api/auth/signup
Content-Type: application/json
```

```json
{
  "email": "test@example.com",
  "password": "Test1234!"
}
```

### Success — 201

```json
{
  "message": "User created",
  "token": "<JWT>",
  "user": {
    "id": 1,
    "email": "test@example.com"
  }
}
```

### Errors

400:

```json
{
  "error": "Email and password required"
}
```

409:

```json
{
  "error": "User already exists"
}
```

500:

```json
{
  "error": "Server error"
}
```

## POST /login

Authenticates an existing user.

### Request

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "test@example.com",
  "password": "Test1234!"
}
```

### Success — 200

```json
{
  "token": "<JWT>",
  "user": {
    "id": 1,
    "email": "test@example.com"
  }
}
```

### Invalid Credentials — 401

```json
{
  "error": "Invalid credentials"
}
```

## GET /verify

Verifies a JWT.

### Request

```http
GET /api/auth/verify
Authorization: Bearer <JWT>
```

### Success — 200

```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "test@example.com"
  }
}
```

### Missing Token — 401

```json
{
  "error": "No token"
}
```

### Invalid Token — 401

```json
{
  "valid": false
}
```

# Expense Service

Gateway prefix:

```text
/api/expenses
```

All expense endpoints require JWT authentication.

## GET /

Health check.

```http
GET /api/expenses/
```

Response:

```json
{
  "service": "expense-service",
  "status": "running"
}
```

## POST /expenses

Creates an expense for the authenticated user.

### Request

```http
POST /api/expenses/expenses
Authorization: Bearer <JWT>
Content-Type: application/json
```

```json
{
  "title": "Groceries",
  "amount": 50,
  "category": "Food"
}
```

### Success — 201

```json
{
  "id": 1,
  "user_id": 1,
  "title": "Groceries",
  "amount": "50.00",
  "category": "Food",
  "expense_date": "2026-09-16",
  "created_at": "2026-09-16T..."
}
```

### Missing Required Fields — 400

```json
{
  "error": "Title and amount are required"
}
```

## GET /expenses

Returns expenses belonging to the authenticated user.

### Request

```http
GET /api/expenses/expenses
Authorization: Bearer <JWT>
```

### Success — 200

```json
[
  {
    "id": 1,
    "user_id": 1,
    "title": "Groceries",
    "amount": "50.00",
    "category": "Food",
    "expense_date": "2026-09-16",
    "created_at": "2026-09-16T..."
  }
]
```

## PUT /expenses/:id

Updates an expense belonging to the authenticated user.

### Request

```http
PUT /api/expenses/expenses/1
Authorization: Bearer <JWT>
Content-Type: application/json
```

```json
{
  "title": "Weekly Groceries",
  "amount": 65,
  "category": "Food"
}
```

### Success — 200

Returns the updated expense.

### Missing Required Fields — 400

```json
{
  "error": "Title and amount are required"
}
```

### Expense Not Found — 404

```json
{
  "error": "Expense not found"
}
```

## DELETE /expenses/:id

Deletes an expense belonging to the authenticated user.

### Request

```http
DELETE /api/expenses/expenses/1
Authorization: Bearer <JWT>
```

### Success — 200

```json
{
  "message": "Expense deleted successfully",
  "expense": {
    "id": 1,
    "user_id": 1,
    "title": "Groceries",
    "amount": "50.00",
    "category": "Food"
  }
}
```

### Expense Not Found — 404

```json
{
  "error": "Expense not found"
}
```

# Authentication Errors

Protected Expense Service endpoints can return:

### Missing Authorization Header — 401

```json
{
  "error": "Authorization token required"
}
```

### Invalid Authorization Format — 401

```json
{
  "error": "Invalid token format"
}
```

Expected format:

```text
Authorization: Bearer <JWT>
```

### Invalid or Expired Token — 401

```json
{
  "error": "Invalid or expired token"
}
```

# Report Service

Gateway prefix:

```text
/api/reports
```

## GET /

Health/status endpoint:

```http
GET /api/reports/
```

The exact reporting endpoints should be added once the final Report Service routes are confirmed.

The Report Service communicates internally with the Expense Service using:

```text
http://expense-service:3002
```

# Service Ports

| Service         | Port |
| --------------- | ---: |
| Nginx Gateway   |   80 |
| Auth Service    | 3001 |
| Expense Service | 3002 |
| Report Service  | 3003 |
| PostgreSQL      | 5432 |

# Request Flow

```text
React Frontend
      |
      v
Nginx :80
      |
      +---- /api/auth/ ------> Auth Service :3001
      |
      +---- /api/expenses/ --> Expense Service :3002
      |
      +---- /api/reports/ ---> Report Service :3003
```
