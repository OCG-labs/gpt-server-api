import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';

dotenv.config(); // Initialize environment variables
let PORT = process.env.PORT || 4000; // Set port
const app = express(); // Initialize express

let OPENAI_API_KEY;

// Check if the Docker secret file exists
if (fs.existsSync('/etc/secrets/openai_api_key')) {
  // Read the API key from the Docker secret
  OPENAI_API_KEY = fs.readFileSync('/etc/secrets/openai_api_key', 'utf8').trim();
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

// Post request generate topics
app.post('/api/chat/topic', async (req, res, next) => {
  let userMessage = req.body.message; // Get message from request body

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
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    const dataString = data["choices"][0]["message"]["content"];
    const dataArray = dataString.split(",");
    const arrayWithoutPeriods = dataArray.map(item => item.replace('.', ''));
    res.json(arrayWithoutPeriods); // Chat String output
  }
  catch (err) {
    next(err); // Pass error to error handler
  }
});

// Post request generate prompt
app.post('/api/chat/prompt', async (req, res, next) => {
  let userMessage = req.body.message; // Get message from request body

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
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    const dataString = data["choices"][0]["message"]["content"];
    const dataArray = dataString.split("|");

    console.log(dataArray);
    res.json(dataArray); // Chat String output
  }
  catch (err) {
    next(err); // Pass error to error handler
  }
});

// Post request generate prompt
app.post('/api/chat/article', async (req, res, next) => {
  let userMessage = req.body.message; // Get message from request body

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
        model: 'gpt-4-turbo-2024-04-09',
        response_format: { type: "json_object" },
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    const dataString = data["choices"][0]["message"]["content"];
    const dataArray = dataString.split("|");

    console.log(dataArray);
    res.json(dataArray); // Chat String output
  }
  catch (err) {
    next(err); // Pass error to error handler
  }
});

// Post request generate prompt
app.post('/api/chat/page', async (req, res, next) => {
  let userMessage = req.body.message; // Get message from request body

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
        model: 'gpt-4-turbo-2024-04-09',
        response_format: { type: "json_object" },
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    // const dataString = data["choices"][0]["message"]["content"];
    // const dataArray = dataString.split("|");

    console.log(data);
    res.json(data); // Chat String output
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