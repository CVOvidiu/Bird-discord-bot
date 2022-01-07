const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        if(!message.author.bot && message.channel.type != 'DM') {
            const ls = ['https://discord.gg/', 'discord.gg/']
            const author = message.guild.members.cache.get(message.author.id)
            const embed = new MessageEmbed()
                        .setColor('#3596ff')
                        .setDescription(`\`${author.user.username}\` **a luat ban.**\n**Motiv:**\`${message.content}\``)
            const logs = message.guild.channels.cache.get(`768118506813390859`)
            for(let i = 0; i < ls.length; i++)
                if(message.content.includes(ls[i])) {
                    message.delete()
                    author.ban({reason:`Promoted server`})
                    logs.send({embeds:[embed]})
                    break
                }
        }
    }
}