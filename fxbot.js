const { Client, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');

const TOKEN = 'BOT_TOKEN'; // Replace with your bot token
const CHANNEL_ID = 'CHANNEL_ID';  // The channel where the bot will post

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

let currentChannel = null;
let lastEmbedMessage = null;
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

bot.once('ready', async () => {
    console.log(`[${getAEDTTimestamp()}] Logged in as ${bot.user?.tag}`);
    bot.user.setActivity('Radio Waves', { type: ActivityType.Listening });
    
    await cleanupExistingEmbeds();
    await changeRadioChannel();
    scheduleNextUpdate();
});

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

function scheduleNextUpdate() {
    const now = new Date();
    const nextRun = new Date(now);
    nextRun.setUTCHours(20, 0, 0, 0);
    if (nextRun <= now) nextRun.setUTCDate(nextRun.getUTCDate() + 1);
    
    console.log(`[${getAEDTTimestamp()}] Next update scheduled for: ${nextRun.toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}`);
    setTimeout(() => {
        changeRadioChannel();
        setInterval(changeRadioChannel, 24 * 60 * 60 * 1000);
    }, nextRun - now);
}

async function changeRadioChannel() {
    const selectedRange = frequencyRanges[Math.floor(Math.random() * frequencyRanges.length)];
    currentChannel = parseFloat((Math.random() * (selectedRange.max - selectedRange.min) + selectedRange.min).toFixed(2));
    
    const channel = bot.channels.cache.get(CHANNEL_ID);
    if (!channel) return;
    
    if (lastEmbedMessage) await lastEmbedMessage.delete().catch(console.error);
    
    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('<a:wifi:1347185083978874920> Radio FX Channel Update')
        .setDescription(`New Channel Set: **${currentChannel.toFixed(2)} MHz**. Stay tuned!`);
    
    lastEmbedMessage = await channel.send({ embeds: [embed] });
}

bot.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    console.log(`[${getAEDTTimestamp()}] Received message: "${message.content}" from ${message.author.username} (${message.author.id}) in ${message.guild?.name || 'DM'}`);

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
            .setDescription(currentChannel ? `Current Channel: **${currentChannel.toFixed(2)} MHz**. Keep your radios tuned!` : "No channel has been set yet. Use `!newfx` to set one.");
        
        const sentMessage = await message.channel.send({ embeds: [embed] });
        setTimeout(() => sentMessage.delete().catch(console.error), 15000);
    }
});

console.log(`[${getAEDTTimestamp()}] Attempting to login...`);
bot.login(TOKEN).then(() => {
    console.log(`[${getAEDTTimestamp()}] Login successful!`);
}).catch(error => {
    console.error(`[${getAEDTTimestamp()}] Login error!:`, error);
});
