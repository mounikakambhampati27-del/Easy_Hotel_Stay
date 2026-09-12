const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        bookingId: {
            type: String,
            required: true,
            unique: true
        },

        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
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

        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },

        checkInDate: {
            type: Date,
            required: true
        },

        checkOutDate: {
            type: Date,
            required: true
        },

        numberOfGuests: {
            type: Number,
            required: true,
            min: 1
        },

        bookingDate: {
            type: Date,
            default: Date.now
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        bookingStatus: {
            type: String,
            enum: [
                "CONFIRMED",
                "CANCELLED",
                "COMPLETED"
            ],
            default: "CONFIRMED"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Booking",
    bookingSchema
);