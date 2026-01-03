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
  try {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(buffer);
  } catch (error) {
    res.status(500).send("Error fetching image");
  }
});

app.get("/", (req: Request, res: Response, next: NextFunction): void => {
  res.setHeader("Content-type", "text/html");
  res.send(`
    <html>
      <head>
        <title>Node JS Web Serve Version 2.0.2</title>
        <style>
          ${cssContent}
        </style>
      </head>
    <body>
      <h1>Hello World! I'm a Node.JS / ExpressJS Web Server, Version 2.0.2, written in TypeScript...</h1>
      <p>
        <a href="https://science.nasa.gov/sun/auroras/" alt="Auroras - NASA Web Site & Best Scientific Explanation" target="_blank">
          <img src="https://www.w3schools.com/w3css/img_lights.jpg" alt="Lights" style="width:100%;max-width:600px">
        </a>
      </p>
    </body>
    </html>
    `);
  next();
});

export = app;
