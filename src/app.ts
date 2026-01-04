import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();

// Read CSS file once at startup
const cssContent = fs.readFileSync(path.join(__dirname, "app.css"), "utf-8");

app.use(cors());

// Image proxy endpoint to avoid CORS issues
app.get("/proxy-image", async (req: Request, res: Response) => {
  const imageUrl = "https://www.w3schools.com/w3css/img_lights.jpg";
  
  // Set CORS headers BEFORE any response
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 24 hours
  
  try {
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Content-Length", buffer.length.toString());
    res.send(buffer);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send("Error fetching image");
  }
});

// Handle OPTIONS preflight for Safari
app.options("/proxy-image", (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(200);
});

app.get("/", (req: Request, res: Response, next: NextFunction): void => {
  res.setHeader("Content-type", "text/html");
  res.send(`
    <html>
      <head>
        <title>Node JS Web Serve Version 2.0.5</title>
        <style>
          ${cssContent}
        </style>
      </head>
    <body>
      <h1>Hello World! I'm a Node.JS / ExpressJS Web Server, Version 2.0.5, written in TypeScript...</h1>
      <p>
        <a href="https://science.nasa.gov/sun/auroras/" alt="Auroras - NASA Web Site & Best Scientific Explanation" target="_blank">
          <img src="proxy-image" alt="Lights" style="width:100%;max-width:600px">
        </a>
      </p>
    </body>
    </html>
    `);
  next();
});

export = app;
