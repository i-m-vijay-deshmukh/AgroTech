import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

app.get("/", (req, res) => {
    res.send("Welcome to the Google Gemini Chatbot API");
});

app.post("/api/message", async (req, res) => {
    try {
        if (!req.body || !req.body.message) {
            return res.status(400).json({ error: "Message content is required." });
        }

        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: req.body.message }] }]
            })
        });

        const data = await response.json();

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
