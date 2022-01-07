const { MessageEmbed } = require("discord.js")
const Invites = require('../schemas/invites')

// Global vars for AntiJoinRaid System
global.joinraid = new Map() // Contains invite code and the list of raiders
global.joinraid_ls = new Map() // Used if multiple join raids through another invite links are happening. Contains invite code and cooldown

function RandomINT(limit) {
    return Math.floor(Math.random() * limit)
}

function ArrayRemove(array, element) {
    return array.filter((el) => {
        return el != element
    })
}

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member) {
        // Update global.invites after member joined and find the invite used and inviter
        await member.guild.invites.fetch()
            .then(async newInvites => {
                oldInvites = global.invites.get(member.guild.id) // Get guild invites before member joined from global.invites
                invite = newInvites.find(i => i.uses > oldInvites.get(i.code)) // Find the invite code that was used by member
                inviter = member.client.users.cache.get(invite.inviter.id) // Find the inviter of the member
                global.invites.set(member.guild.id, new Map(newInvites.map(inv => [inv.code, inv.uses]))) // Update global.invites
            })
        
        // Issue solved: Member was not previously removed from database because bot restarted / crashed
        await Invites.find({'invites':member.id}) // Find if member is already in database
            .then(async result => {
                if(result.length != 0) { // If there is an encounter
                    inviteList = ArrayRemove(result[0].invites, member.id) // Remove member from the list of invites found in database of some inviter
                    inviter = result[0]._id // The previous inviter that invited the member
                    console.log(`----------- Debug: Previous Inviter: ` + inviter)
                    if(inviteList.length == 0) // If the list is empty after member removal 
                        await Invites.findOneAndDelete({_id:inviter}) // Delete the inviter from database
                    else
                        await Invites.findOneAndUpdate({_id:inviter}, {$set:{'invites':inviteList}}) // Update the invite list of inviter
                }
            })

        console.log(`--------- Debug: InviterID` + inviter.id)
        // Update inviter database
        await Invites.exists({_id:inviter.id})
            .then(async exists => {
                if(exists) {
                    result = await Invites.find({_id:inviter.id})
                    inviteList = result[0].invites
                    inviteList.push(member.id)
                    inviteListCount = inviteList.length
                    await Invites.findOneAndUpdate({_id:inviter.id}, {$set:{'invites':inviteList}})
                } else {
                    inviteListCount = 1
                    await Invites.create({
                        _id:inviter.id,
                        invites:[member.id]
                    })
                }
            })

        // JoinRaid
        const raidList = global.joinraid.get(invite.code)
        if(!raidList) {
            // First member of raid
            global.joinraid.set(invite.code, [member.id])
            global.joinraid_ls.set(invite.code, 3)
        } else {
            raidList.push(member.id)
            if(raidList.length == 7) { // There are 7 raiders
                await member.guild.invites.delete(invite.code) // Delete the invite code
                    .then(console.log(`Invite deleted`))
                raidList.forEach(async entry => {
                    memberObj = member.guild.members.cache.get(entry)
                    quarantine = member.guild.roles.cache.get('842010066629689345')
                    await memberObj.roles.add(quarantine)
                        .catch(error => {
                            console.log(error)
                        })
                })
                global.joinraid.delete(invite.code)
                global.joinraid_ls.delete(invite.code)
            } else {
                global.joinraid.set(invite.code, raidList)
            }
        }

        const noverify = member.guild.roles.cache.get('878972176827551746')
        const delim1 = member.guild.roles.cache.get('798734389462302761')
        const delim2 = member.guild.roles.cache.get('836960907275141190')
        const delim3 = member.guild.roles.cache.get('836306673986830378')
        const wl = member.guild.channels.cache.get('928629566824677386')
        await member.roles.add(noverify)
        await member.roles.add(delim1)
        await member.roles.add(delim2)
        await member.roles.add(delim3)
        responses = [
            `**<:bfa_peek:900884898720677911> \`${member.user.username}\` a aparut pe server!**`,
            `**<:bfa_peek:900884898720677911> \`${member.user.username}\` tocmai a intrat!**`,
            `**<:bfa_peek:900884898720677911> Ma gandeam eu ca o sa apari, \`${member.user.username}\`!**`,
            `**<:bfa_peek:900884898720677911> Nu ma asteptam sa intri, \`${member.user.username}\`!**`,
            `**<:bfa_peek:900884898720677911> Toata lumea, hai sa ii uram bun venit lui \`${member.user.username}\`!**`,
            `**<:bfa_peek:900884898720677911> Cum ai intrat aici, \`${member.user.username}\`?**`,
            `**<:bfa_peek:900884898720677911> \`${member.user.username}\` a aterizat pe server!**`
        ]
        response = responses[RandomINT(responses.length)]
        inviter
        ? response += `\n**A fost invitat de catre \`${inviter.username}\` care are in acest moment: \`${inviteListCount}\` invites.**`
        : response += `\n**Nu imi pot da seama de catre cine a fost invitat.**`
        const embed = new MessageEmbed()
            .setColor('#3596ff')
            .setDescription(response)
        await wl.send({embeds:[embed]})
    }
}