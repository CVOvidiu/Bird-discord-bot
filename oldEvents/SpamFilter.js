const User = require('../schemas/tagTime')
const { MessageEmbed } = require("discord.js")

const spamcd = new Map()
const lastmsg = new Map()
const lastmsgchars = new Map()
const similarcd = new Map()

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        if(!message.author.bot && message.channel.type != 'DM' && message.channel.id != '838179932823093288') {
            const embed = new MessageEmbed()
                    .setColor('#3596ff')
            // Similar Messages
            let ls = []
            const msg_c = message.content
            for(let i = 0; i <= msg_c.length - 1; i++) {
                if(!ls.includes(msg_c[i]))
                    ls.push(msg_c[i])
            }
            ls.sort()
            if(!lastmsgchars.get(message.author.id)) {
                lastmsgchars.set(message.author.id, ls)
                similarcd.set(message.author.id, 1)
            } else {
                const ls2 = lastmsgchars.get(message.author.id)
                let sw = 0
                if(ls.length != ls2.length) {
                    lastmsgchars.set(message.author.id, ls)
                    sw = 1
                } else {
                    for(let i = 0; i <= ls.length; i++)
                        if(ls[i] != ls2[i]) {
                            lastmsgchars.set(message.author.id, ls)
                            sw = 1
                        }
                }
                if(sw == 0) {
                    if(!similarcd.get(message.author.id)) {
                        similarcd.set(message.author.id, 2)
                    } else {
                        similarcd.set(message.author.id, similarcd.get(message.author.id) + 1)
                        const times = similarcd.get(message.author.id)
                        if(times == 10 && message.content.length == 0) {
                            embed.setDescription(`**${message.author}, a luat mute \`5\` minute. Motiv: \`Similar message spam\`**`)
                            message.channel.send({embeds:[embed]})
                                .then((msg) => {
                                    setTimeout(() => {
                                        msg.delete()
                                            .catch(error => {
                                                if(error.code == 10008) {}
                                            })
                                    }, 30000)
                                })
                            const muted = message.guild.roles.cache.get('835869598335238164')
                            message.member.roles.add(muted)
                            User.exists({_id: message.author.id})
                                .then(async (exists) => {
                                    if(exists) {
                                        await User.findByIdAndUpdate({_id: message.author.id}, {$set: {"mutedCD": 5}})
                                    } else {
                                        await User.create({
                                            _id: message.author.id,
                                            "mutedCD": 5
                                        })
                                    }
                                })
                            similarcd.delete(message.author.id)
                            return
                        }
                        if(times == 4 && message.content.length != 0) {
                            embed.setDescription(`**${message.author}, a luat mute \`3\` minute. Motiv: \`Similar message spam\`**`)
                            message.channel.send({embeds:[embed]})
                                .then((msg) => {
                                    setTimeout(() => {
                                        msg.delete()
                                            .catch(error => {
                                                if(error.code == 10008) {}
                                            })
                                    }, 30000)
                                })
                            const muted = message.guild.roles.cache.get('835869598335238164')
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
                            similarcd.delete(message.author.id)
                            return
                        }
                    }
                }
            }

            // SpeedTyping
            lastmsg.set(message.author.id, message.id)
            if(!spamcd.get(message.author.id))
                spamcd.set(message.author.id, 0)
            spamcd.set(message.author.id, spamcd.get(message.author.id) + 1)
            const times = spamcd.get(message.author.id)
            if(times == 4) {
                spamcd.delete(message.author.id)
                embed.setDescription(`**${message.author}, a luat mute \`3\` minute. Motiv: \`Spam\`**`)
                message.channel.send({embeds:[embed]})
                    .then((msg) => {
                        setTimeout(() => {
                            msg.delete()
                                .catch(error => {
                                    if(error.code == 10008) {}
                                })
                        }, 30000)
                    })
                const muted = message.guild.roles.cache.get('835869598335238164')
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
            setTimeout(() => {
                if(lastmsg.get(message.author.id) == message.id) {
                    spamcd.delete(message.author.id)
                    lastmsg.delete(message.author.id)
                }
            }, 2000)
        }
    }
}