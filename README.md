# Organization Management Backend

A backend API for managing organization members, divisions, and events.

## Features

- User authentication with JWT
- Division management (main and managerial divisions)
- Event management
- Role-based access control
- PostgreSQL database

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
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

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login user
- POST `/api/auth/register` - Register new user

### Users
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

### Divisions
- GET `/api/divisions` - Get all divisions
- GET `/api/divisions/:id` - Get division by ID
- POST `/api/divisions` - Create new division
- PUT `/api/divisions/:id` - Update division
- DELETE `/api/divisions/:id` - Delete division

### Events
- GET `/api/events` - Get all events
- GET `/api/events/:id` - Get event by ID
- POST `/api/events` - Create new event
- PUT `/api/events/:id` - Update event
- DELETE `/api/events/:id` - Delete event

## License

MIT 