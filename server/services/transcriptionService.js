import { spawn } from "child_process";

export const transcribeAudio = (audioPath) => {
      console.log("Starting transcription:", audioPath);
  return new Promise((resolve, reject) => {
    const python = spawn("python", [
      "ai/transcribe.py",
      audioPath,
    ]);

    let transcript = "";
    let error = "";

    python.stdout.on("data", (data) => {
      transcript += data.toString();
    });

    python.stderr.on("data", (data) => {
      error += data.toString();
    });

    python.on("close", (code) => {
      if (code === 0) {
        console.log("Transcript:", transcript);
        resolve(transcript.trim());
      } else {
        reject(error || "Transcription failed");
      }
    });
  });
};