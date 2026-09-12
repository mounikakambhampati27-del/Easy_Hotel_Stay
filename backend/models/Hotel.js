const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
    {
        hotelId: {
            type: String,
            required: true,
            unique: true
        },

        organizationId: {
            type: String,
            required: true,
            default: "ORG001"
        },

        hotelName: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ""
        },

        contactNumber: {
            type: String,
            default: ""
        },

        email: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Hotel", hotelSchema);