import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function analyzeMeeting(transcript) {
  const prompt = `
You are an expert meeting assistant.

Analyze the following meeting transcript.

Return ONLY valid JSON in this exact format:

{
  "summary": "string",
  "actionItems": ["item1", "item2"],
  "keyDecisions": ["decision1"],
  "nextSteps": ["step1"]
}

Transcript:
${transcript}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });

  return response.text;
}