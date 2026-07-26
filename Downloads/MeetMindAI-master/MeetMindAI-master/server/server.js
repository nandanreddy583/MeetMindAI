import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import path from "path";
import chatRoutes from "./routes/chatRoutes.js";
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);
app.use(
  "/uploads",
  express.static("uploads")
);
app.use("/api/chat", chatRoutes);
app.get("/", (req, res) => {
  res.send("AutoMind AI API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});