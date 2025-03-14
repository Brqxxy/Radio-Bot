# 📡 Radio FX Bot 📡
Radio FX Bot is a Discord bot that generates and updates random radio frequencies, simulating a real-world radio environment. This bot is great for roleplay servers, simulation enthusiasts, and anyone who wants a fun way to engage their roleplay!
## 🚀 Features
- 📻 **Random Radio Frequencies** – Generates and updates radio frequencies daily.
- 🔄 **Scheduled Updates** – Automatically updates at 7:00 AM AEDT.
- 📡 **Interactive Commands** – Users can request a new frequency or check the current one.
- 🛠 **Embed-Based Messages** – Clean and structured updates posted in a specific channel.
- 👀 Logging to Console – Logs command usage and messages to the console for better debugging and monitoring.

## 🛠 Setup & Installation
### Prerequisites
Before installing, make sure you have:
- [Node.js](https://nodejs.org/) (v16 or later)
- [Discord Developer Portal](https://discord.com/developers/applications) Access to create a bot
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Brqxxy/radio-fx-bot.git
cd radio-fx-bot
```
### 2️⃣ Install Dependencies
```sh
npm install
```
### 3️⃣ Set Up Your Bot Token
1. Create a bot on the [Discord Developer Portal](https://discord.com/developers/applications).
2. Copy your **bot token**.
3. Replace the `TOKEN` variable in `fxbot.js` with your bot token.
### 4️⃣ Set Your Discord Channel
1. Find the **Channel ID** where you want the bot to post updates.
2. Replace `CHANNEL_ID` in `fxbot.js` with your desired channel ID.
### 5️⃣ Run the Bot
```sh
node fxbot.js
```

## 🐳 Docker Setup
Running Radio FX Bot in Docker makes deployment easy and consistent across different environments.

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed on your system

### 1️⃣ Create a Dockerfile
Create a file named `Dockerfile` in your project root:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

CMD ["node", "fxbot.js"]
```

### 2️⃣ Create a .dockerignore file
Create a `.dockerignore` file to exclude unnecessary files:

```
node_modules
npm-debug.log
.git
.gitignore
.env
README.md
```

### 3️⃣ Using Environment Variables
For better security, use environment variables instead of hardcoding your token:

1. Create a `.env` file (this will NOT be included in the Docker image):
```
DISCORD_TOKEN=your_bot_token_here
CHANNEL_ID=your_channel_id_here
```

2. Update your `fxbot.js` to use these environment variables:
```javascript
// Add this near the top of your file
require('dotenv').config();
const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
```

3. Add `dotenv` to your dependencies:
```sh
npm install dotenv
```

### 4️⃣ Build and Run the Docker Container
```sh
# Build the Docker image
docker build -t radio-fx-bot .

# Run the container with your environment variables
docker run -d --name radio-fx-bot --restart unless-stopped --env-file .env radio-fx-bot
```

### 5️⃣ Docker Compose (Optional)
For easier management, you can use Docker Compose. Create a `docker-compose.yml` file:

```yaml
version: '3'

services:
  bot:
    build: .
    restart: unless-stopped
    env_file: .env
```

Then run:
```sh
docker-compose up -d
```

### 🔄 Updating the Bot
When you make changes to your bot:

```sh
# If using Docker
docker stop radio-fx-bot
docker rm radio-fx-bot
docker build -t radio-fx-bot .
docker run -d --name radio-fx-bot --restart unless-stopped --env-file .env radio-fx-bot

# If using Docker Compose
docker-compose down
docker-compose up -d --build
```

### 📋 Viewing Logs
```sh
# Docker
docker logs radio-fx-bot

# Docker Compose
docker-compose logs
```

## 🔧 Commands
| Command     | Description |
|------------|-------------|
| `!newfx`    | Generates a new random radio frequency and updates the channel. |
| `!currentfx` | Displays the current frequency in use. |

## 🤝 Contributing
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Create a new Pull Request.

## 🛠 Troubleshooting
- **Bot is not responding?** Check if it has the right permissions to send messages.
- **Bot is crashing?** Make sure your `TOKEN` and `CHANNEL_ID` are set correctly.
