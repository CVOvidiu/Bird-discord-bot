const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require('../schemas/tagTime')
const { MessageEmbed } = require('discord.js')

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim your daily credits.'),
    async execute(interaction) {
        const randomInt = getRandomInt(500)
        const embed = new MessageEmbed()
            .setColor('#3596ff')
            .setDescription(`**${interaction.member}, ai primit** \`${randomInt}\` <:currency:800676742104088578> **din daily!**`)
        await User.exists({_id: interaction.user.id})
            .then(async exists => {
                if(exists) {
                    const result = await User.find({_id: interaction.user.id})
                    const dailycd = result[0].dailyCD
                    if(!dailycd) {
                        await User.findByIdAndUpdate({_id: interaction.user.id}, {$inc: {"balance": randomInt}})
                        await User.findByIdAndUpdate({_id: interaction.user.id}, {$set: {"dailyCD": 1440}})
                        await interaction.reply({embeds:[embed], fetchReply:true})
                            .then(msg => {
                                setTimeout(() => {
                                    msg.delete()
                                        .catch(error => {
                                            if(error.code == 10008) {}
                                        })
                                }, 60000 * 5)
                            })
                    }
                    else {
                        const time_h = parseInt(dailycd / 60)
                        const time_m = dailycd % 60
                        await interaction.reply({content: `**Poti sa mai folosesti comanda de daily in** \`${time_h}\` **ore si** \`${time_m}\` **minute.**`, ephemeral: true})
                    }
                }
                else {
                    await User.create({
                        _id: interaction.user.id,
                        "balance": randomInt,
                        "dailyCD": 1440
                    })
                    await interaction.reply({embeds:[embed], fetchReply:true})
                        .then(msg => {
                            setTimeout(() => {
                                msg.delete()
                                    .catch(error => {
                                        if(error.code == 10008) {}
                                    })
                            }, 60000 * 5)
                        })
                }
            })
    }
}