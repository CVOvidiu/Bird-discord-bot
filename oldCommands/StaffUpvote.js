const { SlashCommandBuilder } = require('@discordjs/builders')
const User = require('../schemas/staffApplications')
const SS = require('../schemas/serverSettings')

function array_remove(arr, element) {
    return arr.filter((el) => {
        return el != element
    })
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('upvote')
        .addStringOption(opt => opt.setName('cod').setDescription('Codul aplicatiei la care vrei sa dai upvote.').setRequired(true))
        .setDescription('Dai upvote la o aplicatie staff.'),
    async execute(interaction) {
        const code = interaction.options.getString('cod')
        try {
            await User.exists({'code':code})
                .then(async exists => {
                    if(!exists) {
                        await interaction.reply({content:`**Codul \`${code}\` nu exista sau aplicatia a fost stearsa.**`, ephemeral:true})
                        throw 1
                    }
                })
        } catch(e) {
            if(e == 1) {return}
        }
        const result = await User.find({'code':code})
        const candidat_id = result[0]._id
        const position = result[0].position
        const ls_upvotes = result[0].upvotes
        const ls_downvotes = result[0].downvotes

        if(!(interaction.member.roles.cache.has('876759046336688138') || interaction.member.roles.cache.has('903801138636279858'))) {
            await interaction.reply({content: `**Nu ai acces la aceasta comanda!**`, ephemeral:true})
            return
        }
        if(ls_upvotes.includes(interaction.user.id)) {
            await interaction.reply({content:`**Deja ai dat upvote la aceasta aplicatie!**`, ephemeral:true})
            return
        }
        if(ls_downvotes.includes(interaction.user.id)) {
            ls_upvotes.push(interaction.user.id)
            const ls = array_remove(ls_downvotes, `${interaction.user.id}`)
            console.log(`downvotes: ${ls}\nupvotes: ${ls_downvotes}`)
            await User.findOneAndUpdate({"code":code}, {$set: {"downvotes": ls}})
            await User.findOneAndUpdate({"code":code}, {$set: {"upvotes": ls_upvotes}})
            await interaction.reply({content:`**Ai schimbat votul pentru aceasta aplicatie in upvote.**`, ephemeral:true})
            return
        }
        if(!ls_downvotes.includes(interaction.user.id) && !ls_upvotes.includes(interaction.user.id)) {
            ls_upvotes.push(interaction.user.id)
            try {
                await interaction.guild.members.fetch()
                    .then(async res => {
                        const staff_count = res.filter(member => member.roles.cache.has('876759046336688138'))
                        const trial_helpers = res.filter(member => member.roles.cache.has('903801138636279858'))
                        await interaction.reply({content:`**Ai dat upvote la aplicatia cu codul \`${code}\`!**`, ephemeral:true})
                        if(ls_upvotes.length + ls_downvotes.length == staff_count.size - trial_helpers.size) {
                            const candidat = interaction.guild.members.cache.get(candidat_id)
                            await SS.findOneAndUpdate({_id: 'BornFromAshes'}, {$set: {[`restricted.${candidat_id}`]:position}})
                            await User.findOneAndDelete({"code":code})
                            if(ls_upvotes.length < 3/4 * (staff_count.size - trial_helpers.size)) {
                                await candidat.send(`**Imi pare rau dar trebuie sa te anunt ca aplicatia ta a fost refuzata de catre cei din STAFF.**\n**Iti urez multa bafta pentru viitoarele aplicatii!**`)
                                throw 1
                            } else {
                                const obj = {
                                    'helper':'Helper', 'helpertrial':'Helper trial', 'admin':'Admin'
                                }
                                let name = ''
                                for(const [key, value] of Object.entries(obj)) {
                                    if(key == position)
                                        name = value
                                }
                                await candidat.send(`*Felicitari,*\n**Din acest moment esti \`${name}\` pe BornFromAshes.**\n**Multa bafta!**`)
                                const staff = interaction.guild.roles.cache.get('876759046336688138')
                                if(position == 'helper')
                                    reward = interaction.guild.roles.cache.get('903801032293900369')
                                else if(position == 'helpertrial')
                                    reward = interaction.guild.roles.cache.get('903801138636279858')
                                else if(position == 'admin')
                                    reward = interaction.guild.roles.cache.get('903800806095069195')
                                await candidat.roles.add(staff)
                                await candidat.roles.add(reward)
                                throw 1
                            }
                        }
                    })
                await User.findOneAndUpdate({"code":code}, {$set: {"upvotes": ls_upvotes}})
            } catch(e) {
                if(e == 1) {return}
            }
        }
    }
}