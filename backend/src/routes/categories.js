const express = require("express");
const db = require("../config/database");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [categories] = await db.execute(
            "SELECT id, name, description FROM categories ORDER BY name"
        );

        res.json({
            success: true,
            categories
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to load categories"
        });
    }
});

module.exports = router;
