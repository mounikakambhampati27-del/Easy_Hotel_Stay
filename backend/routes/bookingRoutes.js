const express = require("express");

const router = express.Router();

const {
    searchAvailableRooms,
    createBooking,
    getMyBookings,
    getBooking,
    cancelBooking
} = require("../controllers/bookingController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");


router.get(
    "/search",
    authenticate,
    authorize("customer", "admin", "receptionist"),
    searchAvailableRooms
);


router.post(
    "/",
    authenticate,
    authorize("customer"),
    createBooking
);


router.get(
    "/my",
    authenticate,
    authorize("customer"),
    getMyBookings
);


router.get(
    "/:bookingId",
    authenticate,
    authorize("customer"),
    getBooking
);


router.patch(
    "/:bookingId/cancel",
    authenticate,
    authorize("customer"),
    cancelBooking
);


module.exports = router;