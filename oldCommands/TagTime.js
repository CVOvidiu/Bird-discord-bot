const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const User = require('../schemas/tagTime')

function time_format(time, user_string) {
    const embed = new MessageEmbed()
            .setColor('#3596ff')

    const months = parseInt(time / 43200)
    const days = parseInt((time - months * 43200) / 1440)
    const hours = parseInt((time - (months * 43200) - (days * 1440)) / 60)
    const minutes = parseInt(time - (months * 43200) - (days * 1440) - (hours * 60))
    if(time < 60)
        embed.setDescription(`**${user_string} had the tag for \`${minutes}\` minutes.**`)
    else if(time < 24 * 60)
        embed.setDescription(`**${user_string} had the tag for \`${hours}\` hours and \`${minutes}\` minutes.**`)
    else if(time < 24 * 60 * 30)
        embed.setDescription(`**${user_string} had the tag for \`${days}\` days, \`${hours}\` hours and \`${minutes}\` minutes.**`)
    else if(time >= 24 * 60 * 30)
        embed.setDescription(`**${user_string} had the tag for \`${months}\` months, \`${days}\` days, \`${hours}\` hours and \`${minutes}\` minutes.**`)
    return embed
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tagtime')
        .setDescription('Check how long you had the tag on.')
        .addUserOption((opt) => opt.setName('target').setDescription('The member\'s time to show')),
    async execute(interaction) {
        const user = interaction.options.getUser('target')
        if(user) {
            if(!user.username.includes("ﾉʙꜰᴀ"))
                await interaction.reply({content: `**${user.username} does not have the tag on.**`, ephemeral: true})
            else {
                const result = await User.find({_id:user.id})
                const time = result[0].time
                const embed = time_format(time, `\`${user.username}\``)
                await interaction.reply({embeds:[embed], fetchReply:true})
                    .then(msg => {
                        setTimeout(() => {
                            msg.delete()
                                .catch(error => {
                                    if(error.code == 10008) {}
                                })
                        }, 30000)
                    })
            }
        } else {
            if(!interaction.user.username.includes("ﾉʙꜰᴀ"))
                await interaction.reply({content: `**You do not have the tag on.**`, ephemeral: true})
            else {
                const result = await User.find({_id:interaction.user.id})
                const time = result[0].time
                const embed = time_format(time, 'You')
                await interaction.reply({embeds:[embed], fetchReply:true})
                    .then(msg => {
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