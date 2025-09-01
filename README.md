# Todo List REST API with Testing

A simple, well-tested REST API for managing todo items built with Node.js, Express, and comprehensive testing using Mocha and Chai.

## Features

- ✅ **GET /todos** - List all todos
- ✅ **POST /todos** - Create a new todo
- ✅ **GET /todos/:id** - Get a specific todo
- ✅ **PUT /todos/:id** - Update a todo (text, completion status)
- ✅ **DELETE /todos/:id** - Delete a todo
- ✅ **JSON file storage** - Persistent data storage
- ✅ **Comprehensive testing** - Unit and integration tests

## Project Structure

```
nodejs-mocha-unit-test-tutorial/
├── app.js                 # Main Express server
├── package.json           # Dependencies and scripts
├── data/
│   └── todos.json        # JSON storage file
├── src/
│   ├── models/
│   │   └── todo.js       # Todo data model
│   ├── routes/
│   │   └── todos.js      # API routes
│   └── utils/
│       └── fileUtils.js  # File operations
├── test/
│   ├── unit/
│   │   ├── todo.test.js      # Unit tests for Todo model
│   │   └── fileUtils.test.js # Unit tests for file utilities
│   ├── integration/
│   │   └── api.test.js       # Integration tests for API
│   └── test.js               # Simple example test
└── README.md
```

## Installation

```bash
npm install
```

## Usage

### Start the server
```bash
npm start
# or for development with auto-restart
npm run dev
```

The API will be available at `http://localhost:3000`

### API Endpoints

#### Health Check
```bash
GET /
# Response: { "message": "Todo List API is running!" }
```

#### Get All Todos
```bash
GET /todos
# Response: Array of todo objects
```

#### Create Todo
```bash
POST /todos
Content-Type: application/json

{
  "text": "Buy groceries"
}
# Response: Created todo object with ID
```

#### Get Specific Todo
```bash
GET /todos/:id
# Response: Todo object or 404 if not found
```

#### Update Todo
```bash
PUT /todos/:id
Content-Type: application/json

{
  "text": "Buy organic groceries",
  "completed": true
}
# Response: Updated todo object
```

#### Delete Todo
```bash
DELETE /todos/:id
# Response: 204 No Content
```

### Todo Object Structure
```json
{
  "id": "uuid-string",
  "text": "Todo description",
  "completed": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Testing

### Run All Tests
```bash
npm test
```

### Run Unit Tests Only
```bash
npm run test:unit
```

### Run Integration Tests Only
```bash
npm run test:integration
```

### Test Coverage

The test suite includes:

**Unit Tests:**
- Todo model CRUD operations
- File utilities (read/write operations)
- Input validation
- Error handling

**Integration Tests:**
- Complete API endpoint testing
- HTTP status codes
- Request/response validation
- Error scenarios

## Example API Usage

### Using curl

```bash
# Create a todo
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "Learn Node.js testing"}'

# Get all todos
curl http://localhost:3000/todos

# Update a todo (replace :id with actual todo ID)
curl -X PUT http://localhost:3000/todos/:id \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Delete a todo
curl -X DELETE http://localhost:3000/todos/:id
```

### Using Postman

Import the following collection:

```json
{
  "info": {
    "name": "Todo API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Todos",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/todos"
      }
    },
    {
      "name": "Create Todo",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/todos",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"text\": \"New todo item\"\n}"
        }
      }
    }
  ]
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `204` - No Content (for DELETE)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a descriptive message:
```json
{
  "error": "Todo text is required and must be a non-empty string"
}
```

## Dependencies

- **express** - Web framework
- **uuid** - Generate unique IDs
- **mocha** - Testing framework
- **chai** - Assertion library
- **supertest** - HTTP testing
- **nodemon** - Development server (dev dependency)
# mocha
