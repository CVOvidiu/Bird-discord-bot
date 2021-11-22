const { MessageEmbed } = require("discord.js")

const wait = require("timers/promises").setTimeout;

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        await wait(1000)
        console.log(`Main online! Logged in as ${client.user.tag}`)
        const guild = client.guilds.cache.get('910643775318130708')
        const log = guild.channels.cache.get('912414550266105906')
        const embed = new MessageEmbed()
            .setColor('#3596ff')
            .setDescription('**Bot restarted.**')
        await log.send({embeds:[embed]})
    }
}