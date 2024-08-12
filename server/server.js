import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import { Buffer } from 'buffer';

dotenv.config(); // Initialize environment variables
let PORT = process.env.PORT || 4000; // Set port
const app = express(); // Initialize express

let OPENAI_API_KEY;

// Check if the Docker secret file exists
if (fs.existsSync('/run/secrets/openai_api_key')) {
  // Read the API key from the Docker secret
  OPENAI_API_KEY = fs.readFileSync('/run/secrets/openai_api_key', 'utf8').trim();
} else {
  // Log error
  console.log("No api key")
}

/////////////////////////////// Middleware ///////////////////////////////
app.use(
  express.json(),
  express.static('public'),
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

/////////////////////////////// API Routes ///////////////////////////////

// Test GET request
app.get('/api/test', async (req, res, next) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const data = await response.json();
    res.status(200).send(data);
  }
  catch (err) {
    next(err);
  }
});

// Post request that returns a chat json object
app.post('/api/chat/article', async (req, res, next) => {
  let userMessage = req.body.message; // Get message from request body

  console.log("RECEIVED MESSAGE:");
  console.log(userMessage);

  if (userMessage === "") {
    return res.status(400).send("Message cannot be empty");
  }
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        response_format: { type: "json_object" },
        messages: [
          {
            "role": "system",
            "content": "json"
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json(); // Get JSON response

    console.log("RECEIVED DATA FROM CHATGPT:");
    console.log(data);

    const dataJson = data["choices"][0]["message"]["content"]; // Grab JSON string

    console.log("RECEIVED MESSAGE CONTENT FROM CHATGPT:");
    console.log(dataJson);

    const dataJsonParse = JSON.parse(dataJson);

    console.log("PARSED JSON MESSAGE:");
    console.log(dataJsonParse);

    res.json(dataJsonParse); // Chat String output
  }
  catch (err) {
    next(err); // Pass error to error handler
  }
});

// Post request to post article to wordpress
app.post('/api/chat/article/post', async (req, res, next) => {
  let username = 'ocgdev';
  let password = req.body.password;
  let apiUrl = `${req.body.url}/wp-json/wp/v2/posts`;
  let postObj = {
    "title": req.body.title,
    "content": `${req.body.content}`,
    "author": req.body.author,
    "status": 'draft'
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
      },
      body: JSON.stringify(postObj)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    res.json(data);
  }
  catch (err) {
    next(err); // Pass error to error handler
  }
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
})

// Server listening functions
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
