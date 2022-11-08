module.exports = {
    name: 'ready',
    once: false,
    execute(client) {
        setInterval(() => {
            const guild = client.guilds.cache.get('569077625826443274')
            guild.members.fetch()
                .then(res => {
                    const total = res.filter(member => !member.user.bot)
                    const channel = guild.channels.cache.get('879401759238410280')
                    channel.edit({name: `•̥🌂𝘔𝘦𝘮𝘣𝘦𝘳𝘴 • ${total.size}`})
                })
        }, 60000 * 30)
    }
}