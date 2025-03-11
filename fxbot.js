const { Client, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');

// Bot token and channel ID where it will operate
const TOKEN = 'TOKEN_ID'; // Replace with your bot token
const CHANNEL_ID = 'CHANNEL_ID';  // The channel where the bot will post messages

// Create a new Discord bot client with necessary permissions (intents)
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Allows bot to operate in servers
        GatewayIntentBits.GuildMessages, // Enables reading and sending messages
        GatewayIntentBits.MessageContent // Allows bot to read message content
    ]
});

// Variables to store current channel frequency and last embed message
let currentChannel = null;
let lastEmbedMessage = null;

// Predefined frequency ranges for random selection
const frequencyRanges = [
    { min: 26.96, max: 27.40 },
    { min: 28.00, max: 29.70 },
    { min: 30.00, max: 50.00 },
    { min: 50.00, max: 54.00 },
    { min: 72.00, max: 76.00 },
    { min: 108.00, max: 137.00 },
    { min: 136.00, max: 174.00 },
    { min: 174.00, max: 216.00 },
    { min: 216.00, max: 222.00 },
    { min: 222.00, max: 225.00 },
    { min: 300.00, max: 420.00 },
    { min: 420.00, max: 450.00 },
    { min: 450.00, max: 470.00 },
    { min: 470.00, max: 512.00 },
    { min: 764.00, max: 776.00 },
    { min: 794.00, max: 806.00 },
    { min: 806.00, max: 824.00 },
    { min: 849.00, max: 869.00 },
    { min: 869.00, max: 894.00 },
    { min: 902.00, max: 928.00 }
];

// Function to get the current timestamp in AEDT timezone
function getAEDTTimestamp() {
    return new Date().toLocaleString('en-AU', { 
        timeZone: 'Australia/Sydney',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}

// Runs once when the bot is ready
bot.once('ready', async () => {
    console.log(`[${getAEDTTimestamp()}] Logged in as ${bot.user?.tag}`);
    bot.user.setActivity('Radio Waves', { type: ActivityType.Listening });
    
    await cleanupExistingEmbeds(); // Remove old messages
    await changeRadioChannel(); // Initialize the radio channel
    scheduleNextUpdate(); // Set daily update
});

// Function to delete previous bot messages to avoid clutter
async function cleanupExistingEmbeds() {
    try {
        const channel = bot.channels.cache.get(CHANNEL_ID);
        if (!channel) return;
        
        const messages = await channel.messages.fetch({ limit: 100 });
        const botEmbeds = messages.filter(msg => msg.author.id === bot.user.id && msg.embeds.length > 0);
        
        if (botEmbeds.size > 0) {
            console.log(`[${getAEDTTimestamp()}] Cleaning up ${botEmbeds.size} existing embeds...`);
            for (const msg of botEmbeds.values()) {
                await msg.delete().catch(console.error);
            }
        }
    } catch (error) {
        console.error(`[${getAEDTTimestamp()}] Error cleaning embeds:`, error);
    }
}

// Schedules the next radio channel update at 7:00 AM AEDT
function scheduleNextUpdate() {
    const now = new Date();
    const nextRun = new Date(now);
    nextRun.setUTCHours(20 - 1, 0, 0, 0); // Adjusting the hour for AEDT (UTC+11 or UTC+10 depending on daylight saving)
    if (nextRun <= now) nextRun.setUTCDate(nextRun.getUTCDate() + 1);
    
    console.log(`[${getAEDTTimestamp()}] Next update scheduled for: ${nextRun.toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}`);
    setTimeout(() => {
        changeRadioChannel();
        setInterval(changeRadioChannel, 24 * 60 * 60 * 1000); // Repeat daily
    }, nextRun - now);
}

// Function to select a random radio frequency and update the Discord channel
async function changeRadioChannel() {
    const selectedRange = frequencyRanges[Math.floor(Math.random() * frequencyRanges.length)];
    currentChannel = parseFloat((Math.random() * (selectedRange.max - selectedRange.min) + selectedRange.min).toFixed(2));
    
    const channel = bot.channels.cache.get(CHANNEL_ID);
    if (!channel) return;
    
    if (lastEmbedMessage) await lastEmbedMessage.delete().catch(console.error);
    
    const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('<a:wifi:1347185083978874920> Radio FX Channel Update')
    .setDescription(`New Channel Set: **${currentChannel.toFixed(2)} MHz**. Stay tuned!`)
    .setFooter({ text: 'Use `!newfx` to change or `!currentfx` to check.' });
    
    lastEmbedMessage = await channel.send({ embeds: [embed] });
}

// Listen for user commands
bot.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    console.log(`[${getAEDTTimestamp()}] Received message: "${message.content}" from ${message.author.username} (${message.author.id})`);

    if (message.content === '!newfx') {
        await changeRadioChannel();
        message.delete().catch(console.error);

        const embed = new EmbedBuilder()
            .setColor('#348261')
            .setTitle('<a:check1:1347188461697896479> Radio FX Channel Changed')
            .setDescription(`New Channel Set: **${currentChannel.toFixed(2)} MHz**. Tune in for communication!`);
        
        const sentMessage = await message.channel.send({ embeds: [embed] });
        setTimeout(() => sentMessage.delete().catch(console.error), 15000);
    }

    if (message.content === '!currentfx') {
        message.delete().catch(console.error);
        
        const embed = new EmbedBuilder()
            .setColor('#F47B67')
            .setTitle('<a:check2:1347189672903970937> Current Radio FX Channel')
            .setDescription(currentChannel ? `Current Channel: **${currentChannel.toFixed(2)} MHz**.` : "No channel has been set yet. Use `!newfx` to set one.");
        
        const sentMessage = await message.channel.send({ embeds: [embed] });
        setTimeout(() => sentMessage.delete().catch(console.error), 15000);
    }
});

// Attempt to login the bot
console.log(`[${getAEDTTimestamp()}] Attempting to login...`);
bot.login(TOKEN).then(() => {
    console.log(`[${getAEDTTimestamp()}] Login successful!`);
}).catch(error => {
    console.error(`[${getAEDTTimestamp()}] Login error!:`, error);
});


// Made by, Brqx enjoy!🚀
