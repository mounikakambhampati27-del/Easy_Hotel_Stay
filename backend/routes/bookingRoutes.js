const express = require("express");

const router = express.Router();

const {
    searchAvailableRooms,
    createBooking,
    getMyBookings,
    getBooking,
    cancelBooking,
    customerDashboard,
    staffDashboard
} = require("../controllers/bookingController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");


// SEARCH ROOMS
router.get(
    "/search",
    authenticate,
    authorize("customer", "admin", "receptionist"),
    searchAvailableRooms
);


// CREATE BOOKING
router.post(
    "/",
    authenticate,
    authorize("customer"),
    createBooking
);


// CUSTOMER BOOKINGS
router.get(
    "/my",
    authenticate,
    authorize("customer"),
    getMyBookings
);


// CUSTOMER DASHBOARD
router.get(
    "/dashboard/customer",
    authenticate,
    authorize("customer"),
    customerDashboard
);


// ADMIN + RECEPTIONIST DASHBOARD
router.get(
    "/dashboard/staff",
    authenticate,
    authorize("admin", "receptionist"),
    staffDashboard
);


// SINGLE BOOKING
router.get(
    "/:bookingId",
    authenticate,
    authorize("customer"),
    getBooking
);


// CANCEL BOOKING
router.patch(
    "/:bookingId/cancel",
    authenticate,
    authorize("customer"),
    cancelBooking
);


module.exports = router;