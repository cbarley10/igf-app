# Simple Server Application

A simple Express.js server with three main endpoints for authentication, user data, and Pokemon information.

## Features

- **Authentication Endpoint**: Simple mock authentication
- **Random User Data**: Generates randomized fake user data
- **Random Pokemon**: Returns random Pokemon information
- **CORS enabled** for cross-origin requests
- **JSON responses** for all endpoints

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### 1. Authentication
- **POST** `/api/auth`
- **Body**: `{ "username": "your_username", "password": "your_password" }`
- **Response**: Authentication token and user info

### 2. Random User Data
- **GET** `/api/users/random`
- **Query Parameters**: 
  - `count` (optional): Number of users to return (max 10, default 1)
- **Response**: Array of randomized user objects

### 3. Random Pokemon
- **GET** `/api/pokemon/random`
- **Query Parameters**: 
  - `count` (optional): Number of Pokemon to return (max 5, default 1)
- **Response**: Array of random Pokemon objects

### 4. Health Check
- **GET** `/api/health`
- **Response**: Server status and timestamp

## Example Usage

### Authentication
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass"}'
```

### Get Random Users
```bash
curl http://localhost:3000/api/users/random?count=3
```

### Get Random Pokemon
```bash
curl http://localhost:3000/api/pokemon/random?count=2
```

## Server Configuration

- **Port**: 3000 (configurable via PORT environment variable)
- **CORS**: Enabled for all origins
- **JSON**: Automatic parsing and responses

The server will start on `http://localhost:3000` by default.
