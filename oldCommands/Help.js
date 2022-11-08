const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays all commands that a normal user can access.'),
    async execute(interaction) {
        embed = new MessageEmbed()
            .setColor('#3596ff')
            .setTitle('Help Menu')
            .setFooter('I was created by Lectusﾉʙꜰᴀ#3916.\nIf you have any suggestions or encounter any problems, DM him.', `${interaction.client.user.displayAvatarURL()}`)
            .addFields(
                {name: 'avatar [Optional(member)]', value: 'Displays the avatar of the selected member, or your own avatar.'},
                {name: 'ping', value: 'Check Latency.'},
                {name: 'tagtime [Optional(member)]', value: 'Displays the tag holding time of the selected member, or your own.'},
                {name: 'snipe (member)', value: 'Displays the last deleted message of the selected member.'}
            )
        
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('primary')
                    .setLabel('Next')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('admin')
                    .setLabel('Admin')
                    .setStyle('DANGER'),
                new MessageButton()
                    .setCustomId('features')
                    .setLabel('Features')
                    .setStyle('SUCCESS')
            )
        await interaction.reply({content:'**Check your DMs.**', ephemeral:true})
        await interaction.member.send({embeds:[embed], components:[row], fetchReply:true})
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