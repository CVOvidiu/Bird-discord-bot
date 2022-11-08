const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const SS = require('../schemas/serverSettings')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('applications')
        .addStringOption(opt => opt.setName('position').setDescription('helpertrial/helper/admin').setRequired(true))
        .addStringOption(opt => opt.setName('status').setDescription('on/off').setRequired(true))
        .setDescription('Deschide sau inchide aplicatiile.'),
    async execute(interaction) {
        
        const position = interaction.options.getString('position')
        const position_ls = ['helpertrial', 'helper', 'admin']
        const status = interaction.options.getString('status')
        if(!position_ls.includes(position) && status != 'on' && status != 'off') {
            interaction.reply({ephemeral:true, content:`**Pozitia \`${position}\` si statusul \`${status}\` nu exista:**\n**Status: \`on\`/\`off\`**\n**Pozitii: \`helpertrial\`/\`helper\`/\`admin\`**`})
            return
        }
        if(!position_ls.includes(position)) {
            interaction.reply({ephemeral:true, content:`**Pozitia \`${position}\` nu exista: \`helpertrial\`/\`helper\`/\`admin\`**`})
            return
        }
        if(status == 'on')
            status_aux = true
        else if(status == 'off')
            status_aux = false
        else {
            interaction.reply({ephemeral:true, content:`**Statusul \`${status}\` nu exista: \`on\`/\`off\`**`})
            return
        }
        if(!(interaction.member.roles.cache.has('579066160788799504') || interaction.member.roles.cache.has('791459807747506226'))) {
            interaction.reply({ephemeral:true, content:"**Nu ai acces la aceasta comanda!**"})
            return
        }
        const result = await SS.find({_id:"BornFromAshes"})
        const db_position_status = result[0].staffapplications[position]
        if(db_position_status == true && status == 'on') {
            interaction.reply({ephemeral:true, content:"**Aplicatiile sunt deja deschise pentru aceasta pozitie.**"})
            return
        } else if(db_position_status == false && status == 'off') {
            interaction.reply({ephemeral:true, content:"**Aplicatiile sunt deja inchise pentru aceasta pozitie.**"})
            return
        } else {
            const news = interaction.guild.channels.cache.get('570305206139748353')
            const embed = new MessageEmbed()
                .setColor('#3596ff')
                .setTimestamp()
            await SS.updateOne({_id:"BornFromAshes"}, {$set: {[`staffapplications.${position}`]:status_aux}})
            if(position == 'helper')
                position_aux = 'Helper'
            if(position == 'helpertrial')
                position_aux = 'Helper trial'
            if(position == 'admin')
                position_aux = 'Admin'
            if(status_aux == false) {
                const collection = await SS.find({_id:"BornFromAshes"})
                const restricted_ls = collection[0].restricted
                for(const [key, value] of Object.entries(restricted_ls)) {
                    if(value == position)
                        await SS.findOneAndUpdate({_id:"BornFromAshes"}, {$unset: {[`restricted.${key}`]:value}})
                }
                embed.setDescription(`**Aplicatiile pentru pozitia \`${position_aux}\` au fost inchise!**`)
                await interaction.reply({ephemeral:true, content:"**Ai inchis aplicatiile pentru aceasta pozitie.**"})
            } else if(status_aux == true) {
                embed.setDescription(`**Aplicatiile pentru pozitia \`${position_aux}\` au fost deschise! Multa bafta tuturor!**`)
                await interaction.reply({ephemeral:true, content:"**Ai deschis aplicatiile pentru aceasta pozitie.**"})
            }
            await news.send({embeds:[embed]})
        }
    }
}