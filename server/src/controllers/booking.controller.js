

const Booking = require("../models/Booking")

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
            totalPrice
        } = req.body;

        const newBooking = await Booking.create({
            userId: id,
            roomId,
            checkIn,
            checkOut,
            guests,
            totalPrice,
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
        const userBookings = await Booking.find({userId: id})
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
        const allowedFields = [
            "checkIn", "checkOut", "guests"
        ]
        const booking = await Booking.findOne({ _id: bookingId })
        const updates = Object.fromEntries(
            Object.entries(req.body).filter(
                ([key]) => allowedFields.includes(key)
            )
        )
        Object.assign(booking, updates)
        await booking.save();
        res.status(200).json({
            message: "Booking updated successfully",
            booking
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const cancelledBooking = await Booking.findOne({ _id: bookingId })
        if (!cancelledBooking) {
            return res.status(404).json({
                message: "No booking found to cancel"
            })
        }
        cancelledBooking.status = "Cancelled"
        await cancelledBooking.save()
        res.status(200).json({
            message: "Booking cancelled successfully",
            cancelledBooking
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}



module.exports = {
    getBookings, createBooking,
    getUserBookings, getRoomBookings,
    updateBooking, cancelBooking
}