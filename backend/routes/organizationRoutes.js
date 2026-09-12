const express = require("express");

const router = express.Router();

const {
    createOrganization,
    getOrganizations
} = require("../controllers/organizationController");

const authenticate =
    require("../middleware/authMiddleware");

const authorize =
    require("../middleware/roleMiddleware");

// Create organization
router.post(
    "/",
    authenticate,
    authorize("admin"),
    createOrganization
);

// Get organizations
router.get(
    "/",
    authenticate,
    authorize("admin"),
    getOrganizations
);

module.exports = router;