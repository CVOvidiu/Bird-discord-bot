module.exports = {
    name: 'inviteCreate',
    once: false,
    execute(invite) {
        console.log("invite created")
        global.inv_ls.get(invite.guild.id).set(invite.code, invite.uses)
        console.log(global.inv_ls)
    }
}