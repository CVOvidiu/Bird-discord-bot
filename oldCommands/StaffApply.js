const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const User = require('../schemas/staffApplications')
const SS = require('../schemas/serverSettings')

const mainmsg = new Map()
const qmsg = new Map()
const prevmsg = new Map()

async function Ask(interaction, q, string, last = false) {
    if(prevmsg.get(interaction.user.id)) {
        const prevmsgobj = interaction.user.dmChannel.messages.cache.get(prevmsg.get(interaction.user.id))
        prevmsgobj.delete()
        prevmsg.delete(interaction.user.id)
    }
    embed.setDescription(`__**${q}**__`)
    await interaction.user.send({embeds:[embed], fetchReply:true})
        .then(msg => {
            prevmsg.set(interaction.user.id, msg.id)
            qmsg.set(interaction.user.id, msg.id)
        })
    await interaction.user.dmChannel.awaitMessages({max:1, time:30000})
        .then(collected => {
            if(!last)
                string = string + `**- ${q.slice(2)}: \`${collected.first().content}\`**\n`
            else {
                const prevmsgobj = interaction.user.dmChannel.messages.cache.get(prevmsg.get(interaction.user.id))
                const mainmsgobj = interaction.user.dmChannel.messages.cache.get(mainmsg.get(interaction.user.id))
                prevmsgobj.delete()
                mainmsgobj.delete()
                mainmsg.delete(interaction.user.id)
                qmsg.delete(interaction.user.id)
                prevmsg.delete(interaction.user.id)
                string = string + `**- ${q.slice(2)}: \`${collected.first().content}\`**`
            }
        })
        .catch(err => {
            const mainmsgobj = interaction.user.dmChannel.messages.cache.get(mainmsg.get(interaction.user.id))
            const qmsgobj = interaction.user.dmChannel.messages.cache.get(qmsg.get(interaction.user.id))
            mainmsgobj.delete()
            qmsgobj.delete()
            mainmsg.delete(interaction.user.id)
            qmsg.delete(interaction.user.id)
            prevmsg.delete(interaction.user.id)
            throw 1
        })
    return string
}

async function Generate() {
    var code = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for(var i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    const result = await User.find({"code": code})
    if(result.length != 0)
        code = Generate()
    return code
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('applystaff')
        .addStringOption(opt => opt.setName('option').setDescription('Unde vrei sa aplici').setRequired(true))
        .setDescription('Apply for STAFF'),
    async execute(interaction) {
        // Comanda de upvote
        const option = interaction.options.getString('option')
        const obj = {
            helper:'helper', helpertrial:'helper trial', admin:'admin'
        }
        let sw = 0
        for(const [key, value] of Object.entries(obj)) {
            if(value === option.toLowerCase()) {
                actualkey = key
                actualvalue = value
                sw = 1
            }
        }
        const restricted_res = await SS.find({$exists: {"restricted":1}})
        const restricteds = restricted_res[0].restricted
        for(const [key, value] of Object.entries(restricteds)) {
            if(key == interaction.member.id) {
                interaction.reply({ephemeral:true, content:`**Nu mai poti sa aplici in aceasta sesiune de aplicatii.**`})
                return
            }
        }
        if(!interaction.user.username.includes(`ﾉʙꜰᴀ`)) {
            interaction.reply({ephemeral:true, content:`**Nu poti sa aplici pe pozitii STAFF deoarece nu ai tagul \`ﾉʙꜰᴀ\` pus.**`})
            return
        }
        if(sw == 0) {
            interaction.reply({content:`**\`${option}\` nu se afla printre posturi: \`Helper\`/\`Helper Trial\`/\`Admin\`**`, ephemeral:true})
            return
        }
        if(!interaction.member.roles.cache.has('876759046336688138') && option.toLowerCase() != 'helper trial') {
            interaction.reply({ephemeral:true, content:`**Ca non-STAFF ai voie sa aplici doar la pozitia \`Helper trial\`.**`})
            return
        } else if(interaction.member.roles.cache.has('903801138636279858') && option.toLowerCase() != 'helper') {
            interaction.reply({ephemeral:true, content:`**Ca \`Helper trial\` poti sa aplici doar la pozitia \`Helper\`.**`})
            return
        } else if(interaction.member.roles.cache.has('903801032293900369') && option.toLowerCase() != 'admin') {
            interaction.reply({ephemeral:true, content:`**Ca \`Helper\` poti sa aplici doar la pozitia \`Admin\`.**`})
            return
        } else if(interaction.member.roles.cache.has('903800806095069195') || interaction.member.roles.cache.has('791459807747506226')) {
            interaction.reply({ephemeral:true, content:`**Nu poti sa aplici pe aceasta pozitie.**`})
            return
        }

        const result1 = await SS.find({_id: 'BornFromAshes'})
        if(!result1[0].staffapplications[actualkey]) {
            interaction.reply({content:`**Aplicatiile pentru postul de \`${option[0].toUpperCase() + option.slice(1).toLowerCase()}\` sunt inchise momentan.**`, ephemeral:true})
            return
        }

        User.exists({_id: interaction.user.id})
            .then(async (exists) => {
                if(exists) {
                    await interaction.reply({content: '**Ai deja o aplicatie in curs de procesare. Pentru a anula aplicatia foloseste comanda : \`\`**', ephemeral: true})
                } else {
                    const embed = new MessageEmbed()
                        .setColor('#3596ff')
                    const log = interaction.guild.channels.cache.get('904644581285560341')
                    embed.setDescription(`*Hei!*\n**Am auzit ca vrei sa aplici ca \`${option[0].toUpperCase() + option.slice(1).toLowerCase()}\` pe BornFromAshes!**\n**Raspunde la urmatoarele intrebari:**`)
                    await interaction.user.send({embeds:[embed], fetchReply:true})
                        .then(async msg => {
                            mainmsg.set(interaction.user.id, msg.id)
                            await interaction.reply({content:'**Uita-te in DM!**', ephemeral:true})
                        })
                        .catch(async error => {
                            if(error.code == 50007) {
                                await interaction.reply({content:'**Ai DMurile dezactivate!**', ephemeral:true})
                                return
                            }
                        })
                        
                    try {
                        let result = await Ask(interaction, '1. Cati ani ai?', '')
                        result = await Ask(interaction, '2. De cat timp esti pe server?', result)
                        result = await Ask(interaction, '3. Ai citit regulamentul?', result)
                        result = await Ask(interaction, '4. Esti deja membru staff pe server?', result)
                        result = await Ask(interaction, '5. De ce consideri ca ti s-ar potrivi aceasta responsabilitate?', result)
                        result = await Ask(interaction, '6. Descrie-te in cateva cuvinte.', result, true)
                        embed.setDescription(`**Ai terminat de completat aplicatia.**\n**Din acest moment esti eligibil ca \`${option[0].toUpperCase() + option.slice(1).toLowerCase()}\` pe server.**\n**Pentru a-ti vedea aplicatia, intra pe \`๑ᴀᴘʟɪᴄᴀᴛɪɪ\`**`)
                        await interaction.user.send({embeds:[embed]})
                        embed.setDescription(result)
                        embed.setTitle(`Aplicatie ${option[0].toUpperCase() + option.slice(1).toLowerCase()}`)
                        embed.setTimestamp()
                        embed.setAuthor(`${interaction.user.username}`, `${interaction.user.displayAvatarURL({dynamic: true})}`)
                        let code = await Generate()
                        embed.setFooter(`Cod: ${code}`)
                        await log.send({embeds:[embed]})
                        await User.create({
                            _id: interaction.user.id,
                            "code": code,
                            "position": actualkey,
                            "upvotes": [],
                            "downvotes": []
                        })
                    } catch(e) {
                        if(e == 1) {
                            embed.setDescription("**Vad ca ai renuntat sa mai aplici din moment ce nu ai mai raspuns la intrebari, multa bafta in continuare.**")
                            interaction.user.send({embeds:[embed]})
                        }
                    }

                }
            })


    }
}