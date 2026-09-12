const express = require("express");

const router = express.Router();

const {
    createHotel,
    getHotel,
    updateHotel
} = require("../controllers/hotelController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Anyone logged in can view hotel
router.get("/", authenticate, getHotel);

// Admin and receptionist can create/update
router.post(
    "/",
    authenticate,
    authorize("admin", "receptionist"),
    createHotel
);

router.put(
    "/",
    authenticate,
    authorize("admin", "receptionist"),
    updateHotel
);

module.exports = router;