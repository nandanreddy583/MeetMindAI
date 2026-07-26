import { GoogleGenAI } from "@google/genai";
import { retrieveContext } from "../services/ragService.js";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const chatWithMeeting = async (req, res) => {

    try {

        const { meetingId, question } = req.body;

        if (!meetingId || !question) {
            return res.status(400).json({
                message: "meetingId and question are required"
            });
        }

        const context = await retrieveContext(
            meetingId,
            question
        );

        if (context.length === 0) {
            return res.json({
                answer: "I couldn't find relevant information in this meeting.",
                sources: []
            });
        }

        const meetingContext = context
            .map((c) => c.text)
            .join("\n\n");

        const prompt = `
You are an AI Meeting Assistant.

Answer ONLY using the meeting context.

Rules:

1. Do not hallucinate.
2. If information is unavailable, say:
"I couldn't find that information in this meeting."

Meeting Context

${meetingContext}

Question

${question}
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt
        });

        res.json({
            answer: response.text,
            sources: context
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: err.toString()
        });

    }

};