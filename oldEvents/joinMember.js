const { MessageEmbed } = require("discord.js")
const User = require('../schemas/invites')

global.joinraid = new Map()
global.joinraid_ls = new Map()

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function array_remove(arr, element) {
    return arr.filter((el) => {
        return el != element
    })
}

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member) {
        /* Invite Event: Fetch guild invites */
        await member.guild.invites.fetch()
            .then(async newInvites => {
                oldInvites = global.inv_ls.get(member.guild.id)
                invite = newInvites.find(i => i.uses > oldInvites.get(i.code)) // Ia invite-ul care e +1
                inviter = member.client.users.cache.get(invite.inviter.id)
                global.inv_ls.set(member.guild.id, new Map(newInvites.map(inv => [inv.code, inv.uses])))
                console.log(`inv_ls after join`)
                console.log(global.inv_ls)
            })
        
        /* BugSolved: Member was not removed from DB because bot restarted / crashed */
        await User.find({'invites':member.id})
        .then(async result => {
            if(result.length == 0) {}
            else {
                const invite_list_2 = array_remove(result[0].invites, member.id)
                const inviter = result[0]._id
                if(invite_list_2.length == 0)
                    await User.findOneAndDelete({_id:inviter})
                else
                    await User.findOneAndUpdate({_id:inviter}, {$set: {'invites':invite_list_2}})
            }
        })
            
        /* Invite Event: DB integration */
        await User.exists({_id:inviter.id})
        .then(async exists => {
            if(exists) {
                const result = await User.find({_id:inviter.id})
                const invite_list = result[0].invites
                invite_list.push(member.id)
                list_count = invite_list.length
                await User.findOneAndUpdate({_id:inviter.id}, {$set: {'invites':invite_list}})
            } else {
                list_count = 1
                await User.create({
                    _id:inviter.id,
                    invites:[member.id]
                })
            }
        })
         
        /* JoinRaid */
        const res_ls = global.joinraid.get(invite.code)
        if(!res_ls) {
            // First member of raid
            global.joinraid.set(invite.code, [member.id])
            global.joinraid_ls.set(invite.code, 3)
        } else {
            res_ls.push(member.id)
            if(res_ls.length == 7) {
                await member.guild.invites.delete(invite.code)
                    .then(console.log(`Invited deleted`))
                res_ls.forEach(async entry => {
                    member_obj = member.guild.members.cache.get(entry)
                    quarantine = member.guild.roles.cache.get('842010066629689345')
                    await member_obj.roles.add(quarantine)
                        .catch(error => {
                            console.log(error)
                        })
                })
                global.joinraid.delete(invite.code)
                global.joinraid_ls.delete(invite.code)
            } else {
                global.joinraid.set(invite.code, res_ls)
            }
        }

        const noverify = member.guild.roles.cache.get('878972176827551746')
        const delim1 = member.guild.roles.cache.get('798734389462302761')
        const delim2 = member.guild.roles.cache.get('836960907275141190')
        const delim3 = member.guild.roles.cache.get('836306673986830378')
        const logs = member.guild.channels.cache.get('898551606390427649')
        const wl = member.guild.channels.cache.get('569096412369911808')
        await member.roles.add(noverify)
        await member.roles.add(delim1)
        await member.roles.add(delim2)
        await member.roles.add(delim3)
        ls = [
            `**<:bfa_peek:900884898720677911> \`${member.user.username}\` a aparut pe server!**`,
            `**<:bfa_peek:900884898720677911> \`${member.user.username}\` tocmai a intrat!**`,
            `**<:bfa_peek:900884898720677911> Ma gandeam eu ca o sa apari, \`${member.user.username}\`!**`,
            `**<:bfa_peek:900884898720677911> Nu ma asteptam sa intri, \`${member.user.username}\`!**`,
            `**<:bfa_peek:900884898720677911> Toata lumea, hai sa ii uram bun venit lui \`${member.user.username}\`!**`,
            `**<:bfa_peek:900884898720677911> Cum ai intrat aici, \`${member.user.username}\`?**`,
            `**<:bfa_peek:900884898720677911> \`${member.user.username}\` a aterizat pe server!**`
        ]
        string = ls[getRandomInt(ls.length)]
        inviter
        ? string += `\n**A fost invitat de catre \`${inviter.username}\` care are in acest moment: \`${list_count}\` invites.**`
        : string += `\n**Nu imi pot da seama de catre cine a fost invitat.**`
        const embed = new MessageEmbed()
            .setColor('#3596ff')
            .setDescription(string)
        await wl.send({embeds:[embed]})
        if(member.user.username.includes('ﾉʙꜰᴀ')) {
            const family = member.guild.roles.cache.get('835853720175902730')
            await member.roles.add(family)
            embed.setDescription(`**<a:wings_1:877665716952789003> | \`${member.user.username}\` joined with tag.**`)
        } else
            embed.setDescription(`**<:bfa_peek:900884898720677911> | \`${member.user.username}\` joined.**`)
        await logs.send({embeds:[embed]})
    }
}