const { MessageEmbed } = require("discord.js")
const Invites = require('../schemas/invites')

function RandomINT(limit) {
    return Math.floor(Math.random() * limit)
}

function ArrayRemove(array, element) {
    return array.filter((el) => {
        return el != element
    })
}

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    async execute(member) {
        responses = [
            `**\`${member.user.username}\` a disparut fara urma de pe server. <:bfa_cry:900896379193401375>**`,
            `**\`${member.user.username}\` tocmai a iesit. <:bfa_cry:900896379193401375>**`,
            `**\`${member.user.username}\`, nu a fost sa fie. <:bfa_cry:900896379193401375>**`,
            `**\`${member.user.username}\` si-a luat zborul de pe server. <:bfa_cry:900896379193401375>**`,
            `**\`${member.user.username}\`, nu inteleg de ce ai mai intrat... <:bfa_cry:900896379193401375>**`
        ]
        response = responses[RandomINT(responses.length)]
        const wl_channel = member.guild.channels.cache.get('928629566824677386')

        await Invites.find({'invites':member.id})
            .then(async result => {
                newInvites = await member.guild.invites.fetch()
                global.invites.set(member.guild.id, new Map(newInvites.map(inv => [inv.code, inv.uses])))
                console.log(`-------- global.invites after LeaveMember:`)
                console.log(global.invites)
                if(result.length == 0) {
                    response += `\n**Nu imi pot da seama de catre cine a fost invitat.**`
                } else {
                    inviterID = result[0]._id
                    inviterObj = member.client.users.cache.get(inviterID)
                    inviteList = ArrayRemove(result[0].invites, member.id)
                    response += `\n**A fost invitat de catre \`${inviterObj.username}\` care are in acest moment: \`${inviteList.length}\` invites.**`
                    console.log(inviteList.length)
                    if(inviteList.length == 0)
                        await Invites.findOneAndDelete({_id:inviterID})
                    else
                        await Invites.findOneAndUpdate({_id:inviterID}, {$set: {'invites':inviteList}})
                }
            })
        await member.guild.members.fetch()
            .then(memList => {
                tMem = memList.filter(m => !m.user.bot)
            })
        response += `\n***Acum suntem*** \`${tMem.size}\`***membrii pe server!***`
        const embed = new MessageEmbed()
            .setColor('#222222')
            .setDescription(response)
        await wl_channel.send({embeds:[embed]})
    }
}