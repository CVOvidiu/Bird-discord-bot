const { Client } = require("discord.js")

// Create new client instance
const client = new Client({intents:['GUILDS', 'GUILD_MESSAGES', 'GUILD_INVITES', 'GUILD_MEMBERS', 'DIRECT_MESSAGES'], partials: ['CHANNEL']})

// When bot is ready
client.on('ready', () => {
    console.log('Ready!')
})

// Login to Discord with client's token (token stored in Heroku's Config Vars)
client.login(process.env.token)