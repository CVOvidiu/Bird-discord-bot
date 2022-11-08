const { MessageEmbed } = require("discord.js")
const User = require('../schemas/tagTime')

module.exports = {
    name: 'userUpdate',
    once: false,
    async execute(oldUser, newUser) {
        const guild = oldUser.client.guilds.cache.get('569077625826443274')
        const logs = guild.channels.cache.get('899804573462577162')
        const role = guild.roles.cache.get('835853720175902730')
        const member = guild.members.cache.get(oldUser.id)
        if(!oldUser.username.includes('ﾉʙꜰᴀ') && newUser.username.includes('ﾉʙꜰᴀ')) {
            member.roles.add(role)
            const embed = new MessageEmbed()
                .setColor('#3596ff')
                .setDescription(`**<a:blk_heart:877666480718762026> | \`${newUser.username}\` put on the tag.**`)
            logs.send({embeds:[embed]})
        }
        if(oldUser.username.includes('ﾉʙꜰᴀ') && !newUser.username.includes('ﾉʙꜰᴀ')) {
            member.roles.remove(role)
            const staff = guild.roles.cache.get('876759046336688138')
            const ht = guild.roles.cache.get('903801138636279858')
            const h = guild.roles.cache.get('903801032293900369')
            const a = guild.roles.cache.get('903800806095069195')
            const ta = guild.roles.cache.get('791459807747506226')
            member.roles.remove(staff)
            member.roles.remove(ht)
            member.roles.remove(h)
            member.roles.remove(a)
            member.roles.remove(ta)
            const embed = new MessageEmbed()
                .setColor('#3596ff')
                .setDescription(`**<a:blk_heart:877666480718762026> | \`${newUser.username}\` took out the tag.**`)
            await User.findOneAndDelete({_id: newUser.id})
            logs.send({embeds:[embed]})
        }
    }
}