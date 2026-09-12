const express = require("express");

const router = express.Router();

const {
    register,
    login
} = require("../controllers/authController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post("/register", register);

router.post("/login", login);

// Any logged-in user
router.get("/profile", authenticate, (req, res) => {
    res.json({
        message: "You are authenticated",
        user: req.user
    });
});

// Admin only
router.get(
    "/admin-test",
    authenticate,
    authorize("admin"),
    (req, res) => {
        res.json({
            message: "Welcome Admin. You have admin access."
        });
    }
);

// Admin + Receptionist
router.get(
    "/staff-test",
    authenticate,
    authorize("admin", "receptionist"),
    (req, res) => {
        res.json({
            message: "Welcome Staff. You can access this area."
        });
    }
);

// Customer only
router.get(
    "/customer-test",
    authenticate,
    authorize("customer"),
    (req, res) => {
        res.json({
            message: "Welcome Customer. You can access this area."
        });
    }
);

module.exports = router;