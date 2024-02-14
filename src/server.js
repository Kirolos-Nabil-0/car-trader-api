import express from "express";
import cookieParser from "cookie-parser";
import router from "./services/router.js";
import cors from "cors";
import morgan from "morgan";
import path from "path";

const app = express();

// Middleware
app.use(express.json({ limit: "90mb" }));
app.use(morgan("dev"));
app.use(express.urlencoded({ limit: "90mb", extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    credentials: true,
  })
);

// Define file and directory paths
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// Serve uploaded images
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads").substring(1))
);
app.use(
  express.static(path.join(__dirname, "../../olx-vue/dist").substring(1))
);

// Routes
app.use("/api", router);

// Catch-all route for serving the 'index.html' file
app.get("*", (req, res) => {
  const indexPath = path
    .join(__dirname, "../../olx-vue/dist/index.html")
    .substring(1);
  res.sendFile(indexPath);
});

export default app;
