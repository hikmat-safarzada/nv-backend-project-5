# Hotel Booking System API

A backend REST API for a hotel booking system built with Node.js, Express.js, and MongoDB. The application supports user authentication, role-based authorization, room management, and hotel bookings with date availability checks.

## Features

- **Authentication:** User registration and login using JWT and password hashing.
- **Role-Based Authorization:** Separate permissions for regular users and administrators.
- **Room Management:** Create, retrieve, update, and delete rooms.
- **Booking Management:** Create, view, update, and cancel bookings.
- **Booking Availability:** Prevent overlapping bookings for the same room.
- **Automatic Pricing:** Calculate booking prices on the server based on the room's nightly price and booking duration.
- **Filtering:** Filter rooms by type, price range, and capacity.
- **Pagination:** Retrieve rooms in pages using `page` and `limit` query parameters.
- **Data Validation:** Validate incoming requests.
- **Database Integration:** Store users, rooms, and bookings in MongoDB.

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- Joi
- dotenv
- Postman

## Project Structure

```text
nv-project-5/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── validations/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

The exact file structure may differ depending on your implementation.

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd nv-project-5
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

Use the environment variable names expected by your actual configuration files.

### 4. Start the server

```bash
npm start
```

If you use Nodemon during development, you can also run:

```bash
npm run dev
```

The API will run on your configured port.

## API Endpoints

Base URL:

```text
http://localhost:8080
```

The examples below use `/api/auth`, `/api/rooms`, and `/api/bookings` as base paths. Adjust them to match your Express route mounting.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out |

New registrations receive the regular `user` role. Administrator privileges should be assigned separately by a trusted administrator.

### Rooms

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/rooms` | Authenticated users |
| GET | `/api/rooms/:roomId` | Authenticated users |
| POST | `/api/rooms` | Admin |
| PATCH | `/api/rooms/:roomId` | Admin |
| DELETE | `/api/rooms/:roomId` | Admin |

Room listing supports filtering and pagination through query parameters, including:

```text
GET /api/rooms?type=Double&minPrice=50&maxPrice=200&capacity=2&page=1&limit=10
```

Use the values supported by your room schema.

### Bookings

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/bookings` | Authenticated users |
| GET | `/api/bookings` | Admin |
| GET | `/api/bookings/user` | Authenticated user |
| GET | `/api/bookings/room/:roomId` | Admin |
| PATCH | `/api/bookings/:bookingId` | Booking owner or authorized admin |
| DELETE | `/api/bookings/:bookingId` | Booking owner or authorized admin |

Booking creation checks room availability and calculates the total price on the server. The application should reject overlapping bookings and prevent users from modifying bookings belonging to other users.

## Booking Example

Example request body for creating a booking:

```json
{
  "roomId": "YOUR_ROOM_ID",
  "checkIn": "2026-11-10",
  "checkOut": "2026-11-15",
  "guests": 2
}
```

The server calculates `totalPrice` using the room's nightly price and the number of nights.

## Testing

API endpoints can be tested using Postman.

Recommended test cases:

- Register a new user and log in.
- Verify that a regular user cannot access admin-only endpoints.
- Create, retrieve, update, and delete rooms as an admin.
- Create a booking for an available room.
- Attempt to book the same room for overlapping dates.
- Verify that booking prices are calculated by the server.
- Test booking ownership when updating or cancelling a booking.
- Test room filters and pagination.
- Verify invalid dates and invalid guest counts are rejected.

## Security

- Store passwords as hashes rather than plain text.
- Keep JWT secrets and database credentials in environment variables.
- Do not allow users to assign themselves the admin role during registration.
- Validate and restrict incoming request fields.
- Verify booking ownership before allowing updates or cancellation.
- Do not commit `.env` or other secrets to GitHub.

## Deployment

The application can be deployed to a Node.js-compatible hosting platform and connected to MongoDB Atlas.

Before deployment:

1. Configure production environment variables.
2. Set `NODE_ENV=production`.
3. Configure secure cookie settings if JWT authentication uses cookies.
4. Configure CORS appropriately if the frontend is hosted separately.
5. Verify that the deployed API can connect to MongoDB.
6. Test authentication, authorization, room management, and booking availability in production.

## License

This project was created for learning and backend development practice.
