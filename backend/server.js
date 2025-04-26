const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(bodyParser.json());

app.post("/gemini", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY
        }
      }
    );

    let reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

    reply = reply.replace(/[^a-zA-Z0-9\s]/g, "");
    
    res.json({ response: reply });

  } catch (error) {
    console.error("Error with Gemini API:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get a response from Gemini" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}...`);
});
