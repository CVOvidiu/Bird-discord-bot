const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const User = require('../schemas/invites')

module.exports = { 
    data: new SlashCommandBuilder()
        .setName('invites')
        .addUserOption(opt => opt.setName('target').setDescription('Membrul caruia vrei sa ii vezi inviteurile'))
        .setDescription('Verifica cate invite-uri ai / are un membru.'),
    async execute(interaction) {
        embed = new MessageEmbed()
            .setColor('#3596ff')
        const user = interaction.options.getUser('target')
        if(!user) {
            await User.find({_id:interaction.member.id})
                .then(result => {
                    if(result.length == 0)
                        invite_count = 0
                    else
                        invite_count = result[0].invites.length
                })
            embed.setDescription(`**Ai \`${invite_count}\` inviteuri.**`)
        } else {
            await User.find({_id:user.id})
                .then(result => {
                    if(result.length == 0)
                        invite_count = 0
                    else
                        invite_count = result[0].invites.length
                })
            embed.setDescription(`**\`${user.username}\` are \`${invite_count}\` inviteuri.**`)
        }
        await interaction.reply({embeds:[embed], ephemeral:true})
    }
}