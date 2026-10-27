const express = require("express");
const cookieParser = require("cookie-parser")
const app = express();
const authRouter = require("./auth.route")
const roomRouter = require("./room.route")
const bookingRouter = require("./booking.route")
app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", authRouter);
app.use("/api/rooms", roomRouter)
app.use("/api/bookings", bookingRouter)
module.exports = app