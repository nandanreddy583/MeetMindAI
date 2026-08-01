import express from "express";
import { chatWithMeeting } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", chatWithMeeting);

export default router;