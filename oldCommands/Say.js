const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make the bot say something')
        .addStringOption(opt => opt.setName('type').setDescription('Normal/Embed').setRequired(true))
        .addStringOption(opt => opt.setName('text').setDescription('Text to display').setRequired(true)),
    async execute(interaction) {
        const type = interaction.options.getString('type')
        const text = interaction.options.getString('text')

        if(!interaction.member.roles.cache.has('876759046336688138')) {
            interaction.reply({ephemeral:true, content:`**Nu ai acces la aceasta comanda.**`})
            return
        }
        await interaction.reply({content:'**Embeded message set.**', ephemeral:true})
        if(type.toLowerCase() == 'normal') {
            await interaction.channel.send({content:text})
        } else if(type.toLowerCase() == 'embed') {
            const embed = new MessageEmbed()
                .setColor('#3596ff')
                .setDescription(`${text}`)
            await interaction.channel.send({embeds:[embed]})
        }
    }
}