# Organization Management API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## WebSocket Connection
For real-time updates, connect to WebSocket using:
```
ws://localhost:3000?token=<jwt_token>
```

## Endpoints

### Authentication

#### Login
```http
POST /auth/login
```
Request body:
```json
{
  "email": "string",
  "password": "string"
}
```
Response:
```json
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "role": "enum(admin, ceo, head, member)"
  }
}
```

#### Register
```http
POST /auth/register
```
Request body:
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```
Response:
```json
{
  "message": "User registered successfully",
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "role": "member"
  }
}
```

### Users

#### Get User Profile
```http
GET /users/profile
```
Response:
```json
{
  "id": "uuid",
  "email": "string",
  "name": "string",
  "role": "enum(admin, ceo, head, member)",
  "mainDivision": {
    "id": "uuid",
    "name": "string",
    "type": "enum(main, managerial)"
  },
  "managerialDivision": {
    "id": "uuid",
    "name": "string",
    "type": "enum(main, managerial)"
  }
}
```

#### Update User Profile
```http
PUT /users/profile
```
Request body:
```json
{
  "name": "string",
  "mainDivision": "uuid",
  "managerialDivision": "uuid"
}
```

#### Get Available Times
```http
GET /users/available-times
```
Response:
```json
{
  "monday": ["09:00-12:00", "14:00-17:00"],
  "tuesday": ["09:00-12:00", "14:00-17:00"]
}
```

#### Update Available Times
```http
PUT /users/available-times
```
Request body:
```json
{
  "availableTimes": {
    "monday": ["09:00-12:00", "14:00-17:00"],
    "tuesday": ["09:00-12:00", "14:00-17:00"]
  }
}
```

### Divisions

#### Get All Divisions
```http
GET /divisions
```
Response:
```json
[
  {
    "id": "uuid",
    "name": "string",
    "type": "enum(main, managerial)",
    "description": "string",
    "head": {
      "id": "uuid",
      "name": "string"
    },
    "status": "enum(active, inactive)",
    "progress": "integer(0-100)"
  }
]
```

#### Get Division by ID
```http
GET /divisions/:id
```
Response:
```json
{
  "id": "uuid",
  "name": "string",
  "type": "enum(main, managerial)",
  "description": "string",
  "head": {
    "id": "uuid",
    "name": "string"
  },
  "members": [
    {
      "id": "uuid",
      "name": "string",
      "role": "enum(admin, ceo, head, member)"
    }
  ],
  "status": "enum(active, inactive)",
  "progress": "integer(0-100)"
}
```

### Events

#### Get All Events
```http
GET /events
```
Response:
```json
[
  {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "startTime": "ISO8601",
    "endTime": "ISO8601",
    "type": "enum(main_event, meeting, training, project)",
    "status": "enum(pending, approved, rejected)",
    "role": "enum(head_coordinator, coordinator, sub_coordinator, staff)",
    "creator": {
      "id": "uuid",
      "name": "string"
    }
  }
]
```

#### Create Event
```http
POST /events
```
Request body:
```json
{
  "title": "string",
  "description": "string",
  "startTime": "ISO8601",
  "endTime": "ISO8601",
  "type": "enum(main_event, meeting, training, project)",
  "role": "enum(head_coordinator, coordinator, sub_coordinator, staff)"
}
```

#### Register for Event
```http
POST /events/:eventId/register
```
Request body:
```json
{
  "role": "enum(academic_staff, participant)",
  "notes": "string"
}
```
Response:
```json
{
  "id": "uuid",
  "eventId": "uuid",
  "userId": "uuid",
  "role": "enum(academic_staff, participant)",
  "status": "enum(pending, approved, rejected)",
  "notes": "string",
  "approvedBy": null,
  "createdAt": "ISO8601"
}
```

#### Get Event Registrations (Event Coordinator only)
```http
GET /events/:eventId/registrations
```
Response:
```json
[
  {
    "id": "uuid",
    "eventId": "uuid",
    "user": {
      "id": "uuid",
      "name": "string",
      "email": "string"
    },
    "role": "enum(academic_staff, participant)",
    "status": "enum(pending, approved, rejected)",
    "notes": "string",
    "approvedBy": {
      "id": "uuid",
      "name": "string"
    },
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
]
```

#### Approve/Reject Registration (Event Coordinator only)
```http
PUT /events/:eventId/registrations/:registrationId
```
Request body:
```json
{
  "status": "enum(approved, rejected)",
  "feedback": "string"
}
```
Response:
```json
{
  "id": "uuid",
  "eventId": "uuid",
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string"
  },
  "role": "enum(academic_staff, participant)",
  "status": "enum(approved, rejected)",
  "notes": "string",
  "feedback": "string",
  "approvedBy": {
    "id": "uuid",
    "name": "string"
  },
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Rooms

#### Get All Rooms
```http
GET /rooms
```
Response:
```json
[
  {
    "id": "uuid",
    "name": "string",
    "capacity": "integer",
    "facilities": ["string"],
    "status": "enum(available, occupied, maintenance)"
  }
]
```

#### Book Room
```http
POST /rooms/book
```
Request body:
```json
{
  "roomId": "uuid",
  "startTime": "ISO8601",
  "endTime": "ISO8601",
  "purpose": "string"
}
```

#### Get Room Bookings
```http
GET /rooms/bookings
```
Response:
```json
[
  {
    "id": "uuid",
    "room": {
      "id": "uuid",
      "name": "string"
    },
    "startTime": "ISO8601",
    "endTime": "ISO8601",
    "purpose": "string",
    "status": "enum(pending, approved, rejected)",
    "bookedBy": {
      "id": "uuid",
      "name": "string"
    },
    "approvedBy": {
      "id": "uuid",
      "name": "string"
    }
  }
]
```

### OtiBersuara (Feedback)

#### Submit Feedback
```http
POST /oti-bersuara
```
Request body:
```json
{
  "message": "string",
  "category": "enum(grievance, suggestion, complaint, other)",
  "priority": "enum(low, medium, high)"
}
```

#### Get All Feedback (Human Development only)
```http
GET /oti-bersuara
```
Response:
```json
[
  {
    "id": "uuid",
    "message": "string",
    "category": "enum(grievance, suggestion, complaint, other)",
    "priority": "enum(low, medium, high)",
    "status": "enum(unread, read, in_progress, resolved)",
    "response": "string",
    "respondedBy": {
      "id": "uuid",
      "name": "string"
    }
  }
]
```

#### Respond to Feedback (Human Development only)
```http
PUT /oti-bersuara/:id/respond
```
Request body:
```json
{
  "response": "string",
  "status": "enum(read, in_progress, resolved)"
}
```

### Internal Affairs

#### Get Division Progress
```http
GET /internal-affairs/divisions
```
Response:
```json
{
  "totalDivisions": "integer",
  "activeDivisions": "integer",
  "averageProgress": "integer",
  "divisions": [
    {
      "id": "uuid",
      "name": "string",
      "type": "enum(main, managerial)",
      "head": {
        "id": "uuid",
        "name": "string"
      },
      "memberCount": "integer",
      "progress": "integer",
      "status": "enum(active, inactive)"
    }
  ]
}
```

## WebSocket Events

### Room Booking Updates
```json
{
  "type": "room_booking",
  "data": {
    "id": "uuid",
    "room": {
      "id": "uuid",
      "name": "string"
    },
    "startTime": "ISO8601",
    "endTime": "ISO8601",
    "status": "enum(pending, approved, rejected)"
  }
}
```

### OtiBersuara Updates
```json
{
  "type": "oti_bersuara",
  "data": {
    "id": "uuid",
    "message": "string",
    "category": "enum(grievance, suggestion, complaint, other)",
    "status": "enum(unread, read, in_progress, resolved)"
  }
}
```

### Division Updates
```json
{
  "type": "division",
  "data": {
    "id": "uuid",
    "name": "string",
    "progress": "integer",
    "status": "enum(active, inactive)"
  }
}
```

### Event Registration Updates
```json
{
  "type": "event_registration",
  "data": {
    "id": "uuid",
    "eventId": "uuid",
    "userId": "uuid",
    "role": "enum(academic_staff, participant)",
    "status": "enum(pending, approved, rejected)",
    "approvedBy": {
      "id": "uuid",
      "name": "string"
    }
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Something went wrong"
}
``` 