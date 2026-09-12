const express = require("express");

const router = express.Router();

const {
    createRoom,
    getRooms,
    getRoom,
    updateRoom,
    updateAvailability,
    deactivateRoom
} = require("../controllers/roomController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// View rooms
router.get("/", authenticate, getRooms);

router.get("/:id", authenticate, getRoom);

// Staff only
router.post(
    "/",
    authenticate,
    authorize("admin", "receptionist"),
    createRoom
);

router.put(
    "/:id",
    authenticate,
    authorize("admin", "receptionist"),
    updateRoom
);

router.patch(
    "/:id/availability",
    authenticate,
    authorize("admin", "receptionist"),
    updateAvailability
);

router.patch(
    "/:id/deactivate",
    authenticate,
    authorize("admin", "receptionist"),
    deactivateRoom
);

module.exports = router;