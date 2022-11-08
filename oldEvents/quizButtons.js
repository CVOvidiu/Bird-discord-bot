const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        const guild = interaction.client.guilds.cache.get('569077625826443274')
        const member = guild.members.cache.get(interaction.user.id)
        const general = guild.channels.cache.get('569077625826443276')
        const reg = guild.channels.cache.get('569880437430812712')
        const sr = guild.channels.cache.get('570616727952556032')
        const info = guild.channels.cache.get('837687280931831849')
        const header = `<:bfa_wow:900495000289288242> **Welcome,** ${member}\n**Bine ai venit pe server!**\n<@&884834209930313778>`
        const desc = `
                **╭┄┄┄┄┄ · ｡ﾟ･｡ﾟ･**
                **┊ ✦. :: ${reg} ｡ﾟ･ Regulament**
                **┊ ✦. :: ${sr} ｡ﾟ･ Self Roles**
                **┊ ✦. :: ${info} ｡ﾟ･ Informatii**
                **┊ ✦. :: \`ﾉʙꜰᴀ\` ｡ﾟ･ Tag**
                **╰┄┄┄┄┄┄┄₊˚・｡ﾟ･**
                `

        embed2 = new MessageEmbed()
            .setColor('#3596ff')
            .setDescription(desc)
            .setTimestamp()
            .setFooter('Bine ai venit!', 'https://cdn.discordapp.com/attachments/768118506813390859/900496390080331846/hasjk.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/768118506813390859/900497135424897034/Untitled-1.png')
        if(member == undefined)
            return
        if(!member.user.avatarURL())
            embed2.setAuthor(`${member.user.username}#${member.user.discriminator}`)
        else
            embed2.setAuthor(`${member.user.username}#${member.user.discriminator}`, `${member.user.avatarURL()}`)

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('varsta1')
                    .setLabel('13-18')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('varsta2')
                    .setLabel('18+')
                    .setStyle('DANGER')
            )

        embed = new MessageEmbed()
            .setColor('#3596ff')

        if(interaction.isButton()) {
            if(interaction.customId == 'baiat') {
                global.quiz.set(interaction.user.id, 1)
                role = guild.roles.cache.get('571048541523542042')
                await member.roles.add(role)
                message = await interaction.message.fetch()
                await message.delete()
                await embed.setDescription('*A doua intrebare:*\n**Cati ani ai?**')
                await member.send({embeds:[embed], components:[row], fetchReply:true})
                    .then(msg => {
                        global.msgbuttons.set(member.id, msg.id)
                        setTimeout(async () => {
                            await msg.delete()
                                .then(async () => {
                                    count = global.quiz.get(member.id)
                                    if(count == 1) {
                                        global.quiz.delete(member.id)
                                        mainmsgid = global.mainmsgquiz.get(member.id)
                                        mainmsg = member.user.dmChannel.messages.cache.get(mainmsgid)
                                        await mainmsg.delete()
                                        global.mainmsgquiz.delete(member.id)
                                        global.quizon.delete(member.id)
                                        embed3 = new MessageEmbed()
                                            .setColor('#3596ff')
                                            .setDescription('**Timpul de completare al chestionarului a expirat. Pentru a face chestionarul din nou, scrie `verificare`. Daca intampini probleme la verificare reintra pe server. (in ultim caz, dai DM unui membru din STAFF)**')
                                        await member.send({embeds:[embed3]})
                                            .catch(error => {
                                                if(error.code == 50007) {}
                                            })
                                    }
                                })
                                .catch(error => {
                                    if(error.code == 10008) {}
                                })
                        }, 60000 * 5)
                    })

            } else if(interaction.customId == 'fata') {
                global.quiz.set(interaction.user.id, 1)
                role = guild.roles.cache.get('571048442856734741')
                await member.roles.add(role)
                message = await interaction.message.fetch()
                await message.delete()
                await embed.setDescription('*A doua intrebare:*\n**Cati ani ai?**')
                await member.send({embeds:[embed], components:[row], fetchReply:true})
                    .then(msg => {
                        global.msgbuttons.set(member.id, msg.id)
                        setTimeout(async () => {
                            await msg.delete()
                                .then(async () => {
                                    count = global.quiz.get(member.id)
                                    if(count == 1) {
                                        global.quiz.delete(member.id)
                                        mainmsgid = global.mainmsgquiz.get(member.id)
                                        mainmsg = member.user.dmChannel.messages.cache.get(mainmsgid)
                                        await mainmsg.delete()
                                        global.mainmsgquiz.delete(member.id)
                                        global.quizon.delete(member.id)
                                        embed3 = new MessageEmbed()
                                            .setColor('#3596ff')
                                            .setDescription('**Timpul de completare al chestionarului a expirat. Pentru a face chestionarul din nou, scrie `verificare`. Daca intampini probleme la verificare reintra pe server. (in ultim caz, dai DM unui membru din STAFF)**')
                                        await member.send({embeds:[embed3]})
                                            .catch(error => {
                                                if(error.code == 50007) {}
                                            })
                                    }
                                })
                                .catch(error => {
                                    if(error.code == 10008) {}
                                })
                        }, 60000 * 5)
                    })

            } else if(interaction.customId == 'varsta1') {
                role = guild.roles.cache.get('836942902164717598')
                verify = guild.roles.cache.get('569096430514339852')
                noverify = guild.roles.cache.get('878972176827551746')
                if(!member.roles.cache.find(role => role.id == verify.id)) {
                    await general.send(header)
                    await general.send({embeds:[embed2]})
                }
                await member.roles.add(verify)
                await member.roles.add(role)
                await member.roles.remove(noverify)
                message = await interaction.message.fetch()
                    .catch(error => {
                        if(error.code == 10008) {}
                    })
                await message.delete()
                    .catch(error => {
                        if(error.code == 10008) {}
                    })
                mainmsgid = global.mainmsgquiz.get(member.id)
                mainmsg = member.user.dmChannel.messages.cache.get(mainmsgid)
                await mainmsg.delete()
                global.mainmsgquiz.delete(member.id)
                global.quiz.delete(member.id)
                global.quizon.delete(member.id)
                await embed.setDescription('*Felicitari!*\n**Ai terminat chestionarul. Acum poti sa accesezi serverul linistit.**\n**» Te-as ruga sa:**\n*- Citesti* **rules**\n*- Citesti* **๑ɪɴꜰᴏ**\n*- Sa iti alegi rolurile de pe* **๑ꜱᴇʟꜰ-ʀᴏʟᴇꜱ**\n\n*Have fun pe server!~*')
                await embed.setFooter('Am fost creat de Lectusﾉʙꜰᴀ#3916.', `${interaction.client.user.displayAvatarURL()}`)
                await member.send({embeds:[embed], fetchReply:true})
                    .then(msg => {
                        setTimeout(async () => {
                            await msg.delete()
                                .catch(error => {
                                    if(error.code == 10008) {}
                                })
                        }, 60000 * 5)
                    })

            } else if(interaction.customId == 'varsta2') {
                role = guild.roles.cache.get('836942982968115230')
                verify = guild.roles.cache.get('569096430514339852')
                noverify = guild.roles.cache.get('878972176827551746')
                if(!member.roles.cache.find(role => role.id == verify.id)) {
                    await general.send(header)
                    await general.send({embeds:[embed2]})
                }
                await member.roles.add(verify)
                await member.roles.add(role)
                await member.roles.remove(noverify)
                message = await interaction.message.fetch()
                    .catch(error => {
                        if(error.code == 10008) {}
                    })
                await message.delete()
                    .catch(error => {
                        if(error.code == 10008) {}
                    })
                mainmsgid = global.mainmsgquiz.get(member.id)
                mainmsg = member.user.dmChannel.messages.cache.get(mainmsgid)
                await mainmsg.delete()
                global.mainmsgquiz.delete(member.id)
                global.quiz.delete(member.id)
                global.quizon.delete(member.id)
                await embed.setDescription('*Felicitari!*\n**Ai terminat chestionarul. Acum poti sa accesezi serverul linistit.**\n**» Te-as ruga sa:**\n*- Citesti* **rules**\n*- Citesti* **๑ɪɴꜰᴏ**\n*- Sa iti alegi rolurile de pe* **๑ꜱᴇʟꜰ-ʀᴏʟᴇꜱ**\n\n*Have fun pe server!~*')
                await embed.setFooter('Am fost creat de Lectusﾉʙꜰᴀ#3916.', `${interaction.client.user.displayAvatarURL()}`)
                await member.send({embeds:[embed], fetchReply:true})
                    .then(msg => {
                        setTimeout(async () => {
                            await msg.delete()
                                .catch(error => {
                                    if(error.code == 10008) {}
                                })
                        }, 60000 * 5)
                    })
            }
        }
    }
}