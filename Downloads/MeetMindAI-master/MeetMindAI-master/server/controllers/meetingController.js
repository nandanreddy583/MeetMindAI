import Meeting from "../models/Meeting.js";
import { transcribeAudio } from "../services/transcriptionService.js";
import { analyzeMeeting } from "../services/geminiService.js";
import { parseGeminiResponse } from "../utils/parseGeminiResponse.js";
import { spawn } from "child_process";
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

let summary = "";
let actionItems = [];
let keyDecisions = [];
let nextSteps = [];

try {
    const aiResponse = await analyzeMeeting(transcript);
    console.log("Gemini Response:");
    console.log(aiResponse);

    const parsed = parseGeminiResponse(aiResponse);
console.log(parsed);
    summary = parsed.summary;
    actionItems = parsed.actionItems;
    keyDecisions = parsed.keyDecisions;
    nextSteps = parsed.nextSteps;
} catch (error) {
    console.error("Gemini Error:", error);
}

    const meeting = await Meeting.create({
       title: req.body.title,
  filename: req.file.filename,
  transcript,
   summary,
    actionItems,
    keyDecisions,
    nextSteps,

    uploadedBy: req.user.id,
    });
    const python = spawn("python", [
  "ai/embed.py",
  meeting._id.toString(),
  transcript,
]);

python.stdout.on("data", (data) => {
  console.log("Embed:", data.toString());
});

python.stderr.on("data", (data) => {
  console.error("Embed Error:", data.toString());
});

python.on("close", (code) => {
  console.log("Embedding process finished with code:", code);
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
export const getMeetingById = async (req, res) => {
  try {
    console.log("Requested ID:", req.params.id);
    console.log("Logged in User:", req.user.id);

    const meeting = await Meeting.findById(req.params.id);

    console.log("Meeting:", meeting);

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    res.json(meeting);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};