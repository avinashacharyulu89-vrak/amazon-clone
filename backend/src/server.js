require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./config/database");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {
    try {
        await db.query("SELECT 1");

        res.json({
            success: true,
            message: "Amazon Clone API is running",
            database: "connected"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "API running but database unavailable"
        });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
