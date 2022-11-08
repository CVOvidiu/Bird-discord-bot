//TODOs!

const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const humanizeDuration = require('humanize-duration')

const uses = new Map()
const cooldown = new Map()

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prune')
		.setDescription('Delete up to 99 messages.')
		.addIntegerOption(option => option.setName('amount').setDescription('Number of messages to delete')),
	async execute(interaction) {
        if(interaction.member.roles.cache.has('876759046336688138')) { //TODO: Set in DB STAFF role
            // If STAFF member
		    const amount = interaction.options.getInteger('amount')

		    if (amount <= 1 || amount > 100) {
			    return interaction.reply({content: '**You need to input a number between** `1` **and** `99`**.**', ephemeral: true})
		    }
        
            // Cooldown (no need for DB integration because of low cooldown)
            if(uses.get(interaction.member.id) == 4) {}
            else if(uses.get(interaction.member.id) == 3) {
                uses.set(interaction.member.id, uses.get(interaction.member.id) + 1)
                cooldown.set(interaction.member.id, Date.now() + 60000)
                setTimeout(() => {
                cooldown.delete(interaction.member.id)
                uses.delete(interaction.member.id)
                }, 60000)
            }
            else if(uses.get(interaction.member.id) >= 1)
                uses.set(interaction.member.id, uses.get(interaction.member.id) + 1)
            else if(uses.get(interaction.member.id) == undefined)
                uses.set(interaction.member.id, 1)
            const cd = cooldown.get(interaction.member.id)
            if(cd) {
                const remaining = humanizeDuration(cd - Date.now())
                return interaction.reply({content: `**Slow down! Command cooldown: \`${remaining}\`.**`, ephemeral: true})
            }
            else {
                await interaction.channel.bulkDelete(amount, true)
                    .catch((error) => {
			    console.error(error)
			    return interaction.reply({content: '**There was an error trying to prune messages in this channel!**', ephemeral: true})
		        })
                embed = new MessageEmbed()
                    .setColor('#3596ff')
                    .setTimestamp()
                    .setFooter(`${interaction.user.username}`, `${interaction.user.displayAvatarURL({dynamic: true})}`)
                
                channel = interaction.channel
                logs = interaction.guild.channels.cache.get('898551606390427649') //TODO: Set in DB log channel
                embed.setDescription(`**Successfully pruned** \`${amount}\` **messages.**`)
                await interaction.reply({embeds:[embed], fetchReply:true})
                    .then((msg) => {
                        setTimeout(() => {
                            msg.delete()
                                .catch((error) => {
                                    if(error.code == 10008) {}
                                })
                        }, 30000)
                    })
                embed.setDescription(`**Pruned** \`${amount}\` **messages in ${channel}.**`)
                await logs.send({embeds:[embed]})
            }
        }
        else
            await interaction.reply({content: '**You do not have permission to this command.**', ephemeral: true}) 
    }
}