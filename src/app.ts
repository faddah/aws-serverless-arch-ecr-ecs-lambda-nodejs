import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();

// Read CSS file once at startup
const cssContent = fs.readFileSync(path.join(__dirname, "app.css"), "utf-8");

// Read version from package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf-8")
);
const version = packageJson.version;

app.use(cors());

// Image proxy endpoint to avoid CORS issues
app.get("/proxy-image", async (req: Request, res: Response) => {
  const imageUrl = "https://www.w3schools.com/w3css/img_lights.jpg";
  
  try {
    console.log("Fetching image from:", imageUrl);
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status}`);
      return res.status(500).send("Error fetching image");
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log(`Image fetched successfully, size: ${buffer.length} bytes`);
    
    // Set headers for image response - critical for all browsers
    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "public, max-age=86400",
      "Accept-Ranges": "bytes"
    });
    
    // Send the buffer directly
    return res.status(200).end(buffer);
  } catch (error) {
    console.error("Error fetching image:", error);
    return res.status(500).send("Error fetching image");
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
        <title>Node JS Web Serve Version ${version}</title>
        <style>
          ${cssContent}
        </style>
      </head>
    <body>
      <h1>Hello World! I'm a Node.JS / ExpressJS Web Server, Version ${version}, written in TypeScript...</h1>
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
