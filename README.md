# Organization Management Backend

A comprehensive backend API for managing organization members, divisions, and events.

## Features

### User Management
- User authentication with JWT
- Role-based access control (admin, ceo, cfo, head, member)
- User profile management
- Available time tracking
- Division membership management
- User data structure:
  ```json
  {
    "id": "uuid",
    "email": "string",
    "password": "hashed",
    "name": "string",
    "role": "enum(admin, ceo, cfo, head, member)",
    "main_division_id": "uuid",
    "managerial_division_id": "uuid",
    "division_status": "enum(pending, confirmed, rejected)",
    "head_approval_status": "enum(pending, approved, rejected)",
    "available_times": "jsonb",
    "google_id": "string"
  }
  ```

### Division Management
- Two types of divisions:
  - Main divisions (Cybersecurity, Data Science, Front End, Back End, UI/UX)
  - Managerial divisions (Research and Competition, Resource Manager, Creative and Design, Internal Affairs)
- Division hierarchy support
- Division head assignment
- Division status tracking
- Division progress monitoring
- Member management within divisions
- Division data structure:
  ```json
  {
    "id": "uuid",
    "name": "string",
    "type": "enum(main, managerial)",
    "description": "text",
    "head_id": "uuid",
    "parent_division_id": "uuid",
    "status": "enum(active, inactive)",
    "tasks": "jsonb",
    "progress": "integer(0-100)"
  }
  ```

### Event Management
- Event creation and management
- Role-based event participation (head_coordinator, coordinator, sub_coordinator, staff)
- Event status tracking (pending, approved, rejected, completed)
- Event creator tracking
- Event listing and filtering
- Event data structure:
  ```json
  {
    "id": "uuid",
    "title": "string",
    "description": "text",
    "status": "enum(pending, approved, rejected, completed)",
    "created_by": "uuid",
    "role": "enum(head_coordinator, coordinator, sub_coordinator, staff)"
  }
  ```

### Room Management
- Room listing and availability checking
- Room booking system
- Booking approval workflow
- Conflict detection for bookings
- Room status tracking
- Room data structure:
  ```json
  {
    "id": "uuid",
    "name": "string",
    "capacity": "integer",
    "status": "enum(available, booked, maintenance)"
  }
  ```
- Room Booking data structure:
  ```json
  {
    "id": "uuid",
    "room_id": "uuid",
    "start_time": "timestamp",
    "end_time": "timestamp",
    "purpose": "string",
    "booked_by": "uuid",
    "approved_by": "uuid",
    "status": "enum(pending, approved, rejected)"
  }
  ```

### Calendar Management
- Organization-wide calendar view
- Division-specific calendar view
- User-specific calendar view
- Date range-based event filtering
- Future event tracking
- Calendar endpoints:
  - Organization calendar: All approved events
  - Division calendar: Events for specific division
  - User calendar: Events where user is participant or in their division
  - Date range: Events within specified date range

### Internal Affairs
- Division progress tracking
- Task management
- Progress reporting
- Organization-wide statistics
- Division performance metrics
- Report data structure:
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
        "head": "user object",
        "memberCount": "integer",
        "progress": "integer",
        "status": "enum(active, inactive)"
      }
    ],
    "progressByType": {
      "main": "integer",
      "managerial": "integer"
    }
  }
  ```

### Security Features
- JWT-based authentication
- Password hashing
- Role-based authorization
- Input validation
- Error handling
- Authentication flow:
  1. User registers with email and password
  2. Password is hashed using bcrypt
  3. JWT token is generated on successful login
  4. Token is required for all protected routes
  5. Role-based middleware checks user permissions

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login user
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- POST `/api/auth/register` - Register new user
  ```json
  {
    "email": "string",
    "password": "string",
    "name": "string"
  }
  ```

### Users
- GET `/api/users` - Get all users (admin only)
- GET `/api/users/:id` - Get user by ID
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile
  ```json
  {
    "name": "string",
    "main_division_id": "uuid",
    "managerial_division_id": "uuid"
  }
  ```
- GET `/api/users/available-times` - Get user's available times
- PUT `/api/users/available-times` - Update user's available times
  ```json
  {
    "availableTimes": {
      "monday": ["09:00-12:00", "14:00-17:00"],
      "tuesday": ["09:00-12:00", "14:00-17:00"]
    }
  }
  ```

### Divisions
- GET `/api/divisions` - Get all divisions
- GET `/api/divisions/:id` - Get division by ID
- POST `/api/divisions` - Create new division (admin only)
  ```json
  {
    "name": "string",
    "type": "enum(main, managerial)",
    "description": "string",
    "head_id": "uuid",
    "parent_division_id": "uuid"
  }
  ```
- PUT `/api/divisions/:id` - Update division
- DELETE `/api/divisions/:id` - Delete division

### Events
- GET `/api/events` - Get all events
- GET `/api/events/:id` - Get event by ID
- POST `/api/events` - Create new event
  ```json
  {
    "title": "string",
    "description": "text",
    "role": "enum(head_coordinator, coordinator, sub_coordinator, staff)"
  }
  ```
- PUT `/api/events/:id` - Update event
- DELETE `/api/events/:id` - Delete event

### Calendar
- GET `/api/calendar` - Get organization calendar
- GET `/api/calendar/division/:id` - Get division calendar
- GET `/api/calendar/user/:id` - Get user's calendar
- GET `/api/calendar/range` - Get events by date range
  ```json
  {
    "startDate": "ISO8601",
    "endDate": "ISO8601"
  }
  ```

### Rooms
- GET `/api/rooms` - Get all rooms
- POST `/api/rooms/book` - Book a room
  ```json
  {
    "roomId": "uuid",
    "startTime": "ISO8601",
    "endTime": "ISO8601",
    "purpose": "string"
  }
  ```
- GET `/api/rooms/bookings` - List room bookings
- PUT `/api/rooms/bookings/:id/approve` - Approve room booking

### Internal Affairs
- GET `/api/internal-affairs/divisions` - List division progress
- PUT `/api/internal-affairs/divisions/:id/tasks` - Update division tasks
  ```json
  {
    "tasks": [
      {
        "title": "string",
        "description": "string",
        "status": "enum(pending, in_progress, completed)",
        "dueDate": "ISO8601"
      }
    ]
  }
  ```
- GET `/api/internal-affairs/reports` - Generate progress reports

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone https://github.com/Shazaw/org-management-backend.git
cd org-management-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=org_management
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
```

4. Run migrations:
```bash
npm run migrate
```

5. Seed the database:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

## Testing

The project includes test scripts to verify system functionality:

1. Authentication Test:
```bash
node src/test-auth.js
```

2. System Test:
```bash
node src/test-system.js
```

## License

MIT 