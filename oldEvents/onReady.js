const { MessageEmbed } = require("discord.js")

const wait = require("timers/promises").setTimeout;

global.inv_ls = new Map()

// When bot goes online
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.user.setPresence({status: 'idle', activities:[{name: '» BornFromAshes «', type:'LISTENING'}]})
        await wait(1000);
        console.log(`Bot online! Logged in as ${client.user.tag}`)
        const guild = client.guilds.cache.get('569077625826443274')
        const firstInvites = await guild.invites.fetch()
        global.inv_ls.set(guild.id, new Map(firstInvites.map(inv => [inv.code, inv.uses])))
        console.log(`inv_ls after ready`)
        console.log(global.inv_ls)
        const log = guild.channels.cache.get('898551606390427649')
        const embed = new MessageEmbed()
            .setColor('#3596ff')
            .setDescription('**Who am I? (Bot restarted)**')
        await log.send({embeds:[embed]})
    }
}