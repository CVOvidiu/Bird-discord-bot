const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const Db = require('../schemas/ServersConfig')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joinschannel')
        .setDescription('Seteaza canalul de joinuri')
        .addStringOption(opt => opt.setName('channel_id').setDescription('ID-ul canalului').setRequired(true)),
    async execute(interaction) {
        const channelID = interaction.options.getString('channel_id')
        await Db.exists({_id: interaction.member.guild.id})
            .then(async exists => {
                if(exists)
                    await Db.findOneAndUpdate({_id: interaction.member.guild.id}, {$set: {[`channels.joinleave`]: channelID}})
                else {
                    await Db.create({
                        _id: interaction.member.guild.id,
                        channels: {
                            joinleave: channelID
                        }
                    })
                }
            })
        const channel = interaction.member.guild.channels.cache.get(channelID)
        const embed = new MessageEmbed()
            .setColor('#3596ff')
            .setDescription(`**Ai setat canalul ${channel} pentru a vedea joinurile.**`)
        await interaction.reply({embeds: [embed], ephemeral: true})
    }
}