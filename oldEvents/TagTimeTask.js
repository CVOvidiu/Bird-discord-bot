const User = require('../schemas/tagTime')

module.exports = {
    name: 'ready',
    once: false,
    execute(client) {
        setInterval(() => {
            const guild = client.guilds.cache.get('569077625826443274')
            guild.members.fetch()
                .then(res => {
                    const taggers = res.filter(member => member.user.username.includes("ﾉʙꜰᴀ"))
                    const result = taggers.map(member => member.id)
                    result.forEach(entryID => {
                        User.exists({_id: entryID})
                            .then(async (exists) => {
                                if(exists) {
                                    await User.findByIdAndUpdate({_id: entryID}, {$inc: {"time": 1}})
                                } else {
                                    await User.create({
                                        _id: entryID,
                                        "time": 0
                                    })
                                }
                            })
                            .catch(error => {
                                console.log("O eroare in TagTimeTask.")
                                console.error(error)
                            })
                    })
                })
        }, 60000)
    }
}