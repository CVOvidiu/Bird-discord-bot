const Db = require('../schemas/ServersConfig')

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member) {
        const result = await Db.find({_id: member.guild.id})

        // Log when member joined
        const logs_id = result[0].channels.joinleave
        if(logs_id != undefined) {
            const logs = member.guild.channels.cache.get(logs_id)
            await logs.send(`${member} joined.`)
        }
    }
}