const express = require("express");

const router = express.Router();

const {
    createHotel,
    getHotel,
    updateHotel,
    getOrganizationHotels
} = require("../controllers/hotelController");

const authenticate =
    require("../middleware/authMiddleware");

const authorize =
    require("../middleware/roleMiddleware");

// GET HOTEL
router.get(
    "/",
    authenticate,
    getHotel
);

// CREATE HOTEL
router.post(
    "/",
    authenticate,
    authorize("admin", "receptionist"),
    createHotel
);

// UPDATE HOTEL
router.put(
    "/",
    authenticate,
    authorize("admin", "receptionist"),
    updateHotel
);

// GET HOTELS BY ORGANIZATION
router.get(
    "/organization/:organizationId",
    authenticate,
    authorize("admin", "receptionist"),
    getOrganizationHotels
);

module.exports = router;