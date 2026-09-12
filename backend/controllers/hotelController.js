const Hotel = require("../models/Hotel");

// Create hotel
const createHotel = async (req, res) => {
    try {
        const hotel = await Hotel.create(req.body);

        res.status(201).json({
            message: "Hotel created successfully",
            hotel
        });
    } catch (error) {
        console.error("Create hotel error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};

// Get hotel
const getHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findOne();

        if (!hotel) {
            return res.status(404).json({
                message: "Hotel not found"
            });
        }

        res.status(200).json(hotel);

    } catch (error) {
        console.error("Get hotel error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};

// Update hotel
const updateHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findOneAndUpdate(
            {},
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!hotel) {
            return res.status(404).json({
                message: "Hotel not found"
            });
        }

        res.status(200).json({
            message: "Hotel updated successfully",
            hotel
        });

    } catch (error) {
        console.error("Update hotel error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createHotel,
    getHotel,
    updateHotel
};