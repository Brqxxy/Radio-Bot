# 📻 Radio FX Bot

Radio FX Bot is a Discord bot that generates and updates random radio frequencies, simulating a real-world radio environment. This bot is great for roleplay servers, simulation enthusiasts, and anyone who wants a fun way to engage their community!

## 🚀 Features
- 🎵 **Random Radio Frequencies** – Generates and updates radio frequencies daily.
- 🔄 **Scheduled Updates** – Automatically updates at 7:00 AM AEDT.
- 📡 **Interactive Commands** – Users can request a new frequency or check the current one.
- 🛠 **Embed-Based Messages** – Clean and structured updates posted in a specific channel.

---

## 🛠 Setup & Installation
### Prerequisites
Before installing, make sure you have:
- [Node.js](https://nodejs.org/) (v16 or later)
- [Discord Developer Portal](https://discord.com/developers/applications) access to create a bot

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/radio-fx-bot.git
cd radio-fx-bot
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Your Bot Token
1. Create a bot on the [Discord Developer Portal](https://discord.com/developers/applications).
2. Copy your **bot token**.
3. Replace the `TOKEN` variable in `index.js` with your bot token.

### 4️⃣ Set Your Discord Channel
1. Find the **Channel ID** where you want the bot to post updates.
2. Replace `CHANNEL_ID` in `index.js` with your desired channel ID.

### 5️⃣ Run the Bot
```sh
node index.js
```

---

## 🔧 Commands
| Command     | Description |
|------------|-------------|
| `!newfx`    | Generates a new random radio frequency and updates the channel. |
| `!currentfx` | Displays the current frequency in use. |

---

## 🤝 Contributing
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Create a new Pull Request.

---

## 🛠 Troubleshooting
- **Bot is not responding?** Check if it has the right permissions to send messages.
- **Bot is crashing?** Make sure your `TOKEN` and `CHANNEL_ID` are set correctly.

