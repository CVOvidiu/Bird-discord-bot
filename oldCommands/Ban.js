const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require('discord.js')

const bantimes_10m = new Map()
const bantimes_1h = new Map()
const lastban = new Map()

function Process(interaction, id, time_m, time_h, roles) {
    const times_m = bantimes_10m.get(interaction.member.id)
    const times_h = bantimes_1h.get(interaction.member.id)
    const user = interaction.options.getUser('target')
    const member = interaction.guild.members.cache.get(user.id)
    if(interaction.member.roles.cache.has(id)) {
        roles.some((role) => {
            const role_name = interaction.guild.roles.cache.get(role)

            if(member.roles.cache.has(role)) {
                interaction.reply({content:`**Nu poti sa banezi un ${role_name}!**`, ephemeral:true})
                throw 1
            }
        })
        if(times_m == time_m) {
            bantimes_10m.delete(interaction.member.id)
            interaction.member.roles.add('842010066629689345')
            throw 2
        }
        if(times_h == time_h) {
            bantimes_1h.delete(interaction.member.id)
            interaction.member.roles.add('842010066629689345')
            throw 3
        }
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member')
        .addUserOption(opt => opt.setName('target').setDescription('Membrul carui vrei sa ii dai ban').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Motivul banului').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('target')
        const reason = interaction.options.getString('reason')
        const member = interaction.guild.members.cache.get(user.id)
        const embed = new MessageEmbed()
            .setColor('#3596ff')
            .setTimestamp()
        
        if(!interaction.member.roles.cache.has('876759046336688138')) { // Not STAFF
            interaction.reply({content:'**Nu ai acces la aceasta comanda!**', ephemeral:true})
        } else if(user.id == interaction.member.id) { // Ban himself
            interaction.reply({content:'**Nu poti sa te banezi!**', ephemeral:true})
        } else {
            try {
                Process(interaction, '903801138636279858', 3, 5, ['791459807747506226', '903800806095069195', '903801032293900369', '903801138636279858']) // Helper Trial
                Process(interaction, '903801032293900369', 4, 6, ['791459807747506226', '903800806095069195', '903801032293900369', '903801138636279858']) // Helper
                Process(interaction, '903800806095069195', 5, 7, ['791459807747506226', '903800806095069195']) // Admin
                Process(interaction, '791459807747506226', 1, 1, ['791459807747506226']) // Trusted Admin
            
                if(!interaction.member.roles.cache.has('791459807747506226')) { // Not Trusted Admin
                    if(!bantimes_10m.get(interaction.member.id)) {
                        bantimes_10m.set(interaction.member.id, 1)
                        bantimes_1h.set(interaction.member.id, 1)
                    } else {
                        bantimes_1h.set(interaction.member.id, bantimes_1h.get(interaction.member.id) + 1)
                        bantimes_10m.set(interaction.member.id, bantimes_10m.get(interaction.member.id) + 1)
                    }
                }
            
                const punishroom = interaction.guild.channels.cache.get('899804573462577162')
                embed.setDescription(`**Ai fost banat pe BornFromAshes de catre ${interaction.member}!**\n**Motiv: \`${reason}\`**`)
                user.send({embeds:[embed]})
                    .catch(error => {
                        if(error.code == 10008) {}
                        if(error.code == 50007) {}
                    })
                member.ban({reason:reason})
                embed.setDescription(`**${user} a fost banat pe server de catre ${interaction.member}!**\n**Motiv: \`${reason}\`**`)
                punishroom.send({embeds:[embed]})
                interaction.reply({embeds:[embed]})
                lastban.set(interaction.member.id, user.id)
                setTimeout(() => {
                    if(lastban.get(interaction.member.id) == user.id)
                        bantimes_10m.delete(interaction.member.id)
                }, 60000 * 10)
                setTimeout(() => {
                    if(lastban.get(interaction.member.id) == user.id)
                        bantimes_1h.delete(interaction.member.id)
                }, 60000 * 60)
            } catch(e) {
                if(e == 1) {}
                if(e == 2) {}
                if(e == 3) {}
            }
        }
    }
}