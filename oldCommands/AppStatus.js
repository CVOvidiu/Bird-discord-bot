const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const User = require('../schemas/staffApplications')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('appstatus')
        .setDescription('Verifica statusul unei aplicatii')
        .addStringOption(opt => opt.setName('cod').setDescription('Codul aplicatiei')),
    async execute(interaction) {
        const code = interaction.options.getString('cod')
        try {
            await User.exists({"code":code})
                .then(async exists => {
                    if(!exists) {
                        await interaction.reply({content:`**Codul \`${code}\` nu exista sau aplicatia a fost stearsa.**`, ephemeral:true})
                        throw 1
                    }
                })
        } catch(e) {
            if(e == 1) {return}
        }

        await interaction.guild.members.fetch()
            .then(async res => {
                staff_count = res.filter(member => member.roles.cache.has('876759046336688138'))
                trial_helpers = res.filter(member => member.roles.cache.has('903801138636279858'))
            })
        const result = await User.find({"code":code})
        const ls_upvotes = result[0].upvotes.length
        const ls_downvotes = result[0].downvotes.length
        const embed = new MessageEmbed()
            .setColor('#3596ff')
            .setDescription(`**Statusul aplicatiei cu codul \`${code}\`:**\n_*Upvotes:*_ \`${ls_upvotes}\`\n_*Downvotes:*_ \`${ls_downvotes}\`\n**Sunt \`${staff_count.size - trial_helpers.size}\` membrii staff (exclus Helper trial).**`)
        await interaction.reply({embeds:[embed], ephemeral:true})
    }
}