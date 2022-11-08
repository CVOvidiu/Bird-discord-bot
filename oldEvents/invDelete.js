module.exports = {
    name: 'inviteDelete',
    once: false,
    execute(invite) {
        console.log("invite deleted")
        global.inv_ls.get(invite.guild.id).delete(invite.code)
        console.log(global.inv_ls)
    }
}