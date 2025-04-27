# OmahTI API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Users](#users)
3. [Divisions](#divisions)
4. [Events](#events)
5. [Calendar](#calendar)
6. [Rooms](#rooms)
7. [OtiBersuara](#oti-bersuara)
8. [Internal Affairs](#internal-affairs)
9. [Error Handling](#error-handling)
10. [Models](#models)
11. [WebSocket Events](#websocket-events)

## Base URL
```
http://localhost:3000/api
```

## Authentication

### JWT Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Register New User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "string",
  "password": "string (min 6 chars)",
  "name": "string"
}

Response 201:
{
  "message": "User registered successfully",
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "role": "enum(admin, ceo, head, member)"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response 200:
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "role": "string"
  }
}
```

#### Google OAuth
```http
GET /auth/google
```
Redirects to Google login

```http
GET /auth/google/callback
```
Callback URL for Google OAuth. Redirects to frontend with token.

## Users

### Get User Profile
```http
GET /users/profile
Authorization: Bearer <token>

Response 200:
{
  "id": "uuid",
  "email": "string",
  "name": "string",
  "role": "string",
  "mainDivision": {
    "id": "uuid",
    "name": "string",
    "type": "string"
  },
  "managerialDivision": {
    "id": "uuid",
    "name": "string",
    "type": "string"
  }
}
```

### Update User Profile
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "mainDivision": "uuid",
  "managerialDivision": "uuid"
}

Response 200:
{
  "message": "Profile updated successfully",
  "user": {
    "id": "uuid",
    "name": "string",
    "mainDivision": "uuid",
    "managerialDivision": "uuid",
    "divisionStatus": "pending"
  }
}
```

### Get Available Times
```http
GET /users/available-times
Authorization: Bearer <token>

Response 200:
{
  "monday": ["09:00-12:00", "14:00-17:00"],
  "tuesday": ["09:00-12:00", "14:00-17:00"],
  ...
}
```

### Update Available Times
```http
PUT /users/available-times
Authorization: Bearer <token>
Content-Type: application/json

{
  "availableTimes": {
    "monday": ["09:00-12:00", "14:00-17:00"],
    "tuesday": ["09:00-12:00", "14:00-17:00"]
  }
}

Response 200:
{
  "message": "Available times updated successfully",
  "availableTimes": {
    "monday": ["09:00-12:00", "14:00-17:00"],
    "tuesday": ["09:00-12:00", "14:00-17:00"]
  }
}
```

### List All Users (Admin Only)
```http
GET /users
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "role": "string",
    "mainDivision": {},
    "managerialDivision": {}
  }
]
```

## Divisions

### Get All Divisions
```http
GET /divisions
Authorization: Bearer <token>

Response 200:
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

### Get Division by ID
```http
GET /divisions/:id
Authorization: Bearer <token>

Response 200:
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
      "role": "string"
    }
  ],
  "status": "string",
  "progress": "integer"
}
```

### Create Division (Admin Only)
```http
POST /divisions
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "type": "enum(main, managerial)",
  "description": "string",
  "headId": "uuid",
  "parentDivisionId": "uuid"
}

Response 201:
{
  "id": "uuid",
  "name": "string",
  "type": "string",
  "description": "string",
  "headId": "uuid",
  "status": "active"
}
```

### Update Division
```http
PUT /divisions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "headId": "uuid",
  "status": "enum(active, inactive)"
}

Response 200:
{
  "message": "Division updated successfully",
  "division": {}
}
```

### Delete Division (Admin Only)
```http
DELETE /divisions/:id
Authorization: Bearer <token>

Response 200:
{
  "message": "Division deleted successfully"
}
```

## Events

### Get All Events
```http
GET /events
Authorization: Bearer <token>

Response 200:
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

### Get Event by ID
```http
GET /events/:id
Authorization: Bearer <token>

Response 200:
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "startTime": "ISO8601",
  "endTime": "ISO8601",
  "type": "string",
  "status": "string",
  "role": "string",
  "creator": {
    "id": "uuid",
    "name": "string"
  },
  "division": {
    "id": "uuid",
    "name": "string"
  }
}
```

### Create Event
```http
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "startTime": "ISO8601",
  "endTime": "ISO8601",
  "type": "enum(main_event, meeting, training, project)",
  "role": "enum(head_coordinator, coordinator, sub_coordinator, staff)",
  "divisionId": "uuid",
  "isMandatory": "boolean",
  "location": "string"
}

Response 201:
{
  "id": "uuid",
  "title": "string",
  "status": "pending",
  ...
}
```

### Update Event
```http
PUT /events/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "status": "enum(pending, approved, rejected)",
  ...
}

Response 200:
{
  "message": "Event updated successfully",
  "event": {}
}
```

### Delete Event
```http
DELETE /events/:id
Authorization: Bearer <token>

Response 200:
{
  "message": "Event deleted successfully"
}
```

## Calendar

### Get Organization Calendar
```http
GET /calendar
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "uuid",
    "title": "string",
    "startTime": "ISO8601",
    "endTime": "ISO8601",
    "creator": {},
    "division": {}
  }
]
```

### Get Division Calendar
```http
GET /calendar/division/:id
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "uuid",
    "title": "string",
    "startTime": "ISO8601",
    "endTime": "ISO8601",
    "creator": {},
    "division": {}
  }
]
```

### Get User Calendar
```http
GET /calendar/user/:id
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "uuid",
    "title": "string",
    "startTime": "ISO8601",
    "endTime": "ISO8601",
    "creator": {},
    "division": {}
  }
]
```

### Get Events by Date Range
```http
GET /calendar/range
Authorization: Bearer <token>
Content-Type: application/json

{
  "startDate": "ISO8601",
  "endDate": "ISO8601"
}

Response 200:
[
  {
    "id": "uuid",
    "title": "string",
    "startTime": "ISO8601",
    "endTime": "ISO8601",
    ...
  }
]
```

### Get Mandatory Events
```http
GET /calendar/mandatory
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "uuid",
    "title": "string",
    "startTime": "ISO8601",
    "endTime": "ISO8601",
    "isMandatory": true,
    ...
  }
]
```

## Rooms

### Get All Rooms
```http
GET /rooms
Authorization: Bearer <token>

Response 200:
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

### Book Room
```http
POST /rooms/book
Authorization: Bearer <token>
Content-Type: application/json

{
  "roomId": "uuid",
  "startTime": "ISO8601",
  "endTime": "ISO8601",
  "purpose": "string"
}

Response 201:
{
  "id": "uuid",
  "status": "pending",
  "roomId": "uuid",
  "bookedBy": "uuid"
}
```
### List Room Bookings
```http
GET /rooms/bookings
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "uuid",
    "roomId": "uuid",
    "startTime": "ISO8601",
    "endTime": "ISO8601",
    "purpose": "string",
    "status": "enum(pending, approved, rejected)",
    "bookedBy": {},
    "approvedBy": {}
  }
]
```

### Approve Room Booking
```http
PUT /rooms/bookings/:id/approve
Authorization: Bearer <token>

Response 200:
{
  "message": "Booking approved successfully",
  "booking": {}
}
```

## Internal Affairs

### Get Division Progress
```http
GET /internal-affairs/divisions
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "uuid",
    "name": "string",
    "type": "string",
    "head": {},
    "memberCount": "integer",
    "progress": "integer",
    "tasks": [],
    "status": "string"
  }
]
```

### Update Division Tasks
```http
PUT /internal-affairs/divisions/:id/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "tasks": [
    {
      "title": "string",
      "description": "string",
      "deadline": "ISO8601",
      "status": "enum(not_started, in_progress, finished)"
    }
  ]
}

Response 200:
{
  "message": "Tasks updated successfully",
  "division": {}
}
```

### Get Division Report
```http
GET /internal-affairs/divisions/:id/report
Authorization: Bearer <token>

Response 200:
{
  "id": "uuid",
  "name": "string",
  "type": "string",
  "head": {},
  "memberCount": "integer",
  "progress": "integer",
  "tasks": [],
  "status": "string",
  "members": [],
  "managerialMembers": []
}
```

### Get Organization Report
```http
GET /internal-affairs/reports
Authorization: Bearer <token>

Response 200:
{
  "totalDivisions": "integer",
  "activeDivisions": "integer",
  "averageProgress": "integer",
  "divisions": [],
  "progressByType": {
    "main": "integer",
    "managerial": "integer"
  }
}
```

## Models

### User Model
```typescript
{
  id: UUID,
  email: string,
  password: string (hashed),
  name: string,
  role: enum(admin, ceo, cfo, head, member),
  mainDivisionId: UUID,
  managerialDivisionId: UUID,
  divisionStatus: enum(pending, confirmed, rejected),
  headApprovalStatus: enum(pending, approved, rejected),
  approvedBy: UUID,
  availableTimes: JSON,
  googleId: string
}
```

### Division Model
```typescript
{
  id: UUID,
  name: string,
  type: enum(main, managerial),
  description: text,
  headId: UUID,
  status: enum(active, inactive),
  parentDivisionId: UUID,
  tasks: JSON,
  progress: integer(0-100)
}
```

### Event Model
```typescript
{
  id: UUID,
  title: string,
  description: text,
  startTime: datetime,
  endTime: datetime,
  type: enum(main_event, meeting, training, project),
  status: enum(pending, approved, rejected),
  role: enum(head_coordinator, coordinator, sub_coordinator, staff),
  createdBy: UUID,
  divisionId: UUID,
  projectId: UUID,
  isMandatory: boolean,
  location: string,
  attendees: JSON
}
```

### Room Model
```typescript
{
  id: UUID,
  name: string,
  capacity: integer,
  facilities: JSON,
  status: enum(available, occupied, maintenance)
}
```

### RoomBooking Model
```typescript
{
  id: UUID,
  roomId: UUID,
  startTime: datetime,
  endTime: datetime,
  purpose: text,
  status: enum(pending, approved, rejected),
  bookedBy: UUID,
  approvedBy: UUID
}
```

### OtiBersuara Model
```typescript
{
  id: UUID,
  message: text,
  category: enum(grievance, suggestion, complaint, other),
  status: enum(unread, read, in_progress, resolved),
  priority: enum(low, medium, high),
  response: text,
  respondedBy: UUID,
  respondedAt: datetime
}
```

## Error Handling

### Error Response Format
```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "field_name",
      "message": "error description"
    }
  ]
}
```

### Common Error Codes
- 400: Bad Request (Invalid input)
- 401: Unauthorized (Invalid/missing token)
- 403: Forbidden (Insufficient permissions)
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## WebSocket Events

### Connection
```javascript
ws://localhost:3000/ws
```

### Event Types
- `user_update`: User data updates
- `division_update`: Division changes
- `event_update`: Event status changes
- `booking_update`: Room booking status changes
- `notification`: System notifications 
