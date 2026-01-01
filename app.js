const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// Read CSS file once at startup
const cssContent = fs.readFileSync(path.join(__dirname, "app.css"), "utf-8");

app.use(cors());

app.get("/", (req, res, next) => {
  res.setHeader("Content-type", "text/html");
  res.send(`
    <html>
      <head>
        <title>Node JS Web Serve Version 1.1</title>
        <style>
          ${cssContent}
        </style>
      </head>
    <body>
      <h1>Hello world! I'm a Node/ExpressJS web server version 1...</h1>
      <p>
        <img src="https://www.w3schools.com/w3css/img_lights.jpg" alt="Lights" style="width:100%;max-width:600px">
      </p>
    </body>
    </html>
    `);
  next();
});

module.exports = app;
