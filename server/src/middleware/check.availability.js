//checkAvailability
const Booking = require("../models/Booking")
const checkAvailability = async (req, res, next) => {
    try {
        const { checkIn, checkOut, roomId } = req.body;

        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const now = new Date();

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                message: "Invalid start or end date format",
            });
        }

        if (start < now) {
            return res.status(400).json({
                message: "Start date cannot be in the past",
            });
        }

        if (start >= end) {
            return res.status(400).json({
                message: "End date must be after start date",
            });
        }

        const overlappingBooking = await Booking.findOne({
            roomId,
            status: { $ne: "Cancelled" },
            checkIn: { $lt: end },
            checkOut: { $gt: start },
        });

        if (overlappingBooking) {
            return res.status(409).json({
                message: "Room is already booked for these dates",
            });
        }
        next();
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = checkAvailability