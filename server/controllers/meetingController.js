import Meeting from "../models/Meeting.js";
import { transcribeAudio } from "../services/transcriptionService.js";

export const uploadMeeting = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);
    console.log("User:", req.user);

    if (!req.file) {
      return res.status(400).json({
        message: "No audio file received",
      });
    }
      const transcript = await transcribeAudio(req.file.path);

    const meeting = await Meeting.create({
      title: req.body.title,
      filename: req.file.filename,
      transcript,
      uploadedBy: req.user.id,
    });

    res.status(201).json(meeting);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};
export const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      uploadedBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(meetings);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
export const getDashboardStats = async (req, res) => {
  try {
    console.log("Stats API called");

    const meetings = await Meeting.find({
      uploadedBy: req.user.id,
    });

    console.log(meetings);

    const totalMeetings = meetings.length;

    const totalSummaries = meetings.filter(
      (meeting) => meeting.summary && meeting.summary.trim() !== ""
    ).length;

    const totalActionItems = meetings.reduce(
      (count, meeting) => count + meeting.actionItems.length,
      0
    );

    res.json({
      totalMeetings,
      totalSummaries,
      totalActionItems,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};
export const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id,
    });

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    await Meeting.findByIdAndDelete(req.params.id);

    res.json({
      message: "Meeting deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};