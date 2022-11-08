const { MessageEmbed, Interaction } = require("discord.js")
const User = require('../schemas/tagTime')

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        if(!message.author.bot && 
        message.channel.id != '838179932823093288' &&
        message.channel.id != '905229928973353022' &&
        message.channel.id != '582267057194795018') {
            await User.exists({_id:message.author.id})
                .then(async exists => {
                    if(!exists) {
                        await User.create({
                            _id:message.author.id,
                        })
                    }
                })
            await User.exists({_id:message.author.id, "dailymsg":{$exists:true}})
                .then(async exists => {
                    if(exists)
                        await User.findByIdAndUpdate({_id:message.author.id}, {$inc: {"dailymsg": 1}})
                    else {
                        await User.findByIdAndUpdate({_id:message.author.id}, {"dailymsg": 1})
                    }
                })
        }
    }
}