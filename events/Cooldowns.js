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
    }
}