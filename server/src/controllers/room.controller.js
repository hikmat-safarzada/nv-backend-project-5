// getRooms, getSingleRoom, createRoom, updateRoom, deleteRoom
const Room = require("../models/Room")


const getRooms = async (req, res) => {
    try {
        const { type, minPrice, maxPrice, capacity, page, limit } = req.query;

        let filter = {};

        if (type) {
            filter.type = type;
        }

        if (minPrice || maxPrice) {
            filter.pricePerNight = {};

            if (minPrice) {
                filter.pricePerNight.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.pricePerNight.$lte = Number(maxPrice);
            }
        }

        if (capacity) {
            filter.capacity = Number(capacity);
        }

        const currentPage = Number(page) || 1;
        const roomsPerPage = Number(limit) || 10;

        if (currentPage < 1 || roomsPerPage < 1) {
            return res.status(400).json({
                message: "Page and limit must be positive numbers"
            });
        }

        const skipRooms = (currentPage - 1) * roomsPerPage;

        const totalRooms = await Room.countDocuments(filter);
        const totalPages = Math.ceil(totalRooms / roomsPerPage);

        const rooms = await Room.find(filter)
            .skip(skipRooms)
            .limit(roomsPerPage);

        res.status(200).json({
            message: "Rooms",
            currentPage,
            roomsPerPage,
            totalRooms,
            totalPages,
            rooms
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getSingleRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findOne({ _id: roomId });
        if (!room) {
            return res.status(404).json({
                message: "No room found"
            })
        }

        res.status(200).json({
            message: "Room",
            room
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const createRoom = async (req, res) => {
    try {
        const { roomNumber, type, pricePerNight,
            capacity, description, available } = req.body
        const newRoom = await Room.create({
            roomNumber,
            type,
            pricePerNight,
            capacity,
            description,
            available
        })
        res.status(201).json({
            message: "Room created successfully!",
            newRoom
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const deleteRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const deletedRoom = await Room.findByIdAndDelete(roomId);
        if (!deletedRoom) {
            return res.status(404).json({
                message: "No room deleted"
            })
        }
        res.status(200).json({
            message: "Room Deleted Successfully",
            deletedRoom
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const updateRoom = async (req, res) => {
    try {
        const { roomId } = req.params
        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            req.body,
            { new: true, runValidators: true }
        )
        res.status(201).json({
            message: "Room updated successfully!",
            updatedRoom
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {
    getRooms, getSingleRoom,
    createRoom, deleteRoom,
    updateRoom
}