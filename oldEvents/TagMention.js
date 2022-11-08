// TODO: redo

const { MessageEmbed } = require("discord.js")

const cd = new Map()

module.exports = {
    name: 'messageCreate',
    once: false,
    execute(message, client) {
        const cooldown = cd.get(message.author.id)
        let sw = 0
        if(message.content.includes('tag')) {
            if(message.content.length == 3)
                sw = 1
            else if(message.content[message.content.indexOf('tag') - 1] == ' ' && message.content[message.content.indexOf('tag') + 3] == ' ')
                sw = 1
        }
        if(!cooldown && sw == 1) {
            const embed = new MessageEmbed()
                .setColor('#3596ff')
                .setDescription('**Daca pui tagul** `ﾉʙꜰᴀ` **in nume primesti:** \n <:bfa_arrow:884870037586980944> _Gradul_ `Family` \n <:bfa_arrow:884870037586980944> _Acces la grade de culoare_ \n <:bfa_arrow:884870037586980944> _Sansa sa primesti mai mult din comanda de daily_')
            message.channel.send({embeds:[embed]})
                .then((msg) => {
                    setTimeout(() => {
                        msg.delete()
                            .catch((error) => {
                                if(error.code == 10008) {}
                            })
                    }, 60000 * 5)
                })
            cd.set(message.author.id, Date.now() + 60000 * 5)
            setTimeout(() => {
                cd.delete(message.author.id)
            }, 60000 * 5)
        }
    }
}