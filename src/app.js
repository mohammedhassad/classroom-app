import express from "express";
import compress from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";

import config from "./config/config";

const app = express();

// 1. Imports All Routes
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/courseRoutes";
import enrollmentRoutes from "./routes/enrollmentRoutes";

// 2. Imports All Controllers

// 3. Define Attributes
const root = path.join(__dirname, "..", "client", "dist");

// 4. Configure settings
app.set("port", config.port);

// 5. Define middleware
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 6. Define routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollment", enrollmentRoutes);

if (config.env === "production") {
  app.use(express.static(root));

  app.get("*", (req, res) => {
    res.sendFile("index.html", { root });
  });
} else {
  app.get("*", (req, res) => {
    res.send("App running on development...");
  });
}

// 7. Handle Error
app.use((err, req, res, next) => {
  // Catch unauthorised errors
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      status: "error",
      message: "You are not logged in! Please log in to get access",
    });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    // console.log(err);
  }
});

// 8. Connect to database (optional)
const DB = config.mongoUri.replace("<password>", config.mongoPassword);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Successfully connected to database");
  });

// 9. Start the server on a particular port
app.listen(app.get("port"), () => {
  console.log(`App running on port ${app.get("port")}`);
});
