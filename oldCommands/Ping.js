const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check Latency.'),
    async execute(interaction) {
        channel = interaction.channel
        await interaction.reply({content: `Pong!`, fetchReply: true})
            .then((msg) => {
                embed = new MessageEmbed()
                    .setColor('#3596ff')
                    .setDescription(`**Message Latency is \`${msg.createdTimestamp - interaction.createdTimestamp}\`ms.\nAPI Latency is \`${Math.round(interaction.client.ws.ping)}\`ms.**`)
            })
        await interaction.deleteReply();
        await channel.send({embeds:[embed]})
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