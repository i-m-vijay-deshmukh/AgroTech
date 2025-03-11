import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// ✅ Allow frontend requests
app.use(cors({ origin: "*" }));  // Replace "*" with your frontend URL if needed

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

if (!GEMINI_API_KEY) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing! Check your Render environment variables.");
    process.exit(1);
}

app.get("/", (req, res) => {
    res.send("Welcome to the Google Gemini-2.0-Flash Chatbot API");
});

app.post("/api/code", async (req, res) => {
    try {
        const userPrompt = req.body.prompt;
        if (!userPrompt) {
            return res.status(400).json({ error: "❌ Prompt is required." });
        }

        console.log(`✅ Received coding request: ${userPrompt}`);

        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Write a full working program in any language: ${userPrompt}` }] }],
                generationConfig: {
                    temperature: 0.5,
                    topP: 0.9,
                    maxOutputTokens: 4096,
                    responseMimeType: "application/json"
                }
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        const botReply = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || "{}").response || "Sorry, I couldn't generate the code.";

        res.json({ code: botReply });

    } catch (error) {
        console.error("❌ Gemini API Error:", error);
        res.status(500).json({ error: "Failed to generate code. Try refining your prompt." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
