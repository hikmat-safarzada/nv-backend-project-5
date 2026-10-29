const express = require("express");
const router = express.Router();
const checkAvailability = require("../middleware/check.availability");
const authorizeAdmin = require("../middleware/authorize.admin")
const {getBookings, getUserBookings,
    getRoomBookings, createBooking,
    updateBooking, cancelBooking
} = require("../controllers/booking.controller");
const verifyToken = require("../middleware/auth.middleware");

router.get("/user", verifyToken, getUserBookings);
router.get("/", verifyToken , authorizeAdmin , getBookings);
router.get("/rooms/:roomId", verifyToken, authorizeAdmin, getRoomBookings);


router.post("/", verifyToken, checkAvailability, createBooking);
router.patch("/:bookingId", verifyToken , updateBooking);
router.delete("/:bookingId", verifyToken , cancelBooking);

module.exports = router