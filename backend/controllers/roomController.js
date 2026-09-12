const Room = require("../models/Room");

// =====================================================
// CREATE ROOM
// =====================================================

const createRoom = async (req, res) => {
    try {
        const room = await Room.create(req.body);

        res.status(201).json({
            message: "Room created successfully",
            room
        });

    } catch (error) {
        console.error("Create room error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};


// =====================================================
// GET ALL ROOMS
// =====================================================

const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();

        res.status(200).json({
            count: rooms.length,
            rooms
        });

    } catch (error) {
        console.error("Get rooms error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};


// =====================================================
// GET SINGLE ROOM
// =====================================================

const getRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        res.status(200).json(room);

    } catch (error) {
        console.error("Get room error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};


// =====================================================
// UPDATE ROOM
// =====================================================

const updateRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        res.status(200).json({
            message: "Room updated successfully",
            room
        });

    } catch (error) {
        console.error("Update room error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};


// =====================================================
// UPDATE ROOM AVAILABILITY
// =====================================================

const updateAvailability = async (req, res) => {
    try {
        const { availabilityStatus } = req.body;

        // Validate availability value
        if (
            !["Available", "Unavailable"].includes(
                availabilityStatus
            )
        ) {
            return res.status(400).json({
                message:
                    "Invalid availability status. Use Available or Unavailable."
            });
        }

        const room = await Room.findByIdAndUpdate(
            req.params.id,
            {
                availabilityStatus
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        res.status(200).json({
            message: "Room availability updated",
            room
        });

    } catch (error) {
        console.error(
            "Update availability error:",
            error.message
        );

        res.status(500).json({
            message: error.message
        });
    }
};


// =====================================================
// DEACTIVATE ROOM
// =====================================================

const deactivateRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.id,
            {
                availabilityStatus: "Unavailable"
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        res.status(200).json({
            message: "Room deactivated",
            room
        });

    } catch (error) {
        console.error(
            "Deactivate room error:",
            error.message
        );

        res.status(500).json({
            message: error.message
        });
    }
};


// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
    createRoom,
    getRooms,
    getRoom,
    updateRoom,
    updateAvailability,
    deactivateRoom
};