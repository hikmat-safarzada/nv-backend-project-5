const Booking = require("../models/Booking")
const Room = require("../models/Room")
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json({
            message: "Bookings",
            bookings
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const createBooking = async (req, res) => {
    try {
        const { id } = req.user;
        const {
            roomId,
            checkIn,
            checkOut,
            guests,
        } = req.body;

        const startDay = new Date(checkIn);
        const endDay = new Date(checkOut);
        const days = (endDay - startDay) / (1000 * 60 * 60 * 24);

        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        const total = days * room.pricePerNight
        const newBooking = await Booking.create({
            userId: id,
            roomId,
            checkIn,
            checkOut,
            guests,
            totalPrice: total,
            status: "Confirmed"
        });

        return res.status(201).json({
            message: "Booking created successfully",
            newBooking
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const { id } = req.user
        const userBookings = await Booking.find({ userId: id })
        res.status(200).json({
            message: "User bookings",
            userBookings
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getRoomBookings = async (req, res) => {
    try {
        const { roomId } = req.params;
        const roomBookings = await Booking.find({ roomId });
        res.status(200).json({
            message: "Room bookings",
            roomBookings
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const updateBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { id, role } = req.user;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (
            role !== "admin" &&
            booking.userId.toString() !== id.toString()
        ) {
            return res.status(403).json({
                message: "You cannot update this booking"
            });
        }

        if (booking.status === "Cancelled") {
            return res.status(400).json({
                message: "Cancelled booking cannot be updated"
            });
        }

        const allowedFields = [
            "checkIn", "checkOut", "guests"
        ];

        const updates = Object.fromEntries(
            Object.entries(req.body).filter(
                ([key]) => allowedFields.includes(key)
            )
        );
        const checkIn = updates.checkIn ?? booking.checkIn;
        const checkOut = updates.checkOut ?? booking.checkOut;
        const guests = updates.guests ?? booking.guests;

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        if (
            isNaN(start.getTime()) ||
            isNaN(end.getTime())
        ) {
            return res.status(400).json({
                message: "Invalid date format"
            });
        }

        if (start < new Date()) {
            return res.status(400).json({
                message: "Check-in date cannot be in the past"
            });
        }

        if (start >= end) {
            return res.status(400).json({
                message: "Check-out must be after check-in"
            });
        }

        if (!Number.isInteger(Number(guests)) || Number(guests) < 1) {
            return res.status(400).json({
                message: "Guests must be a positive whole number"
            });
        }

        const room = await Room.findById(booking.roomId);

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        if (Number(guests) > room.capacity) {
            return res.status(400).json({
                message: "Guest count exceeds room capacity"
            });
        }

        const overlappingBooking = await Booking.findOne({
            _id: { $ne: booking._id },
            roomId: booking.roomId,
            status: { $ne: "Cancelled" },
            checkIn: { $lt: end },
            checkOut: { $gt: start }
        });

        if (overlappingBooking) {
            return res.status(409).json({
                message: "Room is already booked for these dates"
            });
        }

        const days = (end - start) / (1000 * 60 * 60 * 24);
        const total = days * room.pricePerNight;

        booking.checkIn = start;
        booking.checkOut = end;
        booking.guests = Number(guests);
        booking.totalPrice = total;

        await booking.save();

        res.status(200).json({
            message: "Booking updated successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { id, role } = req.user;

        const cancelledBooking = await Booking.findById(bookingId);

        if (!cancelledBooking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (
            role !== "admin" &&
            cancelledBooking.userId.toString() !== id
        ) {
            return res.status(403).json({
                message: "You cannot cancel this booking"
            });
        }

        cancelledBooking.status = "Cancelled";
        await cancelledBooking.save();

        res.status(200).json({
            message: "Booking cancelled successfully",
            cancelledBooking
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



module.exports = {
    getBookings, createBooking,
    getUserBookings, getRoomBookings,
    updateBooking, cancelBooking
}