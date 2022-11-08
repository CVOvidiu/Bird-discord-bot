const { MessageEmbed } = require("discord.js")
const User = require('../schemas/tagTime')
const INVITES = require('../schemas/invites')

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function array_remove(arr, element) {
    return arr.filter((el) => {
        return el != element
    })
}

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    async execute(member) {
        mainmsgid = global.mainmsgquiz.get(member.id)
        buttonmsgid = global.msgbuttons.get(member.id)
        if(mainmsgid && buttonmsgid) {
            buttonmsg = member.user.dmChannel.messages.cache.get(buttonmsgid)
            mainmsg = member.user.dmChannel.messages.cache.get(mainmsgid)
            await mainmsg.delete()
            await buttonmsg.delete()
            global.mainmsgquiz.delete(member.id)
            global.msgbuttons.delete(member.id)
        }
        
        const logs = member.guild.channels.cache.get('898551606390427649')
        const wl = member.guild.channels.cache.get('569096412369911808')
        ls = [
            `**\`${member.user.username}\` a disparut fara urma de pe server. <:bfa_cry:900896379193401375>**`,
            `**\`${member.user.username}\` tocmai a iesit. <:bfa_cry:900896379193401375>**`,
            `**\`${member.user.username}\`, nu a fost sa fie. <:bfa_cry:900896379193401375>**`,
            `**\`${member.user.username}\` si-a luat zborul de pe server. <:bfa_cry:900896379193401375>**`,
            `**\`${member.user.username}\`, nu inteleg de ce ai mai intrat... <:bfa_cry:900896379193401375>**`
        ]
        string = ls[getRandomInt(ls.length)]
        await INVITES.find({'invites':member.id})
            .then(async result => {
                console.log(`result\n${result}`)
                const newInvites = await member.guild.invites.fetch()
                global.inv_ls.set(member.guild.id, new Map(newInvites.map(inv => [inv.code, inv.uses])))
                console.log(`inv_ls after leave`)
                console.log(global.inv_ls)
                if(result.length == 0) {
                    string += `\n**Nu imi pot da seama de catre cine a fost invitat.**`
                } else {
                    const inviter = result[0]._id
                    const inviter_obj = member.client.users.cache.get(inviter)
                    const invite_list = array_remove(result[0].invites, member.id)
                    console.log(invite_list.length)
                    string += `\n**A fost invitat de catre \`${inviter_obj.username}\` care are in acest moment: \`${invite_list.length}\` invites.**`
                    if(invite_list.length == 0)
                        await INVITES.findOneAndDelete({_id:inviter})
                    else
                        await INVITES.findOneAndUpdate({_id:inviter}, {$set: {'invites':invite_list}})
                }
            })
        const embed = new MessageEmbed()
            .setColor('#222222')
            .setDescription(string)
        await wl.send({embeds:[embed]})
        if(member.user.username.includes('ﾉʙꜰᴀ')) {
            string2 = `**<a:blk_thunder:877666207942201396> | \`${member.user.username}\` left with tag.**`
            await User.findByIdAndUpdate({_id: member.user.id}, {$unset: {"time": 1}})
        } else
            string2 = `**<:bfa_cry:900896379193401375> | \`${member.user.username}\` left.**`

        if(member.roles.cache.get('878706651165777982'))
            string2 = string2 + `\n**- They had:\n<@&878706651165777982>**`
        embed.setDescription(string2)
        await logs.send({embeds:[embed]})
    }
}