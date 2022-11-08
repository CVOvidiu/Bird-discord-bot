var moment = require('moment-timezone')

module.exports = {
    name: 'ready',
    once: false,
    execute(client) {
        setInterval(() => {
            const guild = client.guilds.cache.get('569077625826443274')
            const chat = guild.channels.cache.get('569077625826443276')
            const time = moment().tz('Europe/Bucharest').format('HH:mm')
            if(time == '00:00')
                chat.send('**Este ora** `00:00`**, pune-ti o dorinta!**')
        }, 60000)
    }
}