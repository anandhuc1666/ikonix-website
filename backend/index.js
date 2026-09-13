import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import brandRouter from "./src/routes/brandRoute.js";
import authRouter from "./src/routes/authRoutes.js";
import productRouter from "./src/routes/productRoutes.js";
import YoutubeRoute from "./src/routes/youtubRoute.js";
import adminRouter from "./src/routes/adminRoutes.js";

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/brands", brandRouter);
app.use("/api/products", productRouter);
app.use("/api/Youtube", YoutubeRoute);
app.use("/api/admin", adminRouter);

// Port
const PORT = process.env.PORT || 3000;

// Local development server
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Important for Vercel
export default app;