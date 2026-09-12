const Organization = require("../models/Organization");

// CREATE ORGANIZATION
const createOrganization = async (req, res) => {
    try {
        const organization = await Organization.create(req.body);

        res.status(201).json({
            message: "Organization created successfully",
            organization
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

// GET ALL ORGANIZATIONS
const getOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find();

        res.status(200).json({
            count: organizations.length,
            organizations
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createOrganization,
    getOrganizations
};