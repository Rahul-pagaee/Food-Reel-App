const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/** All route imports */
const authRouter = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");
/** Mount Routes */
app.use("/api/auth", authRouter);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);
module.exports = app;
