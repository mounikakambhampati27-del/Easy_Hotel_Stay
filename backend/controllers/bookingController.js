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

        if (
            !checkInDate ||
            !checkOutDate ||
            !numberOfGuests
        ) {
            return res.status(400).json({
                message:
                    "checkInDate, checkOutDate and numberOfGuests are required"
            });
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const guests = Number(numberOfGuests);

        if (
            isNaN(checkIn.getTime()) ||
            isNaN(checkOut.getTime())
        ) {
            return res.status(400).json({
                message: "Invalid dates"
            });
        }

        if (checkOut <= checkIn) {
            return res.status(400).json({
                message:
                    "Check-out date must be after check-in date"
            });
        }

        if (guests < 1) {
            return res.status(400).json({
                message:
                    "Number of guests must be at least 1"
            });
        }

        const rooms = await Room.find({
            availabilityStatus: "Available",
            capacity: {
                $gte: guests
            }
        });

        const availableRooms = [];

        for (const room of rooms) {
            const overlappingBooking =
                await Booking.findOne({
                    roomId: room._id,
                    bookingStatus: "CONFIRMED",

                    checkInDate: {
                        $lt: checkOut
                    },

                    checkOutDate: {
                        $gt: checkIn
                    }
                });

            if (!overlappingBooking) {
                availableRooms.push(room);
            }
        }

        res.status(200).json({
            count: availableRooms.length,
            rooms: availableRooms
        });

    } catch (error) {
        console.error(
            "Search rooms error:",
            error.message
        );

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
                message: "Missing required booking fields"
            });
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const guests = Number(numberOfGuests);

        if (checkOut <= checkIn) {
            return res.status(400).json({
                message:
                    "Check-out must be after check-in"
            });
        }

        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        if (
            room.availabilityStatus !== "Available"
        ) {
            return res.status(400).json({
                message:
                    "Room is currently unavailable"
            });
        }

        if (room.capacity < guests) {
            return res.status(400).json({
                message:
                    "Room capacity is insufficient"
            });
        }

        // Prevent overlapping bookings
        const overlappingBooking =
            await Booking.findOne({
                roomId: room._id,

                bookingStatus: "CONFIRMED",

                checkInDate: {
                    $lt: checkOut
                },

                checkOutDate: {
                    $gt: checkIn
                }
            });

        if (overlappingBooking) {
            return res.status(409).json({
                message:
                    "Room is already booked for selected dates"
            });
        }

        const millisecondsPerDay =
            1000 * 60 * 60 * 24;

        const nights = Math.ceil(
            (checkOut - checkIn) /
                millisecondsPerDay
        );

        const totalAmount =
            nights * room.pricePerNight;

        const bookingId =
            "BK" +
            Date.now().toString().slice(-8);

        const booking =
            await Booking.create({
                bookingId,

                customerId:
                    req.user.userId,

                organizationId:
                    organizationId ||
                    room.organizationId ||
                    "ORG001",

                hotelId,

                roomId: room._id,

                checkInDate: checkIn,

                checkOutDate: checkOut,

                numberOfGuests: guests,

                totalAmount,

                bookingStatus: "CONFIRMED"
            });

        res.status(201).json({
            message:
                "Booking created successfully",

            confirmation: {
                bookingId:
                    booking.bookingId,

                hotelId:
                    booking.hotelId,

                roomId:
                    booking.roomId,

                checkInDate:
                    booking.checkInDate,

                checkOutDate:
                    booking.checkOutDate,

                numberOfGuests:
                    booking.numberOfGuests,

                totalAmount:
                    booking.totalAmount,

                bookingStatus:
                    booking.bookingStatus
            },

            booking
        });

    } catch (error) {
        console.error(
            "Create booking error:",
            error.message
        );

        res.status(500).json({
            message: error.message
        });
    }
};

// =====================================================
// CUSTOMER BOOKINGS
// =====================================================

const getMyBookings = async (req, res) => {
    try {
        const bookings =
            await Booking.find({
                customerId:
                    req.user.userId
            })
                .populate(
                    "roomId",
                    "roomNumber roomType pricePerNight capacity"
                )
                .sort({
                    bookingDate: -1
                });

        res.status(200).json({
            count: bookings.length,
            bookings
        });

    } catch (error) {
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
        const booking =
            await Booking.findOne({
                bookingId:
                    req.params.bookingId,

                customerId:
                    req.user.userId
            })
                .populate(
                    "roomId",
                    "roomNumber roomType pricePerNight capacity"
                );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json(booking);

    } catch (error) {
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
        const booking =
            await Booking.findOne({
                bookingId:
                    req.params.bookingId,

                customerId:
                    req.user.userId
            });

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (
            booking.bookingStatus ===
            "CANCELLED"
        ) {
            return res.status(400).json({
                message:
                    "Booking is already cancelled"
            });
        }

        if (
            booking.bookingStatus ===
            "COMPLETED"
        ) {
            return res.status(400).json({
                message:
                    "Completed booking cannot be cancelled"
            });
        }

        const now = new Date();

        const cancellationDeadline =
            new Date(
                booking.checkInDate.getTime() -
                    24 * 60 * 60 * 1000
            );

        if (now > cancellationDeadline) {
            return res.status(400).json({
                message:
                    "Cancellation deadline has passed. Cancellation request requires staff review."
            });
        }

        booking.bookingStatus =
            "CANCELLED";

        await booking.save();

        res.status(200).json({
            message:
                "Booking cancelled successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// =====================================================
// CUSTOMER DASHBOARD
// =====================================================

const customerDashboard = async (req, res) => {
    try {
        const bookings =
            await Booking.find({
                customerId:
                    req.user.userId
            })
                .populate(
                    "roomId",
                    "roomNumber roomType pricePerNight capacity"
                )
                .sort({
                    checkInDate: 1
                });

        const upcoming = [];
        const historical = [];
        const cancelled = [];

        const now = new Date();

        bookings.forEach((booking) => {

            if (
                booking.bookingStatus ===
                "CANCELLED"
            ) {
                cancelled.push(booking);
            }

            else if (
                booking.checkOutDate < now ||
                booking.bookingStatus ===
                    "COMPLETED"
            ) {
                historical.push(booking);
            }

            else {
                upcoming.push(booking);
            }
        });

        res.status(200).json({
            upcomingBookings: upcoming,
            historicalBookings: historical,
            cancelledBookings: cancelled
        });

    } catch (error) {
        console.error(
            "Customer dashboard error:",
            error.message
        );

        res.status(500).json({
            message: error.message
        });
    }
};

// =====================================================
// STAFF DASHBOARD
// =====================================================

const staffDashboard = async (req, res) => {
    try {
        const { status, search } = req.query;

        const query = {};

        if (req.user.organizationId) {
            query.organizationId = req.user.organizationId;
        }

        if (status) {
            query.bookingStatus = status;
        }

        if (search) {
            query.bookingId = {
                $regex: search,
                $options: "i"
            };
        }

        const bookings = await Booking.find(query)
            .populate("roomId")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error("Staff dashboard error:", error);

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
    cancelBooking,
    customerDashboard,
    staffDashboard
};