# Hotel Booking System API

A RESTful backend API for a hotel booking system built with Node.js, Express.js, and MongoDB. The project includes authentication, role-based access control, room management, booking management, filtering, pagination, and booking availability validation.

## Features

- User registration, login, and logout
- JWT-based authentication
- Role-based authorization for users and administrators
- Room CRUD operations
- Booking creation, retrieval, updating, and cancellation
- Room availability checks to prevent overlapping bookings
- Automatic booking price calculation
- Room filtering by type, price range, and capacity
- Pagination for room listings
- Request validation using Joi
- MongoDB database integration

## Technologies

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- Joi
- dotenv
- Postman

## Project Structure

```text
nv-project-5/
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── validations/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
└── README.md
```

The exact structure may vary depending on the implementation.

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd nv-project-5
```

### 2. Navigate to the backend directory

```bash
cd server
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server` directory and add the environment variables required by your configuration.

Example:

```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Use the exact variable names expected by your project.

### 5. Start the server

```bash
npm start
```

For development, use the following command if your `package.json` includes a `dev` script:

```bash
npm run dev
```

## API Endpoints

The examples below assume that the routes are mounted under `/api/auth`, `/api/rooms`, and `/api/bookings`. Adjust the paths if your application uses different prefixes.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out |

New registrations receive the regular `user` role. Administrator privileges are assigned separately.

### Rooms

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/rooms` | Authenticated users |
| GET | `/api/rooms/:roomId` | Authenticated users |
| POST | `/api/rooms` | Admin |
| PATCH | `/api/rooms/:roomId` | Admin |
| DELETE | `/api/rooms/:roomId` | Admin |

#### Filtering and Pagination

The room listing supports query parameters for filtering and pagination.

Example:

```http
GET /api/rooms?type=Double&minPrice=50&maxPrice=200&capacity=2&page=1&limit=10
```

Available parameters:

- `type` — filter by room type
- `minPrice` — minimum price per night
- `maxPrice` — maximum price per night
- `capacity` — room capacity
- `page` — page number
- `limit` — number of rooms per page

### Bookings

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/bookings` | Authenticated users |
| GET | `/api/bookings` | Admin |
| GET | `/api/bookings/user` | Authenticated users |
| GET | `/api/bookings/room/:roomId` | Admin |
| PATCH | `/api/bookings/:bookingId` | Booking owner or authorized admin |
| DELETE | `/api/bookings/:bookingId` | Booking owner or authorized admin |

### Create Booking Example

Example request body:

```json
{
  "roomId": "YOUR_ROOM_ID",
  "checkIn": "2026-11-10",
  "checkOut": "2026-11-15",
  "guests": 2
}
```

The server validates the dates, checks room availability, and calculates the total booking price based on the room's price per night and the number of nights.

## Testing

The API can be tested using Postman.

Recommended test cases:

- Register a new user and log in.
- Verify that regular users cannot access admin-only endpoints.
- Create and manage rooms as an administrator.
- Create bookings for available rooms.
- Verify that overlapping bookings are rejected.
- Check booking price calculations.
- Verify that users cannot update or cancel other users' bookings.
- Test filtering and pagination.
- Test invalid dates and guest counts.

## Security

- Passwords should be stored as hashes.
- JWT secrets and database credentials must be stored in environment variables.
- Users must not be able to assign themselves the admin role during registration.
- Incoming request data should be validated.
- Booking ownership must be checked before updates and cancellations.
- The `.env` file must not be committed to GitHub.

## Deployment

The API can be deployed to a Node.js-compatible hosting platform such as Render and connected to MongoDB Atlas.

Before deployment:

1. Configure production environment variables.
2. Set `NODE_ENV=production`.
3. Configure secure cookie settings if authentication uses cookies.
4. Configure CORS if the frontend is hosted separately.
5. Verify the database connection.
6. Test the live API endpoints after deployment.

## License

This project was developed for backend development practice and educational purposes.
