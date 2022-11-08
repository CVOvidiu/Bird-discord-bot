const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setDescription('See the last deleted message of the selected member.')
        .addUserOption((opt) => opt.setName('target').setDescription('The member\'s last deleted message.')),
    async execute(interaction) {
        embed = new MessageEmbed()
            .setColor('#3596ff')
            .setTimestamp()
            .setTitle(`Sniped!`)
        const user = interaction.options.getUser('target')
        if(user) {
            const string = global.snipe.get(user.id)
            if(!string)
                await interaction.reply({content: '**Nothing to snipe.**', ephemeral: true})
            else {
                embed.setDescription(`**Author: ${user}**\n**Sniped Message: \`${string}\`**`)
                await interaction.reply({embeds:[embed], fetchReply:true})
                    .then((msg) => {
                        setTimeout(() => {
                            msg.delete()
                                .catch(error => {
                                    if(error.code == 10008) {}
                                })
                        }, 60000)
                    })
            }
        } else {
            await interaction.reply({content: '**You need to specify a member.**', ephemeral: true})
        }
    }
}