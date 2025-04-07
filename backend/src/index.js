import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import {GoogleGenAI} from "@google/genai";


dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();
const ai = new GoogleGenAI({ apiKey: "AIzaSyCgVfb3FqDlLHwSvUKHROMaa_zYQqqXBwU" });



app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
//message authentication
app.use("/api/auth", authRoutes);

//message routes
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}





//Gemini integration

app.post("/geminichat", async (req, res) => {
    try {
        const { message } = req.body;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: message,
          });

        res.json({ response:response.text });
    } catch (error) {
        console.error("Error communicating with OpenAI:", error);
        res.status(500).json({ error: "Error communicating with OpenAI" });
    }
});















server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
