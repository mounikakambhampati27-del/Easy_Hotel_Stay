const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        roomId: {
            type: String,
            required: true,
            unique: true
        },

        organizationId: {
            type: String,
            required: true,
            default: "ORG001"
        },

        hotelId: {
            type: String,
            required: true
        },

        roomNumber: {
            type: String,
            required: true,
            unique: true
        },

        roomType: {
            type: String,
            required: true
        },

        capacity: {
            type: Number,
            required: true,
            min: 1
        },

        pricePerNight: {
            type: Number,
            required: true,
            min: 0
        },

        availabilityStatus: {
            type: String,
            enum: ["Available", "Unavailable"],
            default: "Available"
        },

        description: {
            type: String,
            default: ""
        },

        amenities: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Room", roomSchema);