const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Displays the avatar of the selected member, or your own avatar.')
        .addUserOption((opt) => opt.setName('target').setDescription('The member\'s avatar to show')),
    async execute(interaction) {
        embed = new MessageEmbed()
            .setColor('#3596ff')
            .setTimestamp()
        const user = interaction.options.getUser('target')
        if(user) {
            embed.setTitle(`${user.username}'s avatar:`)
            embed.setImage(`${user.displayAvatarURL({dynamic: true, size: 1024})}`)
            embed.setFooter(`${interaction.user.username}`, `${interaction.user.displayAvatarURL({dynamic: true})}`)
            
            channel = interaction.channel
            await interaction.reply({embeds:[embed], fetchReply:true})
                .then((msg) => {
                    setTimeout(() => {
                        msg.delete()
                            .catch((error) => {
                                if(error.code == 10008) {}
                            })
                    }, 30000)
                })
        }
        else {
            embed.setTitle('Your avatar:')
            embed.setImage(`${interaction.user.displayAvatarURL({dynamic: true, size: 1024})}`)
            
            channel = interaction.channel
            await interaction.reply({embeds:[embed], fetchReply:true})
                .then((msg) => {
                    setTimeout(() => {
                        msg.delete()
                            .catch((error) => {
                                if(error.code == 10008) {}
                            })
                    }, 30000)
                })
        }
    }
}