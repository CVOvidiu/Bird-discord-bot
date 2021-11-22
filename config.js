const fs = require('fs')
const { Client, Collection } = require("discord.js")

// Create new client instance
const client = new Client({intents:['GUILDS', 'GUILD_MESSAGES', 'GUILD_INVITES', 'GUILD_MEMBERS', 'DIRECT_MESSAGES'], partials: ['CHANNEL']})

// Event-files handling
const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'))
for(const file of eventFiles) {
    const event = require(`./events/${file}`)
    if(event.once)
        client.once(event.name, (...args) => event.execute(...args))
    else
        client.on(event.name, (...args) => event.execute(...args))
}

// Command-files handling
client.commands = new Collection()
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'))
for(const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.data.name, command)
}

// Slash commands
client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand())
        return
    
    const command = client.commands.get(interaction.commandName)

    if(!command)
        return

    try {
        await command.execute(interaction)
    } catch(error) {
        console.error(error)
        await interaction.reply({content: 'Error!'})
    }
})

// Database
const mongoose = require('mongoose')
if(!process.env.mongooseConnectionString) return
    mongoose.connect(process.env.mongooseConnectionString)
        .then(() => console.log('Connected to mongodb.'))

// Login to Discord with client's token (token stored in Heroku's Config Vars)
client.login(process.env.token)