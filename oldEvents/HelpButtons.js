const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction, client) {
        if(interaction.isButton()) {
            if(interaction.customId == 'primary') {
                message = await interaction.message.fetch()
                embed = new MessageEmbed()
                    .setColor('#3596ff')
                    .setTitle('Help Menu 2')
                    .setFooter('I was created by Lectusﾉʙꜰᴀ#3916.\nIf you have any suggestions or encounter any problems, DM him.', `${interaction.client.user.displayAvatarURL()}`)
                await message.delete()
                await interaction.reply({embeds:[embed], fetchReply:true})
                    .then((msg) => {
                        setTimeout(() => {
                            msg.delete()
                                .catch(console.error) // If bots restarts don't kill the instance
                        }, 30000)
                    })
            } else if(interaction.customId == 'admin') {
                message = await interaction.message.fetch()
                embed = new MessageEmbed()
                    .setColor('3596ff')
                    .setTitle('Administrator Menu')
                    .setFooter('I was created by Lectusﾉʙꜰᴀ#3916.\nIf you have any suggestions or encounter any problems, DM him.', `${interaction.client.user.displayAvatarURL()}`)
                    .addFields(
                        {name: 'prune (amount)', value: 'Delete up to 99 messages.'}
                    )
                await message.delete()
                await interaction.reply({embeds:[embed], fetchReply:true})
                    .then((msg) => {
                        setTimeout(() => {
                            msg.delete()
                                .catch(console.error)
                        }, 30000)
                    })
            } else if(interaction.customId == 'features') {
                message = await interaction.message.fetch()
                embed = new MessageEmbed()
                    .setColor('3596ff')
                    .setTitle('Features')
                    .setFooter('I was created by Lectusﾉʙꜰᴀ#3916.\nIf you have any suggestions or encounter any problems, DM him.', `${interaction.client.user.displayAvatarURL()}`)
                    .addFields(
                        {name: 'TagChannelCounter', value: 'Counts members that have server tag in their username and displays on special voicechannel.'},
                        {name: 'Join/Leave', value: 'Sends message when someone leaves or joins the server.'},
                        {name: 'Trigger words', value: 'tag'},
                        {name: 'Tag-System', value: 'When members puts on the tag in their username they get a special role.'},
                        {name: 'Verify-System', value: 'When someone joins the server, it\`s prompted to complete a quiz. If quiz time expires, they can send a DM to bot containing \'verificare\' to get prompted to complete the quiz again.'}
                    )
                await message.delete()
                await interaction.reply({embeds:[embed], fetchReply:true})
                    .then((msg) => {
                        setTimeout(() => {
                            msg.delete()
                                .catch(console.error)
                        }, 30000)
                    })
            }
        }
    }
}