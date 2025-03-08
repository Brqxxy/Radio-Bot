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
let lastEmbedMessage = null; // Store the last embed message

// Define multiple frequency ranges to choose from
const frequencyRanges = [
{ min: 26.96, max: 27.40 },   // FX #1
{ min: 28.00, max: 29.70 },   // FX #2
{ min: 30.00, max: 50.00 },   // FX #3
{ min: 50.00, max: 54.00 },   // FX #4
{ min: 72.00, max: 76.00 },   // FX #5
{ min: 108.00, max: 137.00 }, // FX #6
{ min: 136.00, max: 174.00 }, // FX #7
{ min: 174.00, max: 216.00 }, // FX #8
{ min: 216.00, max: 222.00 }, // FX #9
{ min: 222.00, max: 225.00 }, // FX #10
{ min: 300.00, max: 420.00 }, // FX #11
{ min: 420.00, max: 450.00 }, // FX #12
{ min: 450.00, max: 470.00 }, // FX #13
{ min: 470.00, max: 512.00 }, // FX #14
{ min: 764.00, max: 776.00 }, // FX #15
{ min: 794.00, max: 806.00 }, // FX #16
{ min: 806.00, max: 824.00 }, // FX #17
{ min: 849.00, max: 869.00 }, // FX #18
{ min: 869.00, max: 894.00 }, // FX #19
{ min: 902.00, max: 928.00 }, // FX #20
];

bot.once('ready', async () => {
    console.log(`Logged in as ${bot.user?.tag}`);
    
    // Set the custom status - related to radio frequencies
    bot.user.setActivity('Radio Waves', { type: ActivityType.Listening });
    
    // Find and delete any existing embed messages first to prevent duplicates after a crash
    await cleanupExistingEmbeds();

    // Send an update after cleanup
    await changeRadioChannel();

    // Then schedule the next update at 7:00 AM AEDT
    scheduleNextUpdate();
});

// Function to find and delete any existing radio channel embeds
async function cleanupExistingEmbeds() {
    try {
        const channel = bot.channels.cache.get(CHANNEL_ID);
        if (!channel) {
            console.log(`Channel with ID ${CHANNEL_ID} not found`);
            return;
        }

        // Fetch recent messages (up to 100, which is the API limit per request)
        const messages = await channel.messages.fetch({ limit: 100 });
        
        // Filter to find messages from this bot that contain the Radio FX embed
        const botEmbeds = messages.filter(msg => 
            msg.author.id === bot.user.id && 
            msg.embeds.length > 0 && 
            msg.embeds[0].title && 
            msg.embeds[0].title.includes('Radio FX Channel Update')
        );

        // Delete all found embeds except the most recent one
        if (botEmbeds.size > 0) {
            console.log(`Found ${botEmbeds.size} existing Radio FX embeds. Cleaning up...`);
            
            // Delete all but keep track of the latest one
            const deletePromises = [];
            botEmbeds.forEach(msg => {
                deletePromises.push(msg.delete().catch(err => 
                    console.error(`Failed to delete message ${msg.id}:`, err)
                ));
            });
            
            await Promise.all(deletePromises);
            console.log('Successfully cleaned up existing embeds.');
        } else {
            console.log('No existing Radio FX embeds found.');
        }
    } catch (error) {
        console.error('Error during cleanup of existing embeds:', error);
    }
}

function scheduleNextUpdate() {
    const now = new Date();
    const nextRun = new Date(now);

    nextRun.setUTCHours(20, 0, 0, 0); // 7:00 AM AEDT = 8:00 PM UTC

    if (nextRun <= now) {
        nextRun.setUTCDate(nextRun.getUTCDate() + 1); // Move to the next day if it's past today's 7 AM AEDT
    }

    const timeUntilNextRun = nextRun - now;
    console.log(`Next update scheduled for: ${nextRun.toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}`);

    setTimeout(() => {
        changeRadioChannel();
        setInterval(changeRadioChannel, 24 * 60 * 60 * 1000); // Schedule it to repeat every 24 hours
    }, timeUntilNextRun);
}

async function changeRadioChannel() {
    // Select a random frequency range
    const selectedRange = frequencyRanges[Math.floor(Math.random() * frequencyRanges.length)];
    
    // Generate a random frequency within the selected range with exactly 2 decimal places
    currentChannel = parseFloat((Math.random() * (selectedRange.max - selectedRange.min) + selectedRange.min).toFixed(2));
    
    const channel = bot.channels.cache.get(CHANNEL_ID);

    if (channel) {
        // Delete the previous embed if it exists
        if (lastEmbedMessage) {
            try {
                await lastEmbedMessage.delete();
                console.log('Deleted previous embed message');
            } catch (error) {
                console.error('Failed to delete previous embed:', error);
            }
        }

        // Check for any other existing embeds that might have been created during a crash/restart
        try {
            const messages = await channel.messages.fetch({ limit: 10 });
            const botEmbeds = messages.filter(msg => 
                msg.author.id === bot.user.id && 
                msg.embeds.length > 0 && 
                msg.embeds[0].title && 
                msg.embeds[0].title.includes('Radio FX Channel Update')
            );
            
            if (botEmbeds.size > 0) {
                console.log(`Found ${botEmbeds.size} existing Radio FX embeds. Deleting...`);
                for (const msg of botEmbeds.values()) {
                    await msg.delete().catch(err => 
                        console.error(`Failed to delete message ${msg.id}:`, err)
                    );
                }
            }
        } catch (error) {
            console.error('Error checking for existing embeds:', error);
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('<a:wifi:1347185083978874920> Radio FX Channel Update')
            .setDescription(`New Channel Set: **${currentChannel.toFixed(2)} MHz**. Stay tuned!`)
            .setFooter({ text: 'Use `!newfx` to change or `!currentfx` to check.' });

        lastEmbedMessage = await channel.send({ embeds: [embed] });
        console.log(`Posted new radio channel: ${currentChannel} MHz`);
    } else {
        console.log(`Channel with ID ${CHANNEL_ID} not found`);
    }
}

bot.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    console.log(`Received message: "${message.content}"`);

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

console.log('Attempting to login...');
bot.login(TOKEN).then(() => {
    console.log('Login successful!');
}).catch(error => {
    console.error('Login error:', error);
});


// Made by, Brqx enjoy!🚀
