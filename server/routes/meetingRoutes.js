import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js";
import { uploadMeeting } from "../controllers/meetingController.js";
import {
  
  getMeetings,
  deleteMeeting,
} from "../controllers/meetingController.js";
import {
 
  
  getDashboardStats,
} from "../controllers/meetingController.js";
const router = express.Router();


router.get("/stats", protect, getDashboardStats);
router.get("/", protect, getMeetings);
router.post(
  "/upload",
  protect,
  upload.single("audio"),
  uploadMeeting
);
router.delete("/:id", protect, deleteMeeting);



export default router;