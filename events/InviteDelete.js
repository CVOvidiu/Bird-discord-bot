module.exports = {
    name: 'inviteDelete',
    once: false,
    execute(invite) {
        console.log("invite deleted")
        global.invites.get(invite.guild.id).delete(invite.code)
        console.log(global.invites)
    }
}