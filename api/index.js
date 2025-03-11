import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Check if API key is set
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing! Check your .env file.");
    process.exit(1);
}

// ✅ Use the correct model and API version
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

app.get("/", (req, res) => {
    res.send("Welcome to the Google Gemini Chatbot API");
});

app.post("/message", async (req, res) => {
    try {
        console.log("✅ Received request:", req.body);

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
        console.log("✅ Gemini Response:", data);

        if (data.error) {
            throw new Error(data.error?.message || "Invalid Gemini API response");
        }

        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

        res.json({ message: botReply });
    } catch (error) {
        console.error("❌ Gemini API Error:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

app.listen(5500, () => console.log("✅ Server running on port 5500"));
