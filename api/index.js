import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// ✅ Use Gemini-2.0-Flash for faster responses
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

if (!GEMINI_API_KEY) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing! Check your Render environment variables.");
    process.exit(1);
}

app.get("/", (req, res) => {
    res.send("Welcome to the Google Gemini-2.0-Flash Chatbot API");
});

// ✅ Updated /api/message endpoint
app.post("/api/message", async (req, res) => {
    try {
        if (!req.body || !req.body.message) {
            return res.status(400).json({ error: "Message content is required." });
        }

        console.log(`✅ Received request: ${req.body.message}`);

        const promptWithEmoji = req.body.message + "\n\n(Please include emojis where appropriate!)";

        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptWithEmoji }] }],
                generationConfig: {
                    temperature: 0.8,  // Higher creativity for natural emoji usage
                    topP: 0.9,
                    maxOutputTokens: 500
                }
            })
        });

        const data = await response.json();
        console.log("✅ Gemini Response:", data);

        if (data.error) {
            throw new Error(data.error.message || "Invalid Gemini API response");
        }

        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

        res.json({ message: botReply });

    } catch (error) {
        console.error("❌ Gemini API Error:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
