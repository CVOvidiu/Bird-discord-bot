const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const User = require('../schemas/invites')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whoinvited')
        .addUserOption(opt => opt.setName('target').setDescription('Cine a invitat membrul'))
        .setDescription('Vezi cine te-a invitat / a invitat membrul pe server.'),
    async execute(interaction) {
        embed = new MessageEmbed()
            .setColor('#3596ff')
        const user = interaction.options.getUser('target')
        if(!user) {
            await User.find({'invites':interaction.member.id})
                .then(result => {
                    if(result.length == 0) {
                        embed.setDescription(`**Nu stiu cine te-a invitat pe server.**`)
                    } else {
                        const inviter = result[0]._id
                        const inv_obj = interaction.client.users.cache.get(inviter)
                        embed.setDescription(`**\`${inv_obj.username}\` te-a invitat pe server.**`)
                    }
                })
        } else {
            await User.find({'invites':user.id})
                .then(result => {
                    console.log(result)
                    if(result.length == 0) {
                        embed.setDescription(`**Nu stiu cine l-a invitat pe \`${user.username}\`**`)
                    } else {
                        const inviter = result[0]._id
                        const inv_obj = interaction.client.users.cache.get(inviter)
                        console.log(inv_obj)
                        embed.setDescription(`**\`${user.username}\` a fost invitat de catre \`${inv_obj.username}\`.**`)
                    }
                })
        }
        await interaction.reply({embeds:[embed], ephemeral:true})
    }
}