const User = require('../schemas/tagTime')

module.exports = {
    name: 'ready',
    once: false,
    async execute(client) {
        const guild = client.guilds.cache.get('569077625826443274')
        setInterval(() => {
            for(let[key, value] of global.joinraid_ls) {
                value -= 1
                if(value == 0) {
                    console.log("Joinraid Timeout")
                    global.joinraid.delete(key)
                    global.joinraid_ls.delete(key)
                } else {
                    global.joinraid_ls.set(key, value)
                }
            }
        }, 60000)

        setInterval(async () => {
            const result = await User.find({"mutedCD": {$exists: true}})
            result.forEach(async entry => {
                await User.findByIdAndUpdate({_id: entry._id}, {$inc: {"mutedCD": -1}})
                if(entry.mutedCD <= 1) {
                    const member = guild.members.cache.get(entry._id)
                    if(!member) {}
                    else {
                        const muted = guild.roles.cache.get('835869598335238164')
                        await member.roles.remove(muted)
                    }
                    await User.findByIdAndUpdate({_id: entry._id}, {$unset: {"mutedCD": 1}})
                }
            })
        }, 60000)
        setInterval(async () => {
            const result = await User.find({"dailyCD": {$exists: true}})
            result.forEach(async entry => {
                await User.findByIdAndUpdate({_id: entry._id}, {$inc: {"dailyCD": -1}})
                if(entry.dailyCD <= 1) {
                    await User.findByIdAndUpdate({_id: entry._id}, {$unset: {"dailyCD": 1}})
                }
            })
        }, 60000)
    }
}