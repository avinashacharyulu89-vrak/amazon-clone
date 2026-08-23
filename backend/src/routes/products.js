const express = require("express");
const db = require("../config/database");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { category } = req.query;

        let sql = `
            SELECT
                p.id,
                p.name,
                p.description,
                p.price,
                p.image_url,
                p.stock,
                c.name AS category
            FROM products p
            JOIN categories c
                ON p.category_id = c.id
        `;

        const params = [];

        if (category) {
            sql += " WHERE c.id = ?";
            params.push(category);
        }

        sql += " ORDER BY p.id DESC";

        const [products] = await db.execute(sql, params);

        res.json({
            success: true,
            products
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to load products"
        });
    }
});

module.exports = router;
