const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    type: {
        type: String,
        enum: ["Single", "Double", "Suite", "Deluxe"],
        required: true

    },
    pricePerNight: {
        type: Number,
        min: 0,
        required: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    available: {
        type: Boolean,
        default: true
    }
}, 
{
    timestamps: true
})

module.exports = mongoose.model("Room", roomSchema);