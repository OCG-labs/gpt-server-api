# 🎮 OCG GPT API Server

This is a node server built to serve as a API resource to interact with ChatGPT inside of the Vtiger CRM.

### 📋 Prerequisites

You need to have Node.js and npm installed on your machine. If you don't have them installed, you can download them from [here](https://nodejs.org/en/download/).

### 🔧 Installing

1. Fork and clone the repo.
2. Navigate to the project directory.
3. Run `npm install` to install the dependencies.
4. Proceed to [Docker Section](https://github.com/OCG-labs/gpt-server-api/blob/main/README.md#-docker) to deploy with Docker.

   
### 🔧 API

* /api/chat/article - POST request that takes in a message and returns a JSON object.
  
<img width="1784" alt="Screenshot 2024-05-09 at 10 02 10 AM" src="https://github.com/OCG-labs/gpt-server-api/assets/121247975/b2d84e6e-a550-495b-877c-ce71e2d409fd">

* /api/chat/article/post - POST request that posts generated article to specified wordpress site.
  
* /api/chat/post/contact - POST request generates a Oxygen JSON output for a contact page.
  
* /api/chat/post/about - POST request generates a Oxygen JSON output for a about page.

* /api/test - GET request to calls a free api for testing purposes.
  
### API Usage

Interaction with the OpenAI API is made easy with this simple Node server. 

#### /chat/article

* Edit the GPT model to your liking in server/server.js *IMPORTANT NOTE: CHANGING THE MODEL CAN HAVE UNFORSEEN BUGS* 

<img width="831" alt="Screenshot 2024-05-03 at 12 38 03 PM" src="https://github.com/OCG-labs/gpt-server-api/assets/121247975/7950dd55-63b5-41a4-ba47-59436cf9917e">

* Using the /api/chat/article endpoint, send a post request with a body including a message for [chat completion](https://platform.openai.com/docs/guides/text-generation/chat-completions-api)

<img width="1710" alt="Screenshot 2024-05-03 at 12 40 49 PM" src="https://github.com/OCG-labs/gpt-server-api/assets/121247975/df644464-410e-4cd4-9270-2e8e62b672fd">

HTTP Response will be content from a JSON object.

### 🚢 Docker

Included in the root directory are a Dockerfile and a docker-compose.yml. This allows the server to be spun up as a docker container locally, or on a hosted service that supports docker deployment.

#### Local Docker Deployment

* Ensure docker daemon is installed on the local machine (Docker Desktop).
* Ensure you have a api_txt file in the root directory containing Openai api key.
* Ensure you have a .env file with Port variable.
* Change
```JavaScript
// Check if the Docker secret file exists
if (fs.existsSync('/etc/secrets/openai_api_key')) {
  // Read the API key from the Docker secret
  OPENAI_API_KEY = fs.readFileSync('/etc/secrets/openai_api_key', 'utf8').trim();
} else {
  // Log error
  console.log("No api key")
}
```
To
```JavaScript
// Check if the Docker secret file exists
if (fs.existsSync('/run/secrets/openai_api_key')) {
  // Read the API key from the Docker secret
  OPENAI_API_KEY = fs.readFileSync('/run/secrets/openai_api_key', 'utf8').trim();
} else {
  // Log error
  console.log("No api key")
}
```

* Run ```docker-compose up``` to spin up the image and container via docker-compose.yml file.
* The server should now be running locally on specified port and can be tested with [end points](https://github.com/OCG-labs/gpt-server-api/blob/main/README.md#-api).

#### Hosted Docker Deployment

[Render](https://render.com/) will be used as a example of hosted Docker deployment.

* Click on the **New +** button to create a new deployed asset.
* Choose **Web service** option.
   
<img width="439" alt="Screenshot 2024-05-05 at 07 23 34" src="https://github.com/OCG-labs/gpt-server-api/assets/121247975/0190b266-e6dc-4859-b09e-8f9dca147c3e">

* Link **github repo**.

<img width="727" alt="Screenshot 2024-05-05 at 07 23 40" src="https://github.com/OCG-labs/gpt-server-api/assets/121247975/320fb6fb-6f4b-4541-8fc6-468904a3dccc">

* Ensure runtime displays **"Docker"**.

<img width="1300" alt="Screenshot 2024-05-05 at 07 25 37" src="https://github.com/OCG-labs/gpt-server-api/assets/121247975/adff735e-8f45-4de1-a89d-1133780987ad">

* Add .env PORT variable and Docker secret file labeled as "open_ai_key".
  
<img width="1243" alt="Screenshot 2024-05-05 at 07 25 58" src="https://github.com/OCG-labs/gpt-server-api/assets/121247975/350a62e9-0130-43bf-b0e5-13af49655e18">

<img width="1019" alt="Screenshot 2024-05-09 at 11 28 28 AM" src="https://github.com/OCG-labs/gpt-server-api/assets/121247975/64a451ab-9bd8-4485-bbe7-3ed488227e48">


After deployment, test end points to verify deployment success.

#### 🔒 Docker Secrets

API keys are valuable and are not secure when placed inside of a .env file of the docker container. For this reason, you want to create a docker secret file for added security. *IMPORTANT NOTE: This method is not entirely secure. For maximum security, use docker swarm.*

### 🐅 Vtiger Usage

Once you are on the workflow designer, set up a web-service call and associated action once data is received.

<img width="652" alt="Screenshot 2024-05-06 at 9 48 36 AM" src="https://github.com/OCG-labs/gpt-server-api/assets/121247975/29f2aa87-46bf-4125-9a77-c0645cb6b259">

Use the parameter section and name it "message". Make the value your prompt to GPT. *IMPORTANT NOTE: GPT is in JSON mode so your prompt needs to say, "Return a JSON object with the following structure:"*

<img width="1153" alt="Screenshot 2024-05-06 at 9 50 18 AM" src="https://github.com/OCG-labs/gpt-server-api/assets/121247975/bb8ba39c-9016-4449-93cd-82e5cf9f4a97">


## 🛠️ Built With

* <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/javascript-colored.svg" width="36" height="36" alt="JavaScript" /> - Core language used</a>
* <a href="https://nodejs.org/en/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nodejs-colored.svg" width="36" height="36" alt="NodeJS" /> - JavaScript runtime</a>
* <a href="https://developer.mozilla.org/en-US/docs/Glossary/HTML5" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/html5-colored.svg" width="36" height="36" alt="HTML5" /> - Markup language</a>
* <a href="https://www.docker.com/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/docker-colored.svg" width="36" height="36" alt="Docker" /> - Deployment solution</a>
