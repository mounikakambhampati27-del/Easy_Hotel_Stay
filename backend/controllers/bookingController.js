const Booking = require("../models/Booking");
const Room = require("../models/Room");


// =====================================================
// SEARCH AVAILABLE ROOMS
// =====================================================

const searchAvailableRooms = async (req, res) => {
    try {
        const {
            checkInDate,
            checkOutDate,
            numberOfGuests
        } = req.query;

        if (!checkInDate || !checkOutDate || !numberOfGuests) {
            return res.status(400).json({
                message:
                    "checkInDate, checkOutDate and numberOfGuests are required"
            });
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const guests = Number(numberOfGuests);

        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            return res.status(400).json({
                message: "Invalid date format"
            });
        }

        if (checkOut <= checkIn) {
            return res.status(400).json({
                message: "Check-out must be after check-in"
            });
        }

        if (guests < 1) {
            return res.status(400).json({
                message: "Number of guests must be at least 1"
            });
        }

        // First find rooms that are active/available
        // and have enough capacity.
        const rooms = await Room.find({
            availabilityStatus: "Available",
            capacity: { $gte: guests }
        });

        const availableRooms = [];

        // Check every room against existing bookings
        for (const room of rooms) {

            const conflictingBooking = await Booking.findOne({
                roomId: room._id,
                bookingStatus: "CONFIRMED",

                // Overlap condition:
                // existing check-in < requested check-out
                // AND
                // existing check-out > requested check-in
                checkInDate: { $lt: checkOut },
                checkOutDate: { $gt: checkIn }
            });

            if (!conflictingBooking) {
                availableRooms.push(room);
            }
        }

        res.status(200).json({
            search: {
                checkInDate,
                checkOutDate,
                numberOfGuests: guests
            },

            count: availableRooms.length,

            rooms: availableRooms
        });

    } catch (error) {
        console.error("Search rooms error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};


// =====================================================
// CREATE BOOKING
// =====================================================

const createBooking = async (req, res) => {
    try {
        const {
            roomId,
            hotelId,
            organizationId,
            checkInDate,
            checkOutDate,
            numberOfGuests
        } = req.body;

        if (
            !roomId ||
            !hotelId ||
            !checkInDate ||
            !checkOutDate ||
            !numberOfGuests
        ) {
            return res.status(400).json({
                message:
                    "roomId, hotelId, checkInDate, checkOutDate and numberOfGuests are required"
            });
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const guests = Number(numberOfGuests);

        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            return res.status(400).json({
                message: "Invalid date format"
            });
        }

        if (checkOut <= checkIn) {
            return res.status(400).json({
                message: "Check-out must be after check-in"
            });
        }

        if (guests < 1) {
            return res.status(400).json({
                message: "Number of guests must be at least 1"
            });
        }

        // Find room
        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        // Inactive/unavailable rooms cannot be booked
        if (room.availabilityStatus !== "Available") {
            return res.status(400).json({
                message: "This room is currently unavailable"
            });
        }

        // Capacity check
        if (guests > room.capacity) {
            return res.status(400).json({
                message:
                    `This room can accommodate only ${room.capacity} guests`
            });
        }

        // Check overlapping confirmed booking
        const conflictingBooking = await Booking.findOne({
            roomId: room._id,
            bookingStatus: "CONFIRMED",

            checkInDate: { $lt: checkOut },
            checkOutDate: { $gt: checkIn }
        });

        if (conflictingBooking) {
            return res.status(409).json({
                message:
                    "Room is already booked for the selected dates"
            });
        }

        // Calculate number of nights
        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        const numberOfNights = Math.ceil(
            (checkOut - checkIn) / millisecondsPerDay
        );

        const totalAmount =
            numberOfNights * room.pricePerNight;

        // Generate booking ID
        const bookingId =
            "BK" +
            Date.now().toString().slice(-8);

        const booking = await Booking.create({
            bookingId,

            customerId: req.user.userId,

            organizationId:
                organizationId || "ORG001",

            hotelId,

            roomId: room._id,

            checkInDate: checkIn,

            checkOutDate: checkOut,

            numberOfGuests: guests,

            totalAmount,

            bookingStatus: "CONFIRMED"
        });

        res.status(201).json({
            message: "Booking confirmed successfully",

            booking: {
                bookingId: booking.bookingId,

                customerId: booking.customerId,

                organizationId: booking.organizationId,

                hotelId: booking.hotelId,

                roomId: booking.roomId,

                roomNumber: room.roomNumber,

                roomType: room.roomType,

                checkInDate: booking.checkInDate,

                checkOutDate: booking.checkOutDate,

                numberOfGuests: booking.numberOfGuests,

                bookingDate: booking.bookingDate,

                totalAmount: booking.totalAmount,

                bookingStatus: booking.bookingStatus
            }
        });

    } catch (error) {
        console.error("Create booking error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};


// =====================================================
// GET CUSTOMER BOOKINGS
// =====================================================

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            customerId: req.user.userId
        })
            .populate(
                "roomId",
                "roomNumber roomType pricePerNight capacity"
            )
            .sort({ bookingDate: -1 });

        res.status(200).json({
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error("Get bookings error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};


// =====================================================
// GET SINGLE BOOKING
// =====================================================

const getBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            bookingId: req.params.bookingId,
            customerId: req.user.userId
        }).populate(
            "roomId",
            "roomNumber roomType pricePerNight capacity description amenities"
        );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json(booking);

    } catch (error) {
        console.error("Get booking error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};


// =====================================================
// CANCEL BOOKING
// =====================================================

const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            bookingId: req.params.bookingId,
            customerId: req.user.userId
        });

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (booking.bookingStatus === "CANCELLED") {
            return res.status(400).json({
                message: "Booking is already cancelled"
            });
        }

        if (booking.bookingStatus === "COMPLETED") {
            return res.status(400).json({
                message: "Completed bookings cannot be cancelled"
            });
        }

        const now = new Date();

        const checkIn = new Date(
            booking.checkInDate
        );

        // Cancellation deadline:
        // 24 hours before check-in
        const cancellationDeadline =
            new Date(
                checkIn.getTime() -
                24 * 60 * 60 * 1000
            );

        if (now > cancellationDeadline) {
            return res.status(400).json({
                message:
                    "Cancellation deadline has passed. A cancellation request must be submitted."
            });
        }

        booking.bookingStatus = "CANCELLED";

        await booking.save();

        res.status(200).json({
            message: "Booking cancelled successfully",
            booking: {
                bookingId: booking.bookingId,
                bookingStatus: booking.bookingStatus,
                checkInDate: booking.checkInDate,
                checkOutDate: booking.checkOutDate
            }
        });

    } catch (error) {
        console.error("Cancel booking error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    searchAvailableRooms,
    createBooking,
    getMyBookings,
    getBooking,
    cancelBooking
};