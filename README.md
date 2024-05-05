# 🎮 OCG GPT API Server

This is a node server built to serve as a API resource to interact with ChatGPT inside of the Vtiger CRM.

### 📋 Prerequisites

You need to have Node.js and npm installed on your machine. If you don't have them installed, you can download them from [here](https://nodejs.org/en/download/).

### 🔧 Installing

1. Fork and clone the repo.
2. Navigate to the project directory.
3. Run `npm install` to install the dependencies.
4. Run `npm start` to start the server.
   
### 🔧 API

* /api/chat - POST request to feed a message in the req body to openai API.
* /api/test - GET request to calls a free api for testing purposes.

### Usage

Interaction with the OpenAI API is made easy with this simple Node server. 

* Edit the model to your liking in server/server.js

<img width="831" alt="Screenshot 2024-05-03 at 12 38 03 PM" src="https://github.com/OCG-labs/gpt-server-api/assets/121247975/7950dd55-63b5-41a4-ba47-59436cf9917e">

* Using the /api/chat endpoint, send a post request with a body including a message for [chat completion](https://platform.openai.com/docs/guides/text-generation/chat-completions-api)

<img width="1710" alt="Screenshot 2024-05-03 at 12 40 49 PM" src="https://github.com/OCG-labs/gpt-server-api/assets/121247975/df644464-410e-4cd4-9270-2e8e62b672fd">

HTTP Response will be content from a JSON object.

### Docker

Included in the root directory are a Dockerfile and a docker-compose.yml. This allows the server to be spun up as a docker container locally, or on a hosted service that supports docker deployment.

#### Local Docker Deployment

* Ensure docker daemon is installed on the local machine (Docker Desktop)
* Run ```Bash docker-compose up```

#### Docker Secrets


## 🛠️ Built With

* <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/javascript-colored.svg" width="36" height="36" alt="JavaScript" /> - Core language used</a>
* <a href="https://nodejs.org/en/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nodejs-colored.svg" width="36" height="36" alt="NodeJS" /> - JavaScript runtime</a>
* <a href="https://developer.mozilla.org/en-US/docs/Glossary/HTML5" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/html5-colored.svg" width="36" height="36" alt="HTML5" /> Markup language</a>
