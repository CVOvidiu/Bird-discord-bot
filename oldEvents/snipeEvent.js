
global.snipe = new Map()

module.exports = {
    name: 'messageDelete',
    once: false,
    execute(message) {
        if(!message.author.bot) {
            global.snipe.set(message.author.id, message.content)
        }
    }
}