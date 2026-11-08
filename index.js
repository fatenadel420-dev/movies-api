
import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/index.js";
import { pagesRouter } from "./routes/pages.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { moviesRouter } from "./routes/movies.routes.js";
import { actorsRouter } from "./routes/actors.routes.js";
import { reviewsRouter } from "./routes/reviews.routes.js";


const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// Log requests
app.use((req, res, next) => {
  console.log(new Date().toLocaleString(), req.method, req.url);
  next();
});

// Pages
app.use("/auth", authRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/actors", actorsRouter);
app.use("/api/reviews", reviewsRouter);
app.use(pagesRouter);


// Error handler
app.use((err, req, res, next) => {
  console.log("Error:", err);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 3000;

await connectDB();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
