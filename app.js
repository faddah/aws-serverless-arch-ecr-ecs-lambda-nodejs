const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/", (req, res, next) => {
  res.setHeader("Content-type", "text/html");
  res.send(`
    <html>
      <head>
        <title>Node Js Web Serve Version 1</title>
        <style>
          body {
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          h1 {
            font-family: Arial, sans-serif;
            font-size: 24px;
            color: #333;
            text-align: center;
          }
          p {
            margin: 2rem 0;
            text-align: center;
            img {
              border: 2px solid #ccc;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              transition: 0.3s;
              border-radius: 25px;
              max-width: 50%;
              height: auto;
            }
          }
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
