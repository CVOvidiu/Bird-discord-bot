const { MessageEmbed } = require("discord.js")

const wait = require("timers/promises").setTimeout;

global.invites = new Map()

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.user.setPresence({status: 'idle', activities:[{name: 'BornFromAshes', type:'LISTENING'}]})
        await wait(1000)
        console.log(`Main online! Logged in as ${client.user.tag}`)

        client.guilds.cache.forEach(async guild => {
            const firstInvites = await guild.invites.fetch()
            global.invites.set(guild.id, new Map(firstInvites.map(inv => [inv.code, inv.uses])))
        })
        const dev_guild = client.guilds.cache.get('569077625826443274')
        const log = dev_guild.channels.cache.get('768118506813390859')
        const embed = new MessageEmbed()
            .setColor('#3596ff')
            .setDescription('**Bot restarted.**')
        await log.send({embeds:[embed]})
    }
}