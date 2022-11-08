module.exports = {
    name: 'ready',
    once: false,
    execute(client) {
        setInterval(() => {
            const guild = client.guilds.cache.get('569077625826443274')
            guild.members.fetch()
                .then(res => {
                    const taggers = res.filter(member => member.user.username.includes("ﾉʙꜰᴀ"))
                    const channel = guild.channels.cache.get('899271978987438090')
                    channel.edit({name: `•̥💙𝘍𝘢𝘮𝘪𝘭𝘺 • ${taggers.size}`})
                })
        }, 60000 * 30)
    }
}   