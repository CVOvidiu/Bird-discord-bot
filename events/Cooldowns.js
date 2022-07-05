module.exports = {
    name: 'ready',
    once: false,
    async execute(client) {
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