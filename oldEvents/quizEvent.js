const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

global.quiz = new Map()
global.mainmsgquiz = new Map()
global.quizon = new Map()
global.msgbuttons = new Map()

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('baiat')
                    .setLabel('Sunt baiat')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('fata')
                    .setLabel('Sunt fata')
                    .setStyle('DANGER')
            )

        embed = new MessageEmbed()
            .setColor('#3596ff')
        
        await embed.setDescription('*Hey!*\n**Eu sunt Bird, botul serverului** *BornFromAshes* **.**\n**Pentru inceput vreau sa iti urez bun venit pe server. Am pregatit un set micut de intrebari pentru tine la care ar trebui sa raspunzi pentru a avea acces la server. Pentru a raspunde la intrebari, apasa pe butonul care contine raspunsul tau la intrebare.**\n**Hai sa incepem!**\n*P.S.: Daca intampini probleme cu chestionarul, reintra pe server.*')

        await member.send({embeds:[embed], fetchReply: true})
            .then(msg => {
                global.mainmsgquiz.set(member.id, msg.id)
            })
            .catch(error => {
                if(error.code == 50007) {return}
            })

        global.quizon.set(member.id, 1)

        await embed.setDescription('*Prima intrebare:*\n**Esti baiat sau fata?**')
        
        await member.send({embeds:[embed], components:[row], fetchReply:true})
                .then(msg => {
                    global.msgbuttons.set(member.id, msg.id)
                    setTimeout(async () => {
                        await msg.delete()
                            .then(async () => {
                                count = global.quiz.get(member.id)
                                if(!count) {
                                    global.quiz.delete(member.id)
                                    mainmsgid = global.mainmsgquiz.get(member.id)
                                    mainmsg = member.user.dmChannel.messages.cache.get(mainmsgid)
                                    await mainmsg.delete()
                                    global.mainmsgquiz.delete(member.id)
                                    global.quizon.delete(member.id)
                                    embed3 = new MessageEmbed()
                                        .setColor('#3596ff')
                                        .setDescription('**Timpul de completare al chestionarului a expirat. Pentru a face chestionarul din nou, scrie `verificare`. Daca intampini probleme la verificare reintra pe server. (in ultim caz, dai DM unui membru din STAFF)**')
                                    await member.send({embeds:[embed3]})
                                        .catch(error => {
                                            if(error.code == 50007) {return}
                                        })
                                }
                            })
                            .catch(error => {
                                if(error.code == 10008) {}
                            })
                    }, 60000 * 5)
                })
                .catch(error => {
                    if(error.code == 50007) {return}
                })
    }
}