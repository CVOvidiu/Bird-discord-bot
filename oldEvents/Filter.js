const User = require('../schemas/tagTime')
const { MessageEmbed } = require("discord.js")

const filtercd = new Map()

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        if(!message.author.bot && message.channel.type != 'DM') {
            const ls = [
                'pula', 'nigger', 'nigga', 'nigg',
                'pizda', 'gaoz', 'gaozu', 'gaozul',
                'fut', 'futu-ti', 'futai', 'labarim', 'muie',
                'sperma', 'pl', 'sloboz', 'coaiele', 'coaie',
                'fmm', 'pla', 'pzda', 'pzd', 'mue', 'futut', 'nefutut',
                'fute'
            ]
            let sw = 0
            ls.forEach(entry => {
                if(message.content.toLowerCase().includes(entry)) {
                    const delims = [
                        undefined, ' ', ',', '?', '.', "!", "(", ")", '*', '_'
                    ]
                    delims.forEach(entry1 => {
                        delims.forEach(entry2 => {
                            if(message.content[message.content.toLowerCase().indexOf(entry) - 1] == entry1 && message.content[message.content.toLowerCase().indexOf(entry) + entry.length] == entry2)
                                sw = 1
                        })
                    })
                }
            })
            if(sw == 1) {
                await message.delete()
                const embed = new MessageEmbed()
                    .setColor('#3596ff')
                const muted = message.guild.roles.cache.get('835869598335238164')
                const times = filtercd.get(message.author.id)
                if(!times)
                    filtercd.set(message.author.id, 0)
                filtercd.set(message.author.id, times + 1)
                if(times != 0) {
                    filtercd.delete(message.author.id)
                    embed.setDescription(`**${message.author}, a luat mute \`3\` minute. Motiv:** \`Limbaj explicit\``)
                    message.member.roles.add(muted)
                    User.exists({_id: message.author.id})
                        .then(async (exists) => {
                            if(exists) {
                                await User.findByIdAndUpdate({_id: message.author.id}, {$set: {"mutedCD": 3}})
                            } else {
                                await User.create({
                                    _id: message.author.id,
                                    "mutedCD": 3
                                })
                            }
                        })
                }
                await message.channel.send({embeds:[embed]})
                    .then((msg) => {
                        setTimeout(() => {
                            msg.delete()
                                .catch(error => {
                                    if(error.code == 10008) {}
                                })
                        }, 30000)
                    })
            }
        }
    }
}