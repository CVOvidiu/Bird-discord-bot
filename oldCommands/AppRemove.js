const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const User = require('../schemas/staffApplications')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('appremove')
        .setDescription('Sterge-ti aplicatia STAFF.'),
    async execute(interaction) {
        try {
            await User.exists({_id:interaction.user.id})
                .then(async exists => {
                    if(!exists) {
                        await interaction.reply({ephemeral:true, content:`**Nu ai nicio aplicatie in curs de procesare in acest moment.**`})
                        throw 1
                    }
                })
        } catch(e) {
            if(e == 1) {return}
        }

        await User.findOneAndDelete({_id:interaction.user.id})
        await interaction.reply({ephemeral:true, content:`**Ti-ai sters aplicatia STAFF cu succes.**`})
    }
}