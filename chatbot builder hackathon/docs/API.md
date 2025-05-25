# 📡 API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints except `/auth` require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Flow Management

#### Get All Flows
```http
GET /flows
```
Response:
```json
[
  {
    "id": "flow_id",
    "name": "Flow Name",
    "nodes": [],
    "edges": []
  }
]
```

#### Get Single Flow
```http
GET /flows/:id
```
Response:
```json
{
  "id": "flow_id",
  "name": "Flow Name",
  "nodes": [],
  "edges": []
}
```

#### Create Flow
```http
POST /flows
```
Body:
```json
{
  "name": "New Flow",
  "description": "Flow description",
  "nodes": [],
  "edges": []
}
```

#### Update Flow
```http
PUT /flows/:id
```
Body:
```json
{
  "name": "Updated Flow",
  "nodes": [],
  "edges": []
}
```

### Template Management

#### Get All Templates
```http
GET /templates
```
Response:
```json
[
  {
    "id": "template_id",
    "name": "Template Name",
    "category": "customer_service",
    "nodes": []
  }
]
```

#### Get Templates by Category
```http
GET /templates/category/:category
```
Response:
```json
[
  {
    "id": "template_id",
    "name": "Template Name",
    "category": "customer_service",
    "nodes": []
  }
]
```

#### Clone Template
```http
POST /flows/template/:id/clone
```
Response:
```json
{
  "id": "new_flow_id",
  "name": "Template Name Copy",
  "nodes": []
}
```

### Chat Integration

#### Initialize Chat
```http
POST /chat/initialize
```
Body:
```json
{
  "flowId": "flow_id"
}
```
Response:
```json
{
  "flowId": "flow_id",
  "context": {
    "currentNodeId": "start_node_id",
    "variables": {}
  },
  "initialMessage": "Hello! How can I help you today?"
}
```

#### Process Message
```http
POST /chat/message
```
Body:
```json
{
  "flowId": "flow_id",
  "message": "User message",
  "context": {
    "currentNodeId": "current_node_id",
    "variables": {}
  }
}
```
Response:
```json
{
  "response": "Bot response",
  "nextNodeId": "next_node_id",
  "context": {
    "currentNodeId": "next_node_id",
    "variables": {}
  }
}
```

## Error Responses

All endpoints return error responses in this format:
```json
{
  "message": "Error description"
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Rate Limiting
- Window: 15 minutes
- Max Requests: 100 per window
- Status Code: 429 Too Many Requests 